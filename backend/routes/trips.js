const authMiddleware = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', authMiddleware, async (req, res) => {
    const { naslov, opis, pocetni_grad, zavrsni_grad, datum_polaska, datum_povratka, kategorija, budzet, tip_smjestaja, tip_organizacije, max_sudionici, dozvoljeni_spol, minimalna_dob, maksimalna_dob} = req.body;

    try {
        const new_trip = await pool.query('INSERT INTO trips(organizator_id, naslov, opis, pocetni_grad, zavrsni_grad, datum_polaska, datum_povratka, kategorija, budzet, tip_smjestaja, tip_organizacije, max_sudionici, dozvoljeni_spol, minimalna_dob, maksimalna_dob) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id, status, created_at', 
            [req.korisnik.id, naslov, opis, pocetni_grad, zavrsni_grad, datum_polaska, datum_povratka, kategorija, budzet, tip_smjestaja, tip_organizacije, max_sudionici, dozvoljeni_spol, minimalna_dob, maksimalna_dob]);
        res.json(new_trip.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.get('/', async(req, res) => {
    const {grad, datum_polaska, datum_povratka, kategorija, dozvoljeni_spol, minimalna_dob, maksimalna_dob, tip_smjestaja, min_budzet, max_budzet} = req.query;

    try {
        let trazeno = 'SELECT * FROM trips WHERE status = \'active\'';
        const vrijednosti = [];

        if (grad) {
            vrijednosti.push(`%${grad}%`);
            trazeno += ` AND (pocetni_grad ILIKE $${vrijednosti.length} OR zavrsni_grad ILIKE $${vrijednosti.length} OR EXISTS (SELECT 1 FROM trip_cities WHERE trip_cities.trip_id = trips.id AND trip_cities.grad ILIKE $${vrijednosti.length}))`;
        }
        if (datum_polaska) {
            vrijednosti.push(datum_polaska);
            trazeno += ` AND datum_polaska = $${vrijednosti.length}`;
        }
        if (datum_povratka) {
            vrijednosti.push(datum_povratka);
            trazeno += ` AND datum_povratka = $${vrijednosti.length}`;
        }
        if (tip_smjestaja) {
            vrijednosti.push(tip_smjestaja);
            trazeno += ` AND tip_smjestaja = $${vrijednosti.length}`;
        }
        if (min_budzet) {
            vrijednosti.push(min_budzet);
            trazeno += ` AND budzet >= $${vrijednosti.length}`;
        }
        if (max_budzet) {
            vrijednosti.push(max_budzet);
            trazeno += ` AND budzet <= $${vrijednosti.length}`;
        }
        if (kategorija) {
            vrijednosti.push(kategorija);
            trazeno += ` AND kategorija = $${vrijednosti.length}`;
        }
        if (dozvoljeni_spol) {
            vrijednosti.push(dozvoljeni_spol);
            trazeno += ` AND (dozvoljeni_spol = $${vrijednosti.length} OR dozvoljeni_spol = 'all')`;
        }
        if (minimalna_dob) {
            vrijednosti.push(minimalna_dob);
            trazeno += ` AND minimalna_dob <= $${vrijednosti.length}`;
        }
        if (maksimalna_dob) {
            vrijednosti.push(maksimalna_dob);
            trazeno += ` AND maksimalna_dob >= $${vrijednosti.length}`;
        }

        const rezultat = await pool.query(trazeno, vrijednosti);
        res.json(rezultat.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.get('/my', authMiddleware, async(req, res) => {
    try {
        const mojiTrips = await pool.query('SELECT * FROM trips WHERE organizator_id = $1', [req.korisnik.id]);
        res.json(mojiTrips.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.get('/joined', authMiddleware, async(req, res) => {
    try {
        const pridruzeniTrips = await pool.query('SELECT trips.* FROM trips JOIN trip_participants ON trip_participants.trip_id = trips.id WHERE trip_participants.user_id = $1', [req.korisnik.id]);
        res.json(pridruzeniTrips.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.get('/:id', async(req, res) => {
    try {
        const all_trips = await pool.query('SELECT trips.*, trip_cities.id as city_id, trip_cities.grad, trip_cities.redoslijed, trip_cities.prijevoz, trip_cities.trajanje, users.telefon as org_telefon, users.email as org_email, users.ime as org_ime, users.prezime as org_prezime FROM trips LEFT JOIN trip_cities ON trip_cities.trip_id = trips.id JOIN users ON users.id = trips.organizator_id WHERE trips.id = $1 ORDER BY trip_cities.redoslijed', 
            [req.params.id]);
        const {city_id, grad, redoslijed, prijevoz, trajanje, ...trip} = all_trips.rows[0];
        const gradovi = all_trips.rows.map(row => ({
            grad: row.grad,
            redoslijed: row.redoslijed,
            prijevoz: row.prijevoz,
            trajanje: row.trajanje
        }));
        res.json({...trip, gradovi});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.put('/:id', authMiddleware, async(req, res) => {
    const { naslov, opis, pocetni_grad, zavrsni_grad, datum_polaska, datum_povratka, kategorija, budzet, tip_smjestaja, tip_organizacije, max_sudionici, dozvoljeni_spol, minimalna_dob, maksimalna_dob } = req.body;

    try {
        const organizator = await pool.query('SELECT organizator_id FROM trips WHERE id = $1', [req.params.id]);
        if (organizator.rows[0].organizator_id != req.korisnik.id){
            return res.status(403).json({error: 'Wrong id'});
        }
        const all_trips = await pool.query('UPDATE trips SET naslov = $2, opis = $3, pocetni_grad = $4, zavrsni_grad = $5, datum_polaska = $6, datum_povratka = $7, kategorija = $8, budzet = $9, tip_smjestaja = $10, tip_organizacije = $11, max_sudionici = $12, dozvoljeni_spol = $13, minimalna_dob = $14, maksimalna_dob = $15 WHERE id = $1 RETURNING id, status, created_at', 
                [req.params.id, naslov, opis, pocetni_grad, zavrsni_grad, datum_polaska, datum_povratka, kategorija, budzet, tip_smjestaja, tip_organizacije, max_sudionici, dozvoljeni_spol, minimalna_dob, maksimalna_dob]);
        res.json(all_trips.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.delete('/:id', authMiddleware, async(req, res) => {
    try {
        const organizator = await pool.query('SELECT organizator_id FROM trips WHERE id = $1', [req.params.id]);
        if (organizator.rows[0].organizator_id != req.korisnik.id){
            return res.status(403).json({error: 'Wrong id'});
        }
        const deleting_trip = await pool.query('DELETE FROM trips WHERE id = $1', [req.params.id]);
        res.json({poruka: 'Trip deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.get('/:id/participants', async(req,res) => {
    try {
        const sudionici = await pool.query('SELECT users.id, users.ime, users.prezime, users.profilna_slika, users.telefon, users.email FROM trip_participants JOIN users ON users.id = trip_participants.user_id WHERE trip_participants.trip_id = $1', [req.params.id]);
        res.json(sudionici.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.delete('/:id/participants/:user_id', authMiddleware, async (req, res) => {
    try {
        const organizator = await pool.query('SELECT organizator_id FROM trips WHERE id = $1', [req.params.id]);
        if (organizator.rows[0].organizator_id != req.korisnik.id){
            return res.status(403).json({error: 'Wrong id'});
        }
        await pool.query('DELETE FROM trip_participants WHERE trip_id = $1 AND user_id = $2', [req.params.id, req.params.user_id]);
        await pool.query('DELETE FROM trip_requests WHERE trip_id = $1 AND korisnik_id = $2', [req.params.id, req.params.user_id]);
        res.json({poruka: 'Participant removed'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

module.exports = router;