import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");

    setIsLoggedIn(!!token);
    setIsAdmin(role === "admin");
    console.log("Rola: ", role);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">

        <Link className="navbar-brand fw-bold fs-4 text-dark" to="/">
          Športoviská
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">

          {/* Menu */}
          <ul className="navbar-nav mx-auto text-center text-lg-start align-items-center">
            
            <li className="nav-item d-flex align-items-center">
              <Link className="nav-link fw-bold text-dark px-3 d-flex align-items-center" to="/">
                <i className="bi bi-house-door me-1"></i> Domov
              </Link>
              <span className="text-muted d-none d-lg-block">|</span>
            </li> 

            <li className="nav-item d-flex align-items-center">
              <Link className="nav-link fw-bold text-dark px-3" to="/reservation">
                Rezervovať
              </Link>
              <span className="text-muted d-none d-lg-block">|</span>
            </li>

            <li className="nav-item d-flex align-items-center">
              <Link className="nav-link fw-bold text-dark px-3" to="/MyReservations">
                Moje rezervácie
              </Link>
              <span className="text-muted d-none d-lg-block">|</span>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-bold text-dark px-3" to="/contact">
                Kontakty
              </Link>
            </li>

            {/* Admin */}
            {isAdmin && (
              <>
                <span className="text-muted d-none d-lg-block ms-2">|</span>
                <li className="nav-item">
                  <Link className="nav-link fw-bold text-danger px-3" to="/adminedit">
                    Upraviť
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Prihlásenie / Odhlásenie */}
          <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
            {!isLoggedIn ? (
              <>
                <Link className="btn btn-outline-danger fw-bold" to="/login">
                  Prihlásiť sa
                </Link>
                <Link className="btn btn-warning fw-bold" to="/register">
                  Registrácia
                </Link>
              </>
            ) : (
              <button className="btn btn-danger" onClick={handleLogout}>
                Odhlásiť sa
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}