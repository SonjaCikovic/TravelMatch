const authMiddleware = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/:trip_id/ratings', authMiddleware, async (req,res) => {
    const {ocjenjen_id, ocjena, komentar} = req.body;

    try {
        const sudjelovao = await pool.query('SELECT id FROM trip_participants WHERE trip_id = $1 AND user_id = $2', [req.params.trip_id, req.korisnik.id]);
        const organizator = await pool.query('SELECT organizator_id FROM trips WHERE id = $1 AND organizator_id = $2', [req.params.trip_id, req.korisnik.id]);
        if (sudjelovao.rowCount === 0 && organizator.rowCount === 0){
            return res.status(403).json({error: 'Did not participate in this trip'});
        }
        const zavrsen_put = await pool.query('SELECT status FROM trips WHERE id = $1', [req.params.trip_id]);
        if (zavrsen_put.rows[0].status != 'completed'){
            return res.status(403).json({error: 'Trip is not completed'});
        }
        const postojiOcjena = await pool.query('SELECT id FROM ratings WHERE ocjenjivac_id = $1 AND ocjenjen_id = $2 AND trip_id = $3', [req.korisnik.id, ocjenjen_id, req.params.trip_id]);
        if (postojiOcjena.rowCount != 0){
            return res.status(403).json({error: 'Rating already done'});
        }
        const unosOcjene = await pool.query('INSERT INTO ratings (ocjenjivac_id, ocjenjen_id, trip_id, ocjena, komentar) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
            [req.korisnik.id, ocjenjen_id, req.params.trip_id, ocjena, komentar]);
        res.json(unosOcjene.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.get('/users/:user_id/ratings', async (req,res) => {
    try {
        const ocjene = await pool.query('SELECT * FROM ratings WHERE ocjenjen_id = $1', [req.params.user_id]);
        const prosjek = await pool.query('SELECT ROUND(AVG(ocjena), 2) as prosjek FROM ratings WHERE ocjenjen_id = $1', [req.params.user_id]);
        res.json({ratings: ocjene.rows, prosjek: prosjek.rows[0].prosjek});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.get('/:trip_id/ratings/my', authMiddleware, async (req, res) => {
    try {
        const ocjene = await pool.query('SELECT ocjenjen_id FROM ratings WHERE trip_id = $1 AND ocjenjivac_id = $2', [req.params.trip_id, req.korisnik.id]);
        res.json(ocjene.rows.map(r => r.ocjenjen_id));
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

module.exports = router;