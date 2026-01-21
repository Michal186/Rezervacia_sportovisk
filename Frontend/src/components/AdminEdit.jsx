import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminEdit() {
  const navigate = useNavigate();

  const backgroundImageUrl = "https://www.bmu.edu.in/wp-content/uploads/2025/02/Types-of-Engineering.webp";

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${backgroundImageUrl}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center"
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div style={backgroundStyle}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Hlavný nadpis */}
            <div className="card shadow-lg border-0 rounded-4 bg-white bg-opacity-95">
              <div className="card-body p-4 p-md-5">
                <h1 className="fw-bold mb-4 text-dark border-bottom pb-3">
                  <i className="bi bi-shield-lock me-2 text-danger"></i>
                  Admin – úprava športovísk
                </h1>

                {/* Sekcie */}
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="border rounded-4 p-4 h-100 text-center shadow-sm bg-white transition-hover">
                      <div className="mb-3">
                        <i className="bi bi-trophy fs-1 text-danger"></i>
                      </div>
                      <h5 className="fw-bold">Športoviská</h5>
                      <p className="text-muted small">Pridanie, úprava a mazanie športovísk</p>
                      <button 
                        className="btn btn-danger w-100 fw-bold mt-2"
                        onClick={() => navigate("/sportoviskoedit")}
                      >
                        Spravovať
                      </button>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded-4 p-4 h-100 text-center shadow-sm bg-white transition-hover">
                      <div className="mb-3">
                        <i className="bi bi-calendar3 fs-1 text-danger"></i>
                      </div>
                      <h5 className="fw-bold">Termíny</h5>
                      <p className="text-muted small">Prehľad a správa termínov</p>
                      <button 
                        className="btn btn-danger w-100 fw-bold mt-2"
                        onClick={() => navigate("/calendaredit")}
                      >
                        Spravovať
                      </button>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="border rounded-4 p-4 h-100 text-center shadow-sm bg-white transition-hover">
                      <div className="mb-3">
                        <i className="bi bi-people fs-1 text-danger"></i>
                      </div>
                      <h5 className="fw-bold">Používatelia</h5>
                      <p className="text-muted small">Role a správa používateľov</p>
                      <button 
                        className="btn btn-danger w-100 fw-bold mt-2"
                        onClick={() => navigate("/customeredit")}
                      >
                        Spravovať
                      </button>
                    </div>
                  </div>
                </div>

                {/* Domov */}
                <div className="text-center mt-5">
                  <button
                    className="btn btn-outline-secondary px-4 fw-bold"
                    onClick={() => navigate("/")}
                  >
                    <i className="bi bi-house-door me-2"></i>
                    Späť na hlavnú stránku
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}