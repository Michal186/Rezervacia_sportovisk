import { useEffect, useState } from "react";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/public/reviews");
        if (!response.ok) throw new Error("Chyba pri načítaní recenzií");
        const data = await response.json();

        // OPRAVA: Používame názov stĺpca 'hviezdicky' (s mäkkým i) podľa tvojho backendu
        const topReviews = data.filter(r => Number(r.hviezdicky) === 5);
        setReviews(topReviews);
      } catch (error) {
        console.error("Chyba:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 2) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          (prevIndex + 2 >= reviews.length) ? 0 : prevIndex + 2
        );
      }, 20000);

      return () => clearInterval(interval);
    }
  }, [reviews]);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Načítavam...</span>
        </div>
      </div>
    );
  }

  const displayedReviews = reviews.slice(currentIndex, currentIndex + 2);

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4 text-left">Recenzie - Čo hovoria naši športovci</h2>

      <div className="row g-4 fade-in" key={currentIndex}>
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review) => (
            <div className="col-md-6" key={review.id}>
              <div className="card shadow-sm border-0 p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white me-3 fw-bold" 
                    style={{ width: "60px", height: "60px", fontSize: "20px" }}
                  >
                    {review.meno_pouzivatela ? review.meno_pouzivatela.charAt(0).toUpperCase() : "U"}
                  </div>
                  
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="mb-0 fw-bold">
                        {review.meno_pouzivatela || `Hráč #${review.pouzivatel_id}`}
                      </h6>
                      <small className="text-muted small">
                        {new Date(review.datum_vytvorenia).toLocaleDateString("sk-SK")}
                      </small>
                    </div>
                    <div className="text-primary small fw-semibold mb-1">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {review.sportovisko_nazov}
                    </div>
                    <div className="text-warning small">
                      {/* OPRAVA: Dynamické hviezdy podľa stĺpca hviezdicky */}
                      {"⭐".repeat(Number(review.hviezdicky))}
                    </div>
                  </div>
                </div>

                <div className="card-text bg-light p-3 rounded">
                  <p className="fst-italic text-secondary mb-0">
                    „{review.text_recenzie || "Absolútna spokojnosť, odporúčam!"}“
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">Momentálne nemáme žiadne 5-hviezdičkové recenzie.</p>
          </div>
        )}
      </div>
    </div>
  );
}