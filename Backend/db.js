const mysql = require('mysql2');
require('dotenv').config();

  // moje prihlasovacie údaje z .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise(); 

//TESTOVACIA FUNKCIA NA OVERENIE PRIPOJENIA K DATABÁZE
async function testDBConnection() {
    try {
        const [rows] = await pool.query('SELECT "Pripojenie uspesne!" AS status');
        console.log('Úspešné pripojenie k databáze!');
        console.log('Odpoveď databázy:', rows[0].status);
        
    } catch (error) {
        console.error('CHYBA PRIPOJENIA K DATABÁZE!');
        console.error('Skontrolujte .env súbor a status databázového servera.');
        console.error('Detail chyby:', error.message);
        
        process.exit(1);
    }
}

module.exports = {
    db: pool,
    testDBConnection: testDBConnection 
};