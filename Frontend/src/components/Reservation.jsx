import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Reservation() {
  const [sportoviska, setSportoviska] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({ nazov: "", lokalita: "", typ: "" });

  const backgroundImageUrl = "https://images.unsplash.com/photo-1459865264687-595d652de67e?ixid=M3w0MzUxNjF8MHwxfHNlYXJjaHw2fHxzcG9ydHN8ZW58MHx8fHwxNzQ2ODcxMzU2fDA&ixlib=rb-4.1.0&orientation=landscape&fit=crop&crop=entropy%2Cfaces&auto=format%2Ccompress&w=1280";

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${backgroundImageUrl}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100%",
    paddingBottom: "3rem"
  };

  useEffect(() => {
    const fetchSportoviska = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/public/sportoviska");
        const data = await response.json();
        setSportoviska(data);
      } catch (error) {
        console.error("Chyba pri načítaní športovísk:", error);
      }
    };
    fetchSportoviska();

    const queryParams = new URLSearchParams(location.search);
    setFilters({
      nazov: queryParams.get("nazov") || "",
      lokalita: queryParams.get("lokalita") || "",
      typ: queryParams.get("type") || ""
    });
  }, [location.search]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredSportoviska = sportoviska.filter((s) => {
    return (
      s.nazov.toLowerCase().includes(filters.nazov.toLowerCase()) &&
      s.lokalita.toLowerCase().includes(filters.lokalita.toLowerCase()) &&
      s.typ.toLowerCase().includes(filters.typ.toLowerCase())
    );
  });

  return (
    <div style={backgroundStyle}>
      <div className="container py-5">
        <h1 className="text-center mb-5 fw-bold text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
          Rezervácia športovísk
        </h1>

        <div className="card shadow-lg p-4 mb-5 border-0" style={{ backgroundColor: "rgba(255, 255, 255, 0.93)", borderRadius: "15px" }}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-bold text-dark">Názov športoviska</label>
              <input
                type="text"
                name="nazov"
                className="form-control"
                placeholder="Hľadať podľa názvu..."
                value={filters.nazov}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold text-dark">Lokalita</label>
              <input
                type="text"
                name="lokalita"
                className="form-control"
                placeholder="Napr. Žilina..."
                value={filters.lokalita}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold text-dark">Typ športu</label>
              <select 
                name="typ" 
                className="form-select" 
                value={filters.typ} 
                onChange={handleFilterChange}
              >
                <option value="">Všetky športy</option>
                <option value="Futbal">Futbal</option>
                <option value="Tenis">Tenis</option>
                <option value="Basketbal">Basketbal</option>
                <option value="Posilňovňa">Posilňovňa</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          {filteredSportoviska.length > 0 ? (
            filteredSportoviska.map((s) => (
              <div key={s.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow border-0 sportovisko-card" style={{ borderRadius: "12px", overflow: "hidden" }}>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark">{s.nazov}</h5>
                    <h6 className="card-subtitle mb-2 text-secondary">
                      <i className="bi bi-geo-alt-fill me-1 text-danger"></i>{s.lokalita}
                    </h6>
                    <div className="mb-3">
                      <span className="badge bg-primary px-3 py-2">{s.typ}</span>
                    </div>
                    <div className="mt-auto">
                      <p className="card-text fs-4 fw-bold text-success mb-3">
                        {s.cena_za_hodinu} € <small className="fs-6 text-muted fw-normal">/ hod</small>
                      </p>
                      <button 
                        className="btn btn-primary w-100 fw-bold py-2 shadow-sm" 
                        onClick={() => navigate(`/MakingReservation/${s.id}`)}
                      >
                        Začať rezerváciu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="bg-white d-inline-block p-4 rounded-pill shadow">
                 <p className="text-muted fs-5 mb-0">Nenašli sa žiadne športoviská pre zadané kritériá.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}