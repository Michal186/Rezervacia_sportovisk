import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminEdit() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h1 className="fw-bold mb-4">Admin – úprava športovísk</h1>

              {/* Sekcie */}
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="border rounded-3 p-4 h-100 text-center">
                    <h5 className="fw-bold">Športoviská</h5>
                    <p className="text-muted">Pridanie, úprava a mazanie športovísk</p>
                    <button className="btn btn-outline-danger w-100">Spravovať</button>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded-3 p-4 h-100 text-center">
                    <h5 className="fw-bold">Rezervácie</h5>
                    <p className="text-muted">Prehľad a správa rezervácií</p>
                    <button className="btn btn-outline-danger w-100">Zobraziť</button>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded-3 p-4 h-100 text-center">
                    <h5 className="fw-bold">Používatelia</h5>
                    <p className="text-muted">Role a správa používateľov</p>
                    <button className="btn btn-outline-danger w-100">Upraviť</button>
                  </div>
                </div>
              </div>

              {/* Spodná akcia */}
              <div className="text-end mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/")}
                >
                  Späť na hlavnú stránku
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}