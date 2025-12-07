export default function SearchBox() {
  return (
    <div className="container">
      <div className="bg-white shadow p-4 rounded-3 mt-n4 position-relative">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label fw-bold">Lokalita</label>
            <select className="form-select">
              <option>Žilina</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Dátum</label>
            <input type="date" className="form-control" />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Čas</label>
            <input type="time" className="form-control" />
          </div>

          <div className="col-md-2">
            <label className="form-label fw-bold">Šport</label>
            <select className="form-select">
              <option>Futbal</option>
              <option>Tenis</option>
            </select>
          </div>

          <div className="col-md-1 d-flex align-items-end">
            <button className="btn btn-danger w-100">Hľadať</button>
          </div>
        </div>
      </div>
    </div>
  );
}
