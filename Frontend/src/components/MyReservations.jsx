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

  // Definícia štýlu pozadia
  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://cmesk-ott-images-svod.ssl.cdn.cra.cz/r1920x1080n/5ea5ea9a-db7e-4ae4-86cc-f98ce6138954')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100%",
  };

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

  if (loading) {
    return (
      <div style={backgroundStyle} className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-light"></div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
          Moje Rezervácie
        </h2>
        
        <div className="row">
          {rezervacie.length > 0 ? (
            rezervacie.map((r) => (
              <div key={r.rezervacia_id} className="col-md-6 mb-4">
                <div className="card shadow border-0 border-start border-4 border-success h-100" style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
                  <div className="card-body">
                    <h5 className="fw-bold text-success">{r.sportovisko_nazov}</h5>
                    <p className="mb-1 text-dark"><strong>Dátum:</strong> {new Date(r.datum).toLocaleDateString("sk-SK")}</p>
                    <p className="mb-3 text-dark"><strong>Čas:</strong> {r.cas_od.substring(0, 5)} - {r.cas_do.substring(0, 5)}</p>
                    
                    <div className="d-flex gap-2">
                      <span className="badge bg-success py-2 px-3 d-flex align-items-center">Potvrdené</span>
                      <button 
                        className="btn btn-outline-primary btn-sm fw-bold"
                        onClick={() => {
                          setSelectedSportoviskoId(r.sportovisko_id);
                          setShowModal(true);
                        }}
                      >
                        <i className="bi bi-pencil-square"></i> Napísať recenziu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
               <div className="alert alert-light bg-opacity-75 text-center">Zatiaľ nemáte žiadne rezervácie.</div>
            </div>
          )}
        </div>

        {/* MODÁLNE OKNO */}
        {showModal && (
          <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title fw-bold">Napísať recenziu</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <label className="form-label fw-bold">Hodnotenie (1-5 hviezd):</label>
                  <select className="form-select mb-3" value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="5">5 - Výborné</option>
                    <option value="4">4 - Veľmi dobré</option>
                    <option value="3">3 - Dobré</option>
                    <option value="2">2 - Slabšie</option>
                    <option value="1">1 - Veľmi zlé</option>
                  </select>

                  <label className="form-label fw-bold">Vaša skúsenosť:</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Popíšte ako sa vám športovalo..."
                  ></textarea>
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-light fw-bold" onClick={() => setShowModal(false)}>Zrušiť</button>
                  <button className="btn btn-primary px-4 fw-bold" onClick={handleReviewSubmit}>Odoslať recenziu</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}