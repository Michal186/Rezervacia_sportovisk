import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
      <div className="container">
        <a className="navbar-brand fw-bold fs-4" href="#">Športoviská</a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item"><a className="nav-link" href="#">Ako to funguje</a></li>
            <li className="nav-item"><a className="nav-link" href="#">O nás</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Kontakt</a></li>
          </ul>

          <div>
            <Link className="btn btn-outline-danger me-2" to="/Login">Prihlásiť sa</Link>
            <Link className="btn btn-warning" to="/Register">Registrácia</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
