const authMiddleware = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/:trip_id/cities', authMiddleware, async (req, res) => {
    const {grad, redoslijed, prijevoz, trajanje} = req.body;

    try {
        const organizator = await pool.query('SELECT organizator_id FROM trips WHERE id = $1', [req.params.trip_id]);
        if (organizator.rows[0].organizator_id != req.korisnik.id){
            return res.status(403).json({error: 'Wrong id'});
        }
        const new_city = await pool.query('INSERT INTO trip_cities(trip_id, grad, redoslijed, prijevoz, trajanje) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
            [req.params.trip_id, grad, redoslijed, prijevoz, trajanje]);
        res.json(new_city.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.put('/:trip_id/cities/:city_id', authMiddleware, async (req, res) => {
    const {grad, redoslijed, prijevoz, trajanje} = req.body;
    try {
        const organizator = await pool.query('SELECT organizator_id FROM trips WHERE id = $1', [req.params.trip_id]);
        if (organizator.rows[0].organizator_id != req.korisnik.id){
            return res.status(403).json({error: 'Wrong id'});
        }
        const all_cities = await pool.query('UPDATE trip_cities  SET grad = $1, redoslijed = $2, prijevoz = $3, trajanje = $4 WHERE id = $5 RETURNING *', 
            [grad, redoslijed, prijevoz, trajanje, req.params.city_id]);
        res.json(all_cities.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.delete('/:trip_id/cities/:city_id', authMiddleware, async (req, res) => {
    try {
        const organizator = await pool.query('SELECT organizator_id FROM trips WHERE id = $1', [req.params.trip_id]);
        if (organizator.rows[0].organizator_id != req.korisnik.id){
            return res.status(403).json({error: 'Wrong id'});
        }
        const delete_city = await pool.query('DELETE FROM trip_cities WHERE id = $1', [req.params.city_id]);
        res.json({poruka: 'City deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.delete('/:trip_id/cities', authMiddleware, async (req, res) => {
    try {
        const organizator = await pool.query('SELECT organizator_id FROM trips WHERE id = $1', [req.params.trip_id]);
        if (organizator.rows[0].organizator_id != req.korisnik.id){
            return res.status(403).json({error: 'Wrong id'});
        }
        await pool.query('DELETE FROM trip_cities WHERE trip_id = $1', [req.params.trip_id]);
        res.json({poruka: 'Cities deleted'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
})

module.exports = router;