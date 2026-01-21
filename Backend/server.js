const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();

const { db, testDBConnection } = require("./db");

const app = express();
const PORT = 3000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

/* =========================
   AUTH MIDDLEWARE
========================= */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Chýba token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Neplatný token" });
    }

    req.user = decoded; 
    next();
  });
};


const verifyAdmin = (req, res, next) => {
  if (req.user.rola !== "admin") {
    return res.status(403).json({ message: "Nemáš admin práva" });
  }
  next();
};

/* =========================
  REGISTRÁCIA
========================= */
app.post("/api/register", async (req, res) => {
  const { meno, email, heslo, confirmHeslo } = req.body;

  // Kontrola, či sú vyplnené všetky polia
  if (!meno || !email || !heslo || !confirmHeslo) {
    return res.status(400).json({ message: "Všetky polia sú povinné." });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Emailová adresa je neplatná." });
  }

  if (heslo.length < 6) {
    return res.status(400).json({ message: "Heslo musí mať aspoň 6 znakov." });
  }

  if (heslo !== confirmHeslo) {
    return res.status(400).json({ message: "Heslá sa nezhodujú." });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM pouzivatel WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Používateľ s týmto emailom už existuje." });
    }

    const hashedPassword = await bcrypt.hash(heslo, 10);

    await db.query(
      "INSERT INTO pouzivatel (meno, email, heslo, rola) VALUES (?, ?, ?, ?)",
      [meno.trim(), email, hashedPassword, "user"]
    );

    res.status(201).json({ message: "Registrácia úspešná." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba servera pri registrácii." });
  }
});

/* =========================
  LOGIN
========================= */
app.post("/api/login", async (req, res) => {
  const { email, heslo } = req.body;

  if (!email || !heslo) {
    return res.status(400).json({ message: "Chýba email alebo heslo" });
  }

  try {
    const [users] = await db.query(
      "SELECT id, meno, heslo, rola FROM pouzivatel WHERE email = ?",
      [email]
    );

    const user = users[0];
    if (!user) {
      return res.status(401).json({ message: "Zlé údaje" });
    }

    const match = await bcrypt.compare(heslo, user.heslo);
    if (!match) {
      return res.status(401).json({ message: "Zlé údaje" });
    }

    const token = jwt.sign(
      { id: user.id, rola: user.rola },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        meno: user.meno,
        rola: user.rola,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba servera" });
  }
});




/* =========================
   ADMIN – USERS
========================= */
app.get("/api/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, meno, email, rola FROM pouzivatel"
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba servera" });
  }
});

// VYMAZANIE POUŽÍVATEĽA
app.delete("/api/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM pouzivatel WHERE id = ?", [id]);
    res.json({ message: "Používateľ odstránený" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba servera" });
  }
});


// ÚPRAVA POUŽÍVATEĽA (Meno, Email, Rola)
app.put("/api/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { meno, email, rola } = req.body;

  // Základná validácia
  if (!meno || !email || !rola) {
    return res.status(400).json({ message: "Všetky polia sú povinné" });
  }

  try {
    // Spustíme UPDATE v databáze
    const [result] = await db.query(
      "UPDATE pouzivatel SET meno = ?, email = ?, rola = ? WHERE id = ?",
      [meno, email, rola, id]
    );

    // Skontrolujeme, či sa riadok naozaj zmenil
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Používateľ nenájdený" });
    }

    res.json({ message: "Údaje používateľa boli úspešne upravené" });
  } catch (err) {
    console.error("Chyba pri UPDATE pouzivatel:", err);
    res.status(500).json({ message: "Chyba servera pri úprave používateľa" });
  }
});



/* =========================
   ŠPORTOVISKÁ
========================= */

// GET - Zoznam všetkých športovísk
app.get("/api/sportoviska", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sportovisko");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba pri načítaní športovísk" });
  }
});

