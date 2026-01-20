import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MyReservations() {
  const [rezervacie, setRezervacie] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stavy pre recenziu
  const [showModal, setShowModal] = useState(false);
  const [selectedSportoviskoId, setSelectedSportoviskoId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) { navigate("/Login"); return; }
    fetchRezervacie();
  }, [navigate]);

  const fetchRezervacie = async () => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await fetch("http://localhost:3000/api/moje-rezervacie", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setRezervacie(data);
    } catch (err) { console.error("Chyba:", err); }
    finally { setLoading(false); }
  };

  const handleReviewSubmit = async () => {
    const token = localStorage.getItem("userToken");
    try {
      const res = await fetch("http://localhost:3000/api/recenzie", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          sportovisko_id: selectedSportoviskoId,
          hviezdicky: rating,
          text_recenzie: comment
        })
      });

      if (res.ok) {
        alert("Ďakujeme za recenziu!");
        setShowModal(false);
        setComment("");
      }
    } catch (err) { alert("Chyba pri odosielaní"); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Moje Rezervácie</h2>
      <div className="row">
        {rezervacie.map((r) => (
          <div key={r.rezervacia_id} className="col-md-6 mb-4">
            <div className="card shadow-sm border-0 border-start border-4 border-success">
              <div className="card-body">
                <h5 className="fw-bold text-success">{r.sportovisko_nazov}</h5>
                <p className="mb-1"><strong>Dátum:</strong> {new Date(r.datum).toLocaleDateString("sk-SK")}</p>
                <p className="mb-3"><strong>Čas:</strong> {r.cas_od.substring(0, 5)} - {r.cas_do.substring(0, 5)}</p>
                
                <div className="d-flex gap-2">
                  <span className="badge bg-success py-2 px-3">Potvrdené</span>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setSelectedSportoviskoId(r.sportovisko_id); // Uprav SQL dopyt v backende aby vracal aj sportovisko_id!
                      setShowModal(true);
                    }}
                  >
                    <i className="bi bi-pencil-square"></i> Napísať recenziu
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* JEDNODUCHÉ MODÁLNE OKNO (Zobrazené cez podmienku) */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Napísať recenziu</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Hodnotenie (1-5 hviezd):</label>
                <select className="form-select mb-3" value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value="5">5 - Výborné</option>
                  <option value="4">4 - Veľmi dobré</option>
                  <option value="3">3 - Dobré</option>
                  <option value="2">2 - Slabšie</option>
                  <option value="1">1 - Veľmi zlé</option>
                </select>

                <label className="form-label">Vaša skúsenosť:</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Popíšte ako sa vám športovalo..."
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Zrušiť</button>
                <button className="btn btn-primary" onClick={handleReviewSubmit}>Odoslať recenziu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}