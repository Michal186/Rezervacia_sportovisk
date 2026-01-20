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
      
      // OPTIÁLNE: Odstránenie práve zarezervovaného termínu zo zoznamu, 
      // aby zmizol z obrazovky pred navigáciou preč
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
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">

        {/* ĽAVÁ STRANA */}
        <div className="col-lg-7 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">

              {/* NÁZOV */}
              <h2 className="fw-bold mb-1">{sportovisko?.nazov}</h2>
              <p className="text-muted mb-2">
                <i className="bi bi-geo-alt"></i> {sportovisko?.lokalita}
              </p>
              <span className="badge bg-primary mb-3">{sportovisko?.typ}</span>

              {/* GALÉRIA */}
              <div className="row g-2 mb-3">
  {galeria.length > 0 ? (
    galeria.map((foto, index) => (
      <div key={index} className="col-4 col-md-3">
        <div
          className="position-relative overflow-hidden rounded shadow-sm gallery-hover"
          style={{ cursor: "pointer" }}
          onClick={() => setActiveImage(foto.adresa_obrazka)}
        >
          <img
            src={foto.adresa_obrazka}
            alt={`Foto ${index}`}
            className="img-fluid w-100 gallery-img"
            style={{
              height: "120px",
              objectFit: "cover",
              transition: "transform 0.3s ease"
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200?text=Obrázok+chýba";
            }}
          />

          {/* Overlay */}
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center gallery-overlay">
            <span className="text-white fw-bold fs-5"> </span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="text-muted">Žiadne fotky k dispozícii</div>
  )}
</div>


              {/* POPIS */}
              <p className="lead">
                {sportovisko?.popis ||
                  "Tento priestor ponúka skvelé podmienky pre váš športový tréning."}
              </p>
            </div>
          </div>
        </div>

        {/* PRAVÁ STRANA */}
        <div className="col-lg-5">
          <div className="card shadow border-0 sticky-top" style={{ top: "20px" }}>
            <div className="card-header bg-dark text-white py-3">
              <h4 className="mb-0 text-center">Dostupné termíny</h4>
            </div>
            <div className="card-body">

              <div className="mb-4">
                <label className="form-label fw-bold">Vyberte si voľný čas:</label>
                <div className="d-flex flex-wrap gap-2">
                  {terminy.length > 0 ? (
                    terminy.map((t) => (
                      <button
                        key={t.id}
                        className={`btn ${
                          selectedTermin?.id === t.id
                            ? "btn-primary shadow"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => setSelectedTermin(t)}
                      >
                        {new Date(t.datum).toLocaleDateString("sk-SK")}
                        <br />
                        <strong>
                          {t.cas_od.substring(0, 5)} –{" "}
                          {t.cas_do.substring(0, 5)}
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
                <div className="alert alert-success shadow-sm">
                  <strong>
                    {new Date(selectedTermin.datum).toLocaleDateString("sk-SK")}
                  </strong>{" "}
                  o <strong>{selectedTermin.cas_od.substring(0, 5)}</strong>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span>Cena:</span>
                    <span className="fw-bold">
                      {sportovisko?.cena_za_hodinu} €
                    </span>
                  </div>
                </div>
              )}

              <button
                className="btn btn-success btn-lg w-100 fw-bold mt-3"
                disabled={!selectedTermin}
                onClick={handleBooking}
              >
                Potvrdiť záväznú rezerváciu
              </button>

              <button
                className="btn btn-link w-100 text-muted mt-2"
                onClick={() => navigate(-1)}
              >
                Späť na zoznam
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* LIGHTBOX */}
      {activeImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.85)",
            zIndex: 1050
          }}
          onClick={() => setActiveImage(null)}
        >
          <img
            src={activeImage}
            alt="Zväčšený obrázok"
            className="img-fluid rounded shadow-lg"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}
    </div>
  );
}
