const authMiddleware = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/:trip_id/requests', authMiddleware, async (req,res) => {
    try {
        const organizator_id = await pool.query('SELECT organizator_id FROM trips WHERE id = $1', [req.params.trip_id]);
        if (req.korisnik.id === organizator_id.rows[0].organizator_id){
            return res.status(403).json({error: 'Wrong id'});
        }
        const postojiZahtjev = await pool.query('SELECT * FROM trip_requests WHERE trip_id = $1 AND korisnik_id = $2', [req.params.trip_id, req.korisnik.id]);
        if (postojiZahtjev.rowCount > 0) {
            return res.status(403).json({error: 'Request already exists'});
        }
        const status = await pool.query('SELECT status FROM trips WHERE id = $1', [req.params.trip_id]);
        if (status.rows[0].status != 'active') {
            return res.status(403).json({error: 'Trip not active'});
        }
        const sudionici = await pool.query('SELECT COUNT(*) FROM trip_participants WHERE trip_id = $1', [req.params.trip_id]);
        const kapacitet = await pool.query('SELECT max_sudionici FROM trips WHERE id = $1', [req.params.trip_id]);
        if (parseInt(sudionici.rows[0].count) >= kapacitet.rows[0].max_sudionici) {
            return res.status(403).json({error: 'Trip full'});
        }
        const korisnik = await pool.query('SELECT spol, datum_rodenja FROM users WHERE id = $1', [req.korisnik.id]);
        const ogranicenja = await pool.query('SELECT dozvoljeni_spol, minimalna_dob, maksimalna_dob FROM trips WHERE id = $1', [req.params.trip_id]);
        const danas = new Date();
        const rodjen = new Date(korisnik.rows[0].datum_rodenja);
        const godine = danas.getFullYear() - rodjen.getFullYear();
        if ((ogranicenja.rows[0].dozvoljeni_spol !== "all" && korisnik.rows[0].spol !== ogranicenja.rows[0].dozvoljeni_spol) ||
             godine > ogranicenja.rows[0].maksimalna_dob || godine < ogranicenja.rows[0].minimalna_dob) {
            return res.status(403).json({error: 'Cannot join this trip'});
        }
        const noviZahtjev = await pool.query('INSERT INTO trip_requests (trip_id, korisnik_id) VALUES ($1, $2) RETURNING *', [req.params.trip_id, req.korisnik.id]);
        res.json(noviZahtjev.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.get('/:trip_id/requests/my', authMiddleware, async(req, res) => {
    try {
        const zahtjev = await pool.query('SELECT * FROM trip_requests WHERE trip_id = $1 AND korisnik_id = $2', [req.params.trip_id, req.korisnik.id]);
        res.json({sent: zahtjev.rowCount > 0});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
})

router.get('/:trip_id/requests', authMiddleware, async (req,res) => {
    try {
        const organizator = await pool.query('SELECT organizator_id FROM trips WHERE id = $1', [req.params.trip_id]);
        if (organizator.rows[0].organizator_id != req.korisnik.id){
            return res.status(403).json({error: 'Wrong id'});
        }  
        const zahtjevi = await pool.query(`SELECT trip_requests.id, trip_requests.korisnik_id, trip_requests.status, users.ime, users.prezime, users.profilna_slika
            FROM trip_requests JOIN users ON users.id = trip_requests.korisnik_id WHERE trip_requests.trip_id = $1 AND trip_requests.status = 'pending'`, [req.params.trip_id]);
        res.json(zahtjevi.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.put('/:trip_id/requests/:request_id', authMiddleware, async (req,res) => {
    const {status} = req.body;

    try {
        const organizator = await pool.query('SELECT organizator_id FROM trips WHERE id = $1', [req.params.trip_id]);
        if (organizator.rows[0].organizator_id != req.korisnik.id){
            return res.status(403).json({error: 'Wrong id'});
        }  
        const stanjeZahtjeva = await pool.query('UPDATE trip_requests SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.request_id]);
        if (status === 'accepted'){
            const zahtjev = await pool.query('SELECT korisnik_id FROM trip_requests WHERE id = $1', [req.params.request_id]);
            const noviKorisnik = await pool.query('INSERT INTO trip_participants (trip_id, user_id) VALUES ($1, $2)', [req.params.trip_id, zahtjev.rows[0].korisnik_id]);
        }
        res.json({message: 'User added'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

module.exports = router;