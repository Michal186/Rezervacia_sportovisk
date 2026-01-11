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

// Overenie JWT
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

    req.user = decoded; // { id, rola }
    next();
  });
};

// Overenie admin roly
const verifyAdmin = (req, res, next) => {
  if (req.user.rola !== "admin") {
    return res.status(403).json({ message: "Nemáš admin práva" });
  }
  next();
};

/* =========================
   AUTH ROUTES
========================= */

// REGISTER
app.post("/api/register", async (req, res) => {
  const { meno, email, heslo } = req.body;

  if (!meno || !email || !heslo) {
    return res.status(400).json({ message: "Vyplň všetky polia" });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM pouzivatel WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Používateľ už existuje" });
    }

    const hashedPassword = await bcrypt.hash(heslo, 10);

    await db.query(
      "INSERT INTO pouzivatel (meno, email, heslo, rola) VALUES (?, ?, ?, ?)",
      [meno, email, hashedPassword, "user"]
    );

    res.status(201).json({ message: "Registrácia úspešná" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba servera" });
  }
});

// LOGIN
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

// ZOZNAM POUŽÍVATEĽOV
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


/* =========================
   ŠPORTOVISKÁ (CRUD)
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
    res.status(200).json({ message: "Športovisko vymazané" }); // Zmenené z 204 na 200, aby frontend dostal JSON ak treba
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chyba pri mazaní športoviska" });
  }
});


// =========================
// GALÉRIA – GET PODĽA ŠPORTOVISKA
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

// =========================
// GALÉRIA – POST (PRIDAŤ OBRÁZOK)
// =========================
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

// =========================
// GALÉRIA – DELETE
// =========================
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
    res.status(200).json({ message: "Odstránené" }); // Zmenené z 204 na 200 pre istotu
  } catch (error) {
    res.status(500).json({ error: "Interná chyba servera" });
  }
});

// =========================
// PUT - Úprava termínu
// =========================
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



/* =========================
   SERVER START
========================= */

testDBConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server beží na porte ${PORT}`);
  });
});
