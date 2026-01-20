import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Reservation() {
  const [sportoviska, setSportoviska] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [filters, setFilters] = useState({ nazov: "", lokalita: "", typ: "" });

  useEffect(() => {
    // 1. Načítanie dát z API
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

    // 2. Spracovanie všetkých parametrov z URL (?nazov=...&lokalita=...&type=...)
    const queryParams = new URLSearchParams(location.search);
    const typeFromUrl = queryParams.get("type") || "";
    const lokalitaFromUrl = queryParams.get("lokalita") || "";
    const nazovFromUrl = queryParams.get("nazov") || "";

    // Aktualizujeme filtre na základe hodnôt v URL
    setFilters({
      nazov: nazovFromUrl,
      lokalita: lokalitaFromUrl,
      typ: typeFromUrl
    });
  }, [location.search]); // Spustí sa pri každej zmene URL parametrov

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Filtrovanie zoznamu
  const filteredSportoviska = sportoviska.filter((s) => {
    return (
      s.nazov.toLowerCase().includes(filters.nazov.toLowerCase()) &&
      s.lokalita.toLowerCase().includes(filters.lokalita.toLowerCase()) &&
      s.typ.toLowerCase().includes(filters.typ.toLowerCase())
    );
  });

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 fw-bold text-primary">Rezervácia športovísk</h1>

      {/* Filtračný panel */}
      <div className="card shadow-sm p-4 mb-5 bg-light">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Názov športoviska</label>
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
            <label className="form-label fw-semibold">Lokalita</label>
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
            <label className="form-label fw-semibold">Typ športu</label>
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

      {/* Zobrazenie výsledkov */}
      <div className="row">
        {filteredSportoviska.length > 0 ? (
          filteredSportoviska.map((s) => (
            <div key={s.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{s.nazov}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    <i className="bi bi-geo-alt me-1"></i>{s.lokalita}
                  </h6>
                  <span className="badge bg-info text-dark mb-3">{s.typ}</span>
                  <p className="card-text fs-4 fw-bold text-success">
                    {s.cena_za_hodinu} € <small className="fs-6 text-muted">/ hod</small>
                  </p>
                  <button 
                    className="btn btn-primary w-100 fw-bold" 
                    onClick={() => navigate(`/MakingReservation/${s.id}`)}
                  >
                    Začať rezerváciu
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted fs-5">Nenašli sa žiadne športoviská pre zadané kritériá.</p>
          </div>
        )}
      </div>
    </div>
  );
}