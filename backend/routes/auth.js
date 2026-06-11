const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

router.post('/register', async (req, res) => {
    const { ime, prezime, email, lozinka, datum_rodenja, spol, grad, telefon, bio, profilna_slika } = req.body;

    try{
        const email_exists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (email_exists.rowCount > 0){
            return res.status(400).json({error: 'Email already exists'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedLozinka = await bcrypt.hash(lozinka, salt);
        const new_user = await pool.query('INSERT INTO users (ime, prezime, email, lozinka, datum_rodenja, spol, grad, telefon, bio, profilna_slika) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, ime, email', 
                                            [ime, prezime, email, hashedLozinka, datum_rodenja, spol, grad, telefon, bio, profilna_slika]);
        const token = jwt.sign({id: new_user.rows[0].id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.json({ token, korisnik: new_user.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

router.post('/login', async (req, res) => {
    const {email, lozinka} = req.body;

    try{
        const user_exists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user_exists.rowCount === 0){
            return res.status(400).json({error: 'Wrong email or password'});
        }
        const tocan_unos = await bcrypt.compare(lozinka, user_exists.rows[0].lozinka);
        if (!tocan_unos){
            return res.status(400).json({error: 'Wrong email or password'});
        }
        const token = jwt.sign({id: user_exists.rows[0].id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.json({message: 'User valid', token, korisnik: {
            id: user_exists.rows[0].id, ime: user_exists.rows[0].ime, email: user_exists.rows[0].email
        }});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error on server'});
    }
});

module.exports = router;