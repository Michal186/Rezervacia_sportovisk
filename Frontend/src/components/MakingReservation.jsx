import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MakingReservation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sportovisko, setSportovisko] = useState(null);
  const [galeria, setGaleria] = useState([]);
  const [terminy, setTerminy] = useState([]);
  const [selectedTermin, setSelectedTermin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  const backgroundImageUrl = "https://b499309e6c.clvaw-cdnwnd.com/d49711b5fa952c5f4e14cafb94c21a41/200000174-136b514672/tennis-ball-443272_960_720-0.jpg?ph=b499309e6c";

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${backgroundImageUrl}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100%",
    paddingBottom: "3rem"
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");

    if (!token || (role !== "user" && role !== "admin")) {
      alert("Na túto akciu musíte byť prihlásený.");
      navigate("/Login");
      return;
    }

    const fetchData = async () => {
      try {
        const [resInfo, resGaleria, resTerminy] = await Promise.all([
          fetch(`http://localhost:3000/api/public/sportoviska/${id}`),
          fetch(`http://localhost:3000/api/public/sportoviska/${id}/galeria`),
          fetch(`http://localhost:3000/api/public/sportoviska/${id}/terminy`)
        ]);

        const info = await resInfo.json();
        const fotky = await resGaleria.json();
        const casy = await resTerminy.json();

        setSportovisko(info);
        setGaleria(fotky);
        setTerminy(casy);
      } catch (err) {
        console.error("Chyba pri načítaní dát:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleBooking = async () => {
    if (!selectedTermin) {
      alert("Prosím, vyberte si termín.");
      return;
    }

    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(`http://localhost:3000/api/rezervacie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ termin_id: selectedTermin.id })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Rezervácia úspešná!");
        setTerminy(prev => prev.filter(t => t.id !== selectedTermin.id));
        setSelectedTermin(null);
        navigate("/reservation");
      } else {
        alert(data.message || "Rezervácia sa nepodarila.");
      }
    } catch (err) {
      alert("Chyba pri komunikácii so serverom.");
    }
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
        <div className="row">

          {/* ĽAVÁ STRANA - INFO */}
          <div className="col-lg-7 mb-4">
            <div className="card shadow-lg border-0 bg-white bg-opacity-95" style={{ borderRadius: "15px" }}>
              <div className="card-body p-4">
                <h2 className="fw-bold mb-1 text-dark">{sportovisko?.nazov}</h2>
                <p className="text-muted mb-2">
                  <i className="bi bi-geo-alt-fill text-danger"></i> {sportovisko?.lokalita}
                </p>
                <span className="badge bg-primary px-3 py-2 mb-4">{sportovisko?.typ}</span>

                <h5 className="fw-bold mb-3">Galéria priestorov</h5>
                <div className="row g-2 mb-4">
                  {galeria.length > 0 ? (
                    galeria.map((foto, index) => (
                      <div key={index} className="col-4 col-md-3">
                        <div
                          className="gallery-hover position-relative overflow-hidden rounded shadow-sm"
                          style={{ cursor: "pointer", height: "100px" }}
                          onClick={() => setActiveImage(foto.adresa_obrazka)}
                        >
                          <img
                            src={foto.adresa_obrazka}
                            alt={`Foto ${index}`}
                            className="gallery-img w-100 h-100"
                            style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                          />
                          <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
                             <i className="bi bi-zoom-in text-white fs-4"></i>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-muted fst-italic">Žiadne fotky k dispozícii</div>
                  )}
                </div>

                <h5 className="fw-bold mb-2">O športovisku</h5>
                <p className="lead fs-6 text-dark">
                  {sportovisko?.popis || "Tento priestor ponúka skvelé podmienky pre váš športový tréning."}
                </p>
              </div>
            </div>
          </div>

          {/* PRAVÁ STRANA - TERMÍNY */}
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 sticky-top bg-white bg-opacity-95" style={{ top: "20px", borderRadius: "15px", overflow: "hidden" }}>
              <div className="card-header bg-dark text-white py-3">
                <h4 className="mb-0 text-center fw-bold">Dostupné termíny</h4>
              </div>
              <div className="card-body p-4">
                <div className="mb-4">
                  <label className="form-label fw-bold mb-3">Vyberte si voľný čas:</label>
                  <div className="d-flex flex-wrap gap-2">
                    {terminy.length > 0 ? (
                      terminy.map((t) => (
                        <button
                          key={t.id}
                          className={`btn ${
                            selectedTermin?.id === t.id
                              ? "btn-primary shadow"
                              : "btn-outline-primary"
                          } p-2 flex-grow-1`}
                          style={{ minWidth: "120px" }}
                          onClick={() => setSelectedTermin(t)}
                        >
                          <small>{new Date(t.datum).toLocaleDateString("sk-SK")}</small>
                          <br />
                          <strong>
                            {t.cas_od.substring(0, 5)} – {t.cas_do.substring(0, 5)}
                          </strong>
                        </button>
                      ))
                    ) : (
                      <div className="alert alert-warning w-100">
                        Momentálne nie sú dostupné žiadne termíny.
                      </div>
                    )}
                  </div>
                </div>

                {selectedTermin && (
                  <div className="alert alert-success border-0 shadow-sm animate__animated animate__fadeIn">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Vybraný dátum:</span>
                      <span className="fw-bold">{new Date(selectedTermin.datum).toLocaleDateString("sk-SK")}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Čas:</span>
                      <span className="fw-bold">{selectedTermin.cas_od.substring(0, 5)} - {selectedTermin.cas_do.substring(0, 5)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fs-5">Celková cena:</span>
                      <span className="fw-bold fs-4 text-success">
                        {sportovisko?.cena_za_hodinu} €
                      </span>
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-success btn-lg w-100 fw-bold mt-2 py-3 shadow"
                  disabled={!selectedTermin}
                  onClick={handleBooking}
                >
                  Potvrdiť záväznú rezerváciu
                </button>

                <button
                  className="btn btn-link w-100 text-muted mt-2 text-decoration-none"
                  onClick={() => navigate(-1)}
                >
                  <i className="bi bi-arrow-left"></i> Späť na zoznam
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* LIGHTBOX */}
      {activeImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.9)",
            zIndex: 2000,
            cursor: "zoom-out"
          }}
          onClick={() => setActiveImage(null)}
        >
          <img
            src={activeImage}
            alt="Zväčšený obrázok"
            className="img-fluid rounded shadow-lg animate__animated animate__zoomIn"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}
    </div>
  );
}