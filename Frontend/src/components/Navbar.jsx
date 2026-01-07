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

        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          Športoviská
        </Link>

        {/* Toggle */}
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
          <ul className="navbar-nav mx-auto text-center text-lg-start">
            <li className="nav-item">
              <Link className="nav-link" to="/how-it-works">Ako to funguje</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">O nás</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Kontakt</Link>
            </li>

            {/* ADMIN LINK */}
            {isAdmin && (
              <li className="nav-item">
                <Link
                  className="nav-link fw-bold text-danger"
                  to="/adminedit"
                >
                  Upraviť
                </Link>
              </li>
            )}
          </ul>

          {/* Auth */}
          <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
            {!isLoggedIn ? (
              <>
                <Link className="btn btn-outline-danger" to="/login">
                  Prihlásiť sa
                </Link>
                <Link className="btn btn-warning" to="/register">
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
