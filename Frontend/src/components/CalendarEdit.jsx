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
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    datum: "",
    cas_od: "",
    cas_do: "",
  });

  // Pomocná funkcia na formátovanie času (odstránenie sekúnd HH:mm:ss -> HH:mm)
  const formatTime = (time) => {
    if (!time) return "";
    return time.split(":").slice(0, 2).join(":");
  };

  // Štýl futuristického pozadia
  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://bigthink.com/wp-content/uploads/2022/12/AdobeStock_173668487.jpeg?w=3200')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100%",
    color: "#fff"
  };

  useEffect(() => {
    if (role !== "admin") navigate("/");
  }, [role, navigate]);

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

  const startEdit = (t) => {
    setEditingId(t.id);
    const formattedDate = t.datum ? t.datum.split('T')[0] : "";
    setForm({
      datum: formattedDate,
      cas_od: formatTime(t.cas_od),
      cas_do: formatTime(t.cas_do),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ datum: "", cas_od: "", cas_do: "" });
  };

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
    <div style={backgroundStyle}>
      <div className="container py-5 text-dark">
        <h1 className="fw-bold mb-4 text-white" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.8)" }}>
          <i className="bi bi-calendar-event me-2"></i>Správa termínov
        </h1>

        {/* VÝBER ŠPORTOVISKA */}
        <div className="card shadow border-0 bg-white bg-opacity-95 p-4 mb-4 rounded-4">
          <label className="form-label fw-bold">Vyber športovisko pre správu kalendára</label>
          <select
            className="form-select form-select-lg"
            value={selectedSportovisko}
            onChange={(e) => {
              setSelectedSportovisko(e.target.value);
              cancelEdit();
            }}
          >
            <option value="">-- Vyberte zo zoznamu --</option>
            {sportoviska.map((s) => (
              <option key={s.id} value={s.id}>{s.nazov} – {s.lokalita}</option>
            ))}
          </select>
        </div>

        {/* FORMULÁR - ZOSTÁVA BIELY PRI EDITÁCII */}
        {selectedSportovisko && (
          <form 
            onSubmit={handleSubmit} 
            className={`card shadow border-0 p-4 mb-5 rounded-4 animate__animated animate__fadeIn bg-white ${
              editingId ? 'border-start border-primary border-5' : ''
            }`}
            style={editingId ? { boxShadow: "inset 0 0 15px rgba(0,123,255,0.05)" } : {}}
          >
            <h5 className="mb-3 fw-bold">
              {editingId ? (
                <>
                  <i className="bi bi-pencil-square text-primary me-2"></i>
                  <span className="text-primary">Upraviť existujúci termín</span>
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i>
                  Pridať nový termín
                </>
              )}
            </h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="small fw-bold">Dátum</label>
                <input
                  type="date"
                  className="form-control shadow-sm"
                  value={form.datum}
                  onChange={(e) => setForm({ ...form, datum: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold">Čas od</label>
                <input
                  type="time"
                  className="form-control shadow-sm"
                  value={form.cas_od}
                  onChange={(e) => setForm({ ...form, cas_od: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold">Čas do</label>
                <input
                  type="time"
                  className="form-control shadow-sm"
                  value={form.cas_do}
                  onChange={(e) => setForm({ ...form, cas_do: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-2 d-grid gap-2 align-self-end">
                <button type="submit" className={`btn fw-bold shadow-sm ${editingId ? 'btn-primary' : 'btn-danger'}`}>
                  {editingId ? "Uložiť zmeny" : "Pridať termín"}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>
                    Zrušiť
                  </button>
                )}
              </div>
            </div>
          </form>
        )}

        {/* TABUĽKA TERMÍNOV */}
        {selectedSportovisko && (
          <div className="card shadow border-0 rounded-4 overflow-hidden bg-white bg-opacity-95 shadow-lg">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark text-uppercase small">
                  <tr>
                    <th className="ps-4 py-3">Dátum</th>
                    <th className="py-3">Od</th>
                    <th className="py-3">Do</th>
                    <th className="text-end pe-4 py-3">Akcie</th>
                  </tr>
                </thead>
                <tbody>
                  {terminy.map((t) => (
                    <tr key={t.id} className={editingId === t.id ? "table-light border-start border-primary border-4" : ""}>
                      <td className="ps-4 fw-bold">{new Date(t.datum).toLocaleDateString("sk-SK")}</td>
                      <td><span className="badge bg-light text-dark border px-3 py-2">{formatTime(t.cas_od)}</span></td>
                      <td><span className="badge bg-light text-dark border px-3 py-2">{formatTime(t.cas_do)}</span></td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-primary me-2 px-3"
                          onClick={() => startEdit(t)}
                        >
                          <i className="bi bi-pencil me-1"></i> Upraviť
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger px-3"
                          onClick={() => handleDelete(t.id)}
                        >
                          <i className="bi bi-trash me-1"></i> Zmazať
                        </button>
                      </td>
                    </tr>
                  ))}
                  {terminy.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-muted text-center py-5">
                        <i className="bi bi-info-circle me-2"></i>Žiadne voľné termíny pre toto športovisko
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button
          className="btn btn-secondary mt-4 px-4 shadow rounded-pill"
          onClick={() => navigate("/adminedit")}
        >
          <i className="bi bi-arrow-left me-2"></i>Späť do panelu administrátora
        </button>
      </div>
    </div>
  );
}