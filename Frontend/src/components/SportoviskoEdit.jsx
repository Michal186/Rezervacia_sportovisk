import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/sportoviska";

export default function SportoviskoEdit() {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const role = localStorage.getItem("userRole");

  const [sportoviska, setSportoviska] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    nazov: "",
    lokalita: "",
    adresa: "",
    typ: "",
    cena_za_hodinu: "",
  });

  // Štýl pre pozadie
  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://www.sportoviska.uniza.sk/wp-content/uploads/2025/06/atleticky-stadion-noc-1024x1024.webp')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100%",
    paddingTop: "50px",
    paddingBottom: "50px"
  };

  /* =========================
      ADMIN OCHRANA
  ========================= */
  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);

  /* =========================
      NAČÍTANIE ŠPORTOVÍSK
  ========================= */
  useEffect(() => {
    fetchSportoviska();
  }, []);

  const fetchSportoviska = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSportoviska(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Chyba pri načítaní športovísk", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      resetForm();
      fetchSportoviska();
    } catch (err) {
      console.error("Chyba pri ukladaní športoviska", err);
    }
  };

  const resetForm = () => {
    setForm({
      nazov: "",
      lokalita: "",
      adresa: "",
      typ: "",
      cena_za_hodinu: "",
    });
    setEditingId(null);
  };

  const handleEdit = (s) => {
    setForm({
      nazov: s.nazov,
      lokalita: s.lokalita,
      adresa: s.adresa,
      typ: s.typ || "",
      cena_za_hodinu: s.cena_za_hodinu,
    });
    setEditingId(s.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Naozaj chceš vymazať športovisko?")) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSportoviska();
    } catch (err) {
      console.error("Chyba pri mazaní športoviska", err);
    }
  };

  return (
    <div style={backgroundStyle}>
      <div className="container">
        <h1 className="fw-bold mb-4 text-white text-center shadow-text" style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.8)" }}>
          Správa športovísk
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="card shadow-lg p-4 mb-5 bg-white bg-opacity-95 rounded-4 border-0">
          <h4 className="mb-4 fw-bold">{editingId ? "✏️ Upraviť existujúce" : "➕ Pridať nové športovisko"}</h4>
          <div className="row g-3 text-dark">
            <div className="col-lg-2">
              <label className="form-label small fw-bold">Názov</label>
              <input
                className="form-control"
                placeholder="Názov"
                value={form.nazov}
                onChange={(e) => setForm({ ...form, nazov: e.target.value })}
                required
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label small fw-bold">Lokalita</label>
              <input
                className="form-control"
                placeholder="Lokalita"
                value={form.lokalita}
                onChange={(e) => setForm({ ...form, lokalita: e.target.value })}
                required
              />
            </div>

            <div className="col-lg-4">
              <label className="form-label small fw-bold">Adresa</label>
              <input
                className="form-control"
                placeholder="Ulica, číslo, PSČ"
                value={form.adresa}
                onChange={(e) => setForm({ ...form, adresa: e.target.value })}
                required
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label small fw-bold">Typ</label>
              <input
                className="form-control"
                placeholder="napr. Tenis"
                value={form.typ}
                onChange={(e) => setForm({ ...form, typ: e.target.value })}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label small fw-bold">Cena za hodinu</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="0.00"
                  value={form.cena_za_hodinu}
                  onChange={(e) => setForm({ ...form, cena_za_hodinu: e.target.value })}
                  required
                />
                <span className="input-group-text">€</span>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 text-center d-flex justify-content-center gap-2">
              <button type="submit" className={`btn ${editingId ? 'btn-primary' : 'btn-danger'} px-5 shadow-sm fw-bold rounded-pill`}>
                {editingId ? "Uložiť zmeny" : "Pridať športovisko"}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline-secondary px-4 rounded-pill" onClick={resetForm}>
                  Zrušiť
                </button>
              )}
            </div>
          </div>
        </form>

        {/* TABUĽKA */}
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-white bg-opacity-95">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="ps-4">Názov</th>
                  <th>Lokalita</th>
                  <th>Adresa</th>
                  <th>Typ</th>
                  <th>Cena</th>
                  <th className="text-end pe-4">Akcie</th>
                </tr>
              </thead>
              <tbody className="text-dark">
                {sportoviska.map((s) => (
                  <tr key={s.id}>
                    <td className="ps-4 fw-bold">{s.nazov}</td>
                    <td>{s.lokalita}</td>
                    <td>{s.adresa}</td>
                    <td><span className="badge bg-light text-dark border">{s.typ}</span></td>
                    <td><span className="fw-bold">{s.cena_za_hodinu} €</span></td>

                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-outline-warning me-2 fw-bold"
                        onClick={() => navigate(`/admin/sportovisko/${s.id}/galeria`)}
                      >
                        Galéria
                      </button>

                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(s)}
                      >
                        Upraviť
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(s.id)}
                      >
                        Zmazať
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button className="btn btn-light shadow-sm mt-4 px-4 fw-bold rounded-pill" onClick={() => navigate("/adminedit")}>
          <i className="bi bi-arrow-left"></i> Späť
        </button>
      </div>
    </div>
  );
}