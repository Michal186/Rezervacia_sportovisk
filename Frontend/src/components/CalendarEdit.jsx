import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:3000";
const SPORTOVISKA_API = `${BASE_URL}/api/sportoviska`;
const TERMINY_API = `${BASE_URL}/api/terminy`;

export default function CalendarEdit() {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const role = localStorage.getItem("userRole");

  const [sportoviska, setSportoviska] = useState([]);
  const [selectedSportovisko, setSelectedSportovisko] = useState("");
  const [terminy, setTerminy] = useState([]);
  
  // Stav pre editáciu
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    datum: "",
    cas_od: "",
    cas_do: "",
  });

  /* =========================
      ADMIN OCHRANA
  ========================= */
  useEffect(() => {
    if (role !== "admin") navigate("/");
  }, [role, navigate]);

  /* =========================
      NAČÍTANIE ŠPORTOVÍSK
  ========================= */
  useEffect(() => {
    fetchSportoviska();
  }, []);

  const fetchSportoviska = async () => {
    try {
      const res = await fetch(SPORTOVISKA_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSportoviska(data);
    } catch (err) {
      console.error("Chyba pri načítaní športovísk", err);
    }
  };

  /* =========================
      NAČÍTANIE TERMÍNOV
  ========================= */
  useEffect(() => {
    if (selectedSportovisko) fetchTerminy();
  }, [selectedSportovisko]);

  const fetchTerminy = async () => {
    try {
      const res = await fetch(`${TERMINY_API}/${selectedSportovisko}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTerminy(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Chyba pri načítaní termínov", err);
    }
  };

  /* =========================
      SUBMIT (CREATE ALEBO UPDATE)
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${TERMINY_API}/${editingId}` : TERMINY_API;

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sportovisko_id: selectedSportovisko,
          ...form,
        }),
      });

      if (res.ok) {
        setForm({ datum: "", cas_od: "", cas_do: "" });
        setEditingId(null);
        fetchTerminy();
      }
    } catch (err) {
      console.error("Chyba pri ukladaní termínu", err);
    }
  };

  /* =========================
      EDIT REŽIM
  ========================= */
  const startEdit = (t) => {
    setEditingId(t.id);
    // Ošetrenie formátu dátumu (aby ho HTML input typu date vedel prečítať)
    const formattedDate = t.datum ? t.datum.split('T')[0] : "";
    setForm({
      datum: formattedDate,
      cas_od: t.cas_od,
      cas_do: t.cas_do,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ datum: "", cas_od: "", cas_do: "" });
  };

  /* =========================
      DELETE
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Naozaj chceš vymazať termín?")) return;
    try {
      await fetch(`${TERMINY_API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTerminy();
    } catch (err) {
      console.error("Chyba pri mazaní termínu", err);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Správa termínov</h1>

      {/* VÝBER ŠPORTOVISKA */}
      <div className="card shadow-sm p-4 mb-4">
        <label className="form-label fw-bold">Vyber športovisko</label>
        <select
          className="form-select"
          value={selectedSportovisko}
          onChange={(e) => {
            setSelectedSportovisko(e.target.value);
            cancelEdit();
          }}
        >
          <option value="">-- vyber --</option>
          {sportoviska.map((s) => (
            <option key={s.id} value={s.id}>{s.nazov} – {s.lokalita}</option>
          ))}
        </select>
      </div>

      {/* FORMULÁR */}
      {selectedSportovisko && (
        <form onSubmit={handleSubmit} className={`card shadow-sm p-4 mb-5 ${editingId ? 'border-primary' : ''}`}>
          <h5 className="mb-3">{editingId ? "Upraviť termín" : "Pridať nový termín"}</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                value={form.datum}
                onChange={(e) => setForm({ ...form, datum: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="time"
                className="form-control"
                value={form.cas_od}
                onChange={(e) => setForm({ ...form, cas_od: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="time"
                className="form-control"
                value={form.cas_do}
                onChange={(e) => setForm({ ...form, cas_do: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2 d-grid gap-2">
              <button type="submit" className={`btn ${editingId ? 'btn-primary' : 'btn-danger'}`}>
                {editingId ? "Uložiť" : "Pridať"}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline-secondary" onClick={cancelEdit}>
                  Zrušiť
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      {/* TABUĽKA TERMÍNOV */}
      {selectedSportovisko && (
        <div className="table-responsive">
          <table className="table table-hover shadow-sm align-middle">
            <thead>
              <tr>
                <th>Dátum</th>
                <th>Od</th>
                <th>Do</th>
                <th className="text-end">Akcie</th>
              </tr>
            </thead>
            <tbody>
              {terminy.map((t) => (
                <tr key={t.id} className={editingId === t.id ? "table-primary" : ""}>
                  <td>{new Date(t.datum).toLocaleDateString("sk-SK")}</td>
                  <td>{t.cas_od}</td>
                  <td>{t.cas_do}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => startEdit(t)}
                    >
                      Upraviť
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(t.id)}
                    >
                      Zmazať
                    </button>
                  </td>
                </tr>
              ))}
              {terminy.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-muted text-center">Žiadne termíny</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate("/adminedit")}
      >
        Späť
      </button>
    </div>
  );
}