// POST - Pridanie nového športoviska
app.post("/api/sportoviska", verifyToken, verifyAdmin, async (req, res) => {
  const { nazov, lokalita, adresa, typ, cena_za_hodinu } = req.body;
  
  try {
    await db.query(
      "INSERT INTO sportovisko (nazov, lokalita, adresa, typ, cena_za_hodinu) VALUES (?, ?, ?, ?, ?)",
      [nazov, lokalita, adresa, typ, cena_za_hodinu]
    );
    res.status(201).json({ message: "Športovisko vytvorené" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba pri vytváraní športoviska" });
  }
});

// PUT - Úprava existujúceho športoviska
app.put("/api/sportoviska/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { nazov, lokalita, adresa, typ, cena_za_hodinu } = req.body;
  const { id } = req.params;

  try {
    await db.query(
      "UPDATE sportovisko SET nazov=?, lokalita=?, adresa=?, typ=?, cena_za_hodinu=? WHERE id=?",
      [nazov, lokalita, adresa, typ, cena_za_hodinu, id]
    );
    res.json({ message: "Športovisko upravené" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba pri úprave športoviska" });
  }
});

// DELETE - Odstránenie športoviska
app.delete("/api/sportoviska/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.query("DELETE FROM sportovisko WHERE id=?", [id]);
    res.status(200).json({ message: "Športovisko vymazané" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba pri mazaní športoviska" });
  }
});


// =========================
// GALÉRIA
// =========================
app.get("/api/galeria/:sportoviskoId", verifyToken, verifyAdmin, async (req, res) => {
  const { sportoviskoId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT id, adresa_obrazka FROM galeria WHERE sportovisko_id = ?",
      [sportoviskoId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Chyba pri načítaní galérie", err);
    res.status(500).json({ message: "Chyba servera" });
  }
});


// post - Pridanie obrázku do galérie
app.post("/api/galeria", verifyToken, verifyAdmin, async (req, res) => {
  const { sportovisko_id, adresa_obrazka } = req.body;

  if (!sportovisko_id || !adresa_obrazka) {
    return res.status(400).json({ message: "Chýbajú údaje" });
  }

  try {
    await db.query(
      "INSERT INTO galeria (sportovisko_id, adresa_obrazka) VALUES (?, ?)",
      [sportovisko_id, adresa_obrazka]
    );
    res.status(201).json({ message: "Obrázok pridaný" });
  } catch (err) {
    console.error("Chyba pri pridávaní obrázku", err);
    res.status(500).json({ message: "Chyba servera" });
  }
});

// DELETE - Odstránenie obrázku z galérie
app.delete("/api/galeria/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM galeria WHERE id = ?", [id]);
    res.json({ message: "Obrázok odstránený" });
  } catch (err) {
    console.error("Chyba pri mazaní obrázku", err);
    res.status(500).json({ message: "Chyba servera" });
  }
});





/* =========================
   TERMÍNY 
========================= */
app.get("/api/terminy/:sportoviskoId", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { sportoviskoId } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM termin WHERE sportovisko_id = ? ORDER BY datum, cas_od",
      [sportoviskoId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Interná chyba servera" });
  }
});

app.post("/api/terminy", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { sportovisko_id, datum, cas_od, cas_do } = req.body;
    await db.query(
      "INSERT INTO termin (sportovisko_id, datum, cas_od, cas_do) VALUES (?, ?, ?, ?)",
      [sportovisko_id, datum, cas_od, cas_do]
    );
    res.status(201).json({ message: "Vytvorené" });
  } catch (error) {
    res.status(500).json({ error: "Interná chyba servera" });
  }
});

app.delete("/api/terminy/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM termin WHERE id = ?", [req.params.id]);
    res.status(200).json({ message: "Odstránené" }); 
  } catch (error) {
    res.status(500).json({ error: "Interná chyba servera" });
  }
});

// put - Úprava termínu
app.put("/api/terminy/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { datum, cas_od, cas_do } = req.body;

  try {
    await db.query(
      "UPDATE termin SET datum = ?, cas_od = ?, cas_do = ? WHERE id = ?",
      [datum, cas_od, cas_do, id]
    );
    res.json({ message: "Termín úspešne upravený" });
  } catch (error) {
    console.error("Chyba pri UPDATE /api/terminy:", error);
    res.status(500).json({ error: "Interná chyba servera" });
  }
});

// =========================
// ŠPORTOVISKÁ – PUBLIC
// =========================
app.get("/api/public/sportoviska", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, nazov, lokalita, adresa, typ, cena_za_hodinu
      FROM sportovisko
      ORDER BY nazov
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba servera" });
  }
});

