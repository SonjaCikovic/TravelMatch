const authMiddleware = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const pool = require('../db');
const upload = require('../middleware/upload');

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const rezultat = await pool.query('SELECT id, ime, prezime, email, datum_rodenja, spol, grad, telefon, bio, profilna_slika FROM users WHERE id = $1', [req.korisnik.id]);
        const korisnik = rezultat.rows[0];
        res.json(korisnik);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.put('/profile', authMiddleware, async (req, res) => {
    const { ime, prezime, spol, grad, telefon, bio, profilna_slika } = req.body;
    try{
        const promjenjeno = await pool.query('UPDATE users SET ime = $1, prezime = $2, spol = $3, grad = $4, telefon = $5, bio = $6, profilna_slika = $7 WHERE id = $8 RETURNING id, ime, email', 
                                            [ime, prezime, spol, grad, telefon, bio, profilna_slika, req.korisnik.id]);
        res.json(promjenjeno.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.get('/:id', async (req,res) => {
    try {
        const rezultat = await pool.query('SELECT id, ime, prezime, email, datum_rodenja, spol, grad, bio, profilna_slika FROM users WHERE id = $1', [req.params.id]);
        const korisnik = rezultat.rows[0];
        res.json(korisnik);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.post('/upload-image', authMiddleware, upload.single('profilna_slika'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: 'No file uploaded'});
        }
        const url = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
        await pool.query('UPDATE users SET profilna_slika = $1 WHERE id = $2', [url, req.korisnik.id]);
        res.json({url});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

module.exports = router;