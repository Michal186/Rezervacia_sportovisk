import React, { useState } from "react";

export default function Contacts() {
  const [formData, setFormData] = useState({
    meno: "",
    email: "",
    sprava: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Ďakujeme! Vaša správa bola (fiktívne) odoslaná administrátorovi.");
    setFormData({ meno: "", email: "", sprava: "" });
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Kontaktujte nás</h1>
        <p className="text-muted">Máte otázky ohľadom rezervácií alebo vášho športoviska? Sme tu pre vás.</p>
      </div>

      <div className="row g-4">
        {/* Kontaktné informácie */}
        <div className="col-lg-4">
          <div className="card h-100 shadow-sm border-0 bg-primary text-white">
            <div className="card-body p-4">
              <h4 className="mb-4">Kontaktné údaje</h4>
              
              <div className="d-flex align-items-center mb-4">
                <div className="bg-white text-primary rounded-circle p-2 me-3">
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <div>
                  <p className="mb-0 small text-white-50">Telefón (Admin)</p>
                  <p className="mb-0 fw-bold">+421 9xx 123 456</p>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div className="bg-white text-primary rounded-circle p-2 me-3">
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div>
                  <p className="mb-0 small text-white-50">Email</p>
                  <p className="mb-0 fw-bold">admin@sportoviska.sk</p>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div className="bg-white text-primary rounded-circle p-2 me-3">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <p className="mb-0 small text-white-50">Adresa</p>
                  <p className="mb-0 fw-bold">Športová 15, 811 01 Bratislava</p>
                </div>
              </div>

              <hr className="bg-white" />
              
              <h5 className="mt-4">Podpora (Po - Pi)</h5>
              <p className="small">Sme vám k dispozícii od 08:00 do 18:00.</p>
            </div>
          </div>
        </div>

        {/* Kontaktný formulár */}
        <div className="col-lg-8">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">Napíšte nám správu</h4>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Meno a priezvisko</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Janko Hraško"
                      required
                      value={formData.meno}
                      onChange={(e) => setFormData({...formData, meno: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Emailová adresa</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="meno@domena.sk"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Vaša správa</label>
                  <textarea 
                    className="form-control" 
                    rows="5" 
                    placeholder="Ako vám môžeme pomôcť?"
                    required
                    value={formData.sprava}
                    onChange={(e) => setFormData({...formData, sprava: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary px-4 py-2">
                  Odoslať správu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa (Iframe) */}
      <div className="mt-5">
        <div className="card shadow-sm border-0 overflow-hidden">
          <iframe 
            title="mapa"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.338575086027!2d17.10774771564887!3d48.1485964792244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c8945cf45a195%3A0xc665842886f787b!2sStar%C3%A9%20Mesto%2C%20Bratislava!5e0!3m2!1ssk!2ssk!4v1652345678901!5m2!1ssk!2ssk" 
            width="100%" 
            height="350" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}