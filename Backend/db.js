// db.js

const mysql = require('mysql2');
require('dotenv').config();

// ... definícia poolu ...

const pool = mysql.createPool({
  // ... tvoje prihlasovacie údaje z .env ...
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise(); // Používame promise verziu

// >>> TOTO JE TESTOVACIA FUNKCIA <<<
async function testDBConnection() {
    try {
        // Skúsime spustiť jednoduchý dotaz na overenie pripojenia
        const [rows] = await pool.query('SELECT "Pripojenie uspesne!" AS status');
        
        // Ak dotaz prebehne bez chyby, pripojenie funguje
        console.log('✅ Úspešné pripojenie k databáze!');
        console.log('Odpoveď databázy:', rows[0].status);
        
    } catch (error) {
        // Akákoľvek chyba tu znamená zlé údaje alebo nedostupnosť DB
        console.error('❌ CHYBA PRIPOJENIA K DATABÁZE!');
        console.error('Skontrolujte .env súbor a status databázového servera.');
        console.error('Detail chyby:', error.message);
        
        // Je dobré ukončiť aplikáciu, ak sa nedokáže pripojiť k databáze
        process.exit(1);
    }
}

module.exports = {
    db: pool,
    testDBConnection: testDBConnection // Exportujeme testovaciu funkciu
};