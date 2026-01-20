import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const navigate = useNavigate();
  
  // Rozšírený stav pre všetky vyhľadávacie kritériá
  const [searchParams, setSearchParams] = useState({
    nazov: "",
    lokalita: "",
    sport: ""
  });

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    // Vytvorenie reťazca parametrov
    const params = new URLSearchParams();
    if (searchParams.nazov) params.append("nazov", searchParams.nazov);
    if (searchParams.lokalita) params.append("lokalita", searchParams.lokalita);
    if (searchParams.sport) params.append("type", searchParams.sport);

    // Navigácia na /reservation s nazbieranými parametrami
    navigate(`/reservation?${params.toString()}`);
  };

  return (
    <div className="container">
      <div className="bg-white shadow p-4 rounded-3 mt-n4 position-relative">
        <div className="row g-3 align-items-end">

          {/* Názov športoviska - Textové pole */}
          <div className="col-12 col-md-4 col-lg-4">
            <label className="form-label fw-bold">Názov športoviska</label>
            <input 
              type="text" 
              name="nazov"
              className="form-control" 
              placeholder="Napr. Aréna, Hala..."
              value={searchParams.nazov}
              onChange={handleChange}
            />
          </div>

          {/* Lokalita - Výber alebo text */}
          <div className="col-12 col-md-4 col-lg-3">
            <label className="form-label fw-bold">Lokalita</label>
            <select 
              name="lokalita" 
              className="form-select" 
              value={searchParams.lokalita}
              onChange={handleChange}
            >
              <option value="">Všetky lokality</option>
              <option value="Žilina">Žilina</option>
              <option value="Bratislava">Bratislava</option>
              <option value="Košice">Košice</option>
            </select>
          </div>

          {/* Typ športu - Výber */}
          <div className="col-12 col-md-4 col-lg-3">
            <label className="form-label fw-bold">Typ športu</label>
            <select 
              name="sport" 
              className="form-select" 
              value={searchParams.sport}
              onChange={handleChange}
            >
              <option value="">Všetky športy</option>
              <option value="Futbal">Futbal</option>
              <option value="Tenis">Tenis</option>
              <option value="Basketbal">Basketbal</option>
              <option value="Posilňovňa">Posilňovňa</option>
            </select>
          </div>

          {/* Tlačidlo Hľadať */}
          <div className="col-12 col-lg-2">
            <button className="btn btn-danger w-100 fw-bold" onClick={handleSearch}>
              <i className="bi bi-search me-2"></i>Hľadať
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}