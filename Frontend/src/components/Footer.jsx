const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 pt-5">
      <div className="container text-center text-md-start">
        <div className="row text-center text-md-start">
          
          <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-warning">Športoviská UNIZA</h5>
            <p className="small text-secondary">
              Moderný systém pre správu a rezerváciu športovísk v rámci Žilinskej univerzity v Žiline.
            </p>
          </div>

          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-warning">Kontakt</h5>
            <p className="small"><i className="bi bi-geo-alt me-2"></i>Univerzitná 8215/1, 010 26 Žilina</p>
            <p className="small"><i className="bi bi-envelope me-2"></i>info@uniza.sk</p>
            <p className="small"><i className="bi bi-telephone me-2"></i>+421 41 513 5111</p>
          </div>

          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-warning">Odkazy</h5>
            <p><a href="/" className="text-white text-decoration-none small">Domov</a></p>
            <p><a href="/Reservation" className="text-white text-decoration-none small">Rezervácie</a></p>
            <p><a href="/Contact" className="text-white text-decoration-none small">Kontakty</a></p>
          </div>
        </div>

        <hr className="mb-4" />

        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="small text-secondary">
              © {new Date().getFullYear()} Všetky práva vyhradené: 
              <strong className="text-warning"> Žilinská univerzita v Žiline</strong>
            </p>
          </div>
          <div className="col-md-5 col-lg-4">
            <div className="text-center text-md-end">
              <ul className="list-unstyled list-inline">
                <li className="list-inline-item">
                  <a href="#" className="btn-floating btn-sm text-white" style={{fontSize: "23px"}}><i className="bi bi-facebook"></i></a>
                </li>
                <li className="list-inline-item">
                  <a href="#" className="btn-floating btn-sm text-white" style={{fontSize: "23px"}}><i className="bi bi-instagram"></i></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;