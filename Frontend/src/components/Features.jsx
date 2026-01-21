
export default function Features() {
  return (
    <div className="container my-5">
      <div className="row g-4 text-center text-md-start">

        <div className="col-md-4 feature-item">
          <div className="d-flex flex-column align-items-center align-items-md-start">
            <h5 className="feature-title">
              <span className="feature-icon">🗓️</span> Jednoduchá rezervácia
            </h5>
            <p className="feature-text">
              Rezervácia vám nezaberie viac než pár sekúnd. Vyberiete športovisko a zadáte termín.
            </p>
          </div>
        </div>

        <div className="col-md-4 feature-item">
          <div className="d-flex flex-column align-items-center align-items-md-start">
            <h5 className="feature-title">
              <span className="feature-icon">💶</span> Výhodné ceny
            </h5>
            <p className="feature-text">
              Transparentné ceny bez skrytých poplatkov. Platíte len za čas, ktorý využijete.
            </p>
          </div>
        </div>

        <div className="col-md-4 feature-item">
          <div className="d-flex flex-column align-items-center align-items-md-start">
            <h5 className="feature-title">
              <span className="feature-icon">⭐</span> Široká ponuka
            </h5>
            <p className="feature-text">
              Od ihrísk po posilňovne. Nájdete tu športoviská pre rekreáciu aj súťaže.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}