// get - Detail konkrétneho športoviska (verejná)
app.get("/api/public/sportoviska/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sportovisko WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Nenašlo sa" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Chyba servera" });
  }
});

// get - Galéria konkrétneho športoviska (verejná)
app.get("/api/public/sportoviska/:id/galeria", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, adresa_obrazka FROM galeria WHERE sportovisko_id = ?", [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Chyba servera" });
  }
});

// get - Iba voľné termíny pre konkrétne športovisko
app.get("/api/public/sportoviska/:id/terminy", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT * FROM termin 
       WHERE sportovisko_id = ? 
       AND id NOT IN (SELECT termin_id FROM rezervacia)
       ORDER BY datum, cas_od`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba pri načítaní termínov" });
  }
});

/* =========================
   REZERVÁCIE (UŽÍVATEĽSKÉ)
========================= */
app.post("/api/rezervacie", verifyToken, async (req, res) => {
  const { termin_id } = req.body;
  const pouzivatel_id = req.user.id;

  if (!termin_id) {
    return res.status(400).json({ message: "Chýba identifikátor termínu." });
  }

  try {
    const [existujucaRezervacia] = await db.query(
      "SELECT id FROM rezervacia WHERE termin_id = ?",
      [termin_id]
    );

    if (existujucaRezervacia.length > 0) {
      return res.status(400).json({ message: "Tento termín je už bohužiaľ obsadený." });
    }

    await db.query(
      "INSERT INTO rezervacia (pouzivatel_id, termin_id) VALUES (?, ?)",
      [pouzivatel_id, termin_id]
    );

    res.status(201).json({ 
      success: true, 
      message: "Rezervácia bola úspešne vytvorená!" 
    });

  } catch (err) {
    console.error("Chyba pri vytváraní rezervácie:", err);
    res.status(500).json({ message: "Chyba servera pri ukladaní rezervácie." });
  }
});

/* =========================
   ZÍSKANIE REZERVÁCIÍ POUŽÍVATEĽA
========================= */
app.get("/api/moje-rezervacie", verifyToken, async (req, res) => {
  const pouzivatel_id = req.user.id;
  try {
    const [rows] = await db.query(
      `SELECT 
        r.id AS rezervacia_id,
        s.id AS sportovisko_id, -- TOTO JE DÔLEŽITÉ PRE RECENZIU
        s.nazov AS sportovisko_nazov,
        t.datum,
        t.cas_od,
        t.cas_do
      FROM rezervacia r
      JOIN termin t ON r.termin_id = t.id
      JOIN sportovisko s ON t.sportovisko_id = s.id
      WHERE r.pouzivatel_id = ?`,
      [pouzivatel_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Chyba servera" });
  }
});


/* =========================
   RECENZIE - PRIDANIE
========================= */
app.post("/api/recenzie", verifyToken, async (req, res) => {
  const { sportovisko_id, hviezdicky, text_recenzie } = req.body;
  const pouzivatel_id = req.user.id;

  if (!sportovisko_id || !hviezdicky) {
    return res.status(400).json({ message: "Chýba hodnotenie alebo ID športoviska" });
  }

  try {
    await db.query(
      "INSERT INTO recenzia (pouzivatel_id, sportovisko_id, hviezdicky, text_recenzie) VALUES (?, ?, ?, ?)",
      [pouzivatel_id, sportovisko_id, hviezdicky, text_recenzie]
    );
    res.status(201).json({ message: "Recenzia bola uložená" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba pri ukladaní recenzie" });
  }
});

/* =========================
   RECENZIE – VEREJNÝ ENDPOINT
========================= */
app.get("/api/public/reviews", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        r.id, 
        r.hviezdicky, 
        r.text_recenzie, 
        r.datum_vytvorenia, 
        r.pouzivatel_id, 
        p.meno AS meno_pouzivatela,
        s.nazov AS sportovisko_nazov
      FROM recenzia r
      JOIN pouzivatel p ON r.pouzivatel_id = p.id
      JOIN sportovisko s ON r.sportovisko_id = s.id
      ORDER BY r.datum_vytvorenia DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error("Chyba pri načítaní recenzií:", err);
    res.status(500).json({ message: "Chyba servera pri načítaní recenzií" });
  }
});

/* =========================
   SERVER START
========================= */
testDBConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server beží na porte ${PORT}`);
  });
});
