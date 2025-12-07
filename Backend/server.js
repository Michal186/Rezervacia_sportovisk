// server.js alebo authRoutes.js

const express = require('express');
// Pridané: jwt a dotenv
const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 
// db sa teraz importuje priamo z objektu, ako je exportovaný v db.js, pre zjednodušenie to meníme z { db, testDBConnection } na db a testDBConnection
const { db, testDBConnection } = require('./db'); 
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;
const cors = require("cors");

app.use(cors());
// Middleware pre spracovanie JSON dát
app.use(express.json());

// TEST: Overenie pripojenia pred spustením servera
testDBConnection().then(() => {
    // Ak je pripojenie v poriadku, spustíme server
    app.listen(PORT, () => {
        console.log(`Server beží na porte ${PORT}`);
    });
});

// ===========================================
// POST /api/register - REGISTRAČNÝ ENDPOINT (Tvoj existujúci kód)
// ===========================================
app.post('/api/register', async (req, res) => {
    const { meno, email, heslo } = req.body;

    if (!meno || !email || !heslo) {
        return res.status(400).json({ message: 'Všetky polia (meno, email, heslo) sú povinné.' });
    }

    try {
        const [existingUser] = await db.query('SELECT id FROM pouzivatel WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Používateľ s týmto emailom už existuje.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(heslo, saltRounds);

        const result = await db.query(
            'INSERT INTO pouzivatel (meno, email, heslo, rola) VALUES (?, ?, ?, ?)',
            [meno, email, hashedPassword, 'user']
        );
        
        res.status(201).json({ 
            message: 'Používateľ úspešne zaregistrovaný.', 
            userId: result.insertId 
        });

    } catch (error) {
        console.error('Chyba pri registrácii:', error);
        res.status(500).json({ message: 'Nastala serverová chyba.' });
    }
});

// ===========================================
// POST /api/login - PRIHLASOVACÍ ENDPOINT
// ===========================================
app.post('/api/login', async (req, res) => {
    const { email, heslo } = req.body;

    // 1. Validácia vstupu
    if (!email || !heslo) {
        return res.status(400).json({ message: 'Email a heslo sú povinné.' });
    }

    try {
        // 2. Nájdeme používateľa a získame hashované heslo
        const [users] = await db.query(
            'SELECT id, meno, heslo, rola FROM pouzivatel WHERE email = ?', 
            [email]
        );

        const user = users[0];

        if (!user) {
            // Používateľ nebol nájdený
            return res.status(401).json({ message: 'Nesprávny email alebo heslo.' });
        }

        // 3. Overenie hesla pomocou bcrypt.compare
        const passwordMatch = await bcrypt.compare(heslo, user.heslo);

        if (!passwordMatch) {
            // Heslá sa nezhodujú
            return res.status(401).json({ message: 'Nesprávny email alebo heslo.' });
        }

        // 4. Generujeme JWT token
        const token = jwt.sign(
            { id: user.id, rola: user.rola },
            process.env.JWT_SECRET, // Tajný kľúč z .env
            { expiresIn: '1h' } // Token vyprší po 1 hodine
        );

        // 5. Úspešná odpoveď: Vrátime token
        res.status(200).json({ 
            message: 'Prihlásenie úspešné.', 
            token: token,
            user: { id: user.id, meno: user.meno, rola: user.rola }
        });

    } catch (error) {
        console.error('Chyba pri prihlásení:', error);
        res.status(500).json({ message: 'Nastala chyba servera pri autentifikácii.' });
    }
});

// V pôvodnom kóde bola táto časť redundantná, pretože listen sa volá už v testDBConnection().then(...)
// app.listen(PORT, () => {
//     console.log(`Server beží na porte ${PORT}`);
// });