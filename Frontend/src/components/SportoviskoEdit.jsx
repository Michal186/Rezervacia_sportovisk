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
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Správa športovísk</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="card shadow-sm p-4 mb-5">
        <div className="row g-3">
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
            <label className="form-label small fw-bold">Cena za hod / tréning</label>
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
            <button type="submit" className="btn btn-danger px-5 shadow-sm fw-bold">
              {editingId ? "Uložiť zmeny" : "Pridať športovisko"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline-secondary px-4" onClick={resetForm}>
                Zrušiť
              </button>
            )}
          </div>
        </div>
      </form>

      {/* TABUĽKA */}
      <div className="table-responsive">
        <table className="table table-hover shadow-sm">
          <thead>
            <tr>
              <th>Názov</th>
              <th>Lokalita</th>
              <th>Adresa</th>
              <th>Typ</th>
              <th>Cena</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sportoviska.map((s) => (
              <tr key={s.id}>
                <td>{s.nazov}</td>
                <td>{s.lokalita}</td>
                <td>{s.adresa}</td>
                <td>{s.typ}</td>
                <td>{s.cena_za_hodinu} €</td>

                <td className="text-end">
    
                  {/* ŽLTÉ TLAČIDLO*/}
                  <button
                    className="btn btn-sm btn-outline-warning me-2 fw-bold"
                    onClick={() => navigate(`/admin/sportovisko/${s.id}/galeria`)}
                  >
                    Galéria
                  </button>

                  {/* MODRÉ TLAČIDLO*/}
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(s)}
                  >
                    Upraviť
                  </button>

                  {/* ČERVENÉ TLAČIDLO*/}
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

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/adminedit")}>
        Späť
      </button>
    </div>
  );
}