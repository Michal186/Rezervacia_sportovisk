import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Adresa tvojho backendu
const BASE_URL = "http://localhost:3000";
const API_URL = `${BASE_URL}/api/galeria`;

export default function GalleryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken");
  const role = localStorage.getItem("userRole");

  const [images, setImages] = useState([]);
  const [url, setUrl] = useState("");

  /* =========================
      ADMIN OCHRANA
  ========================= */
  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);

  /* =========================
      NAČÍTANIE GALÉRIE
  ========================= */
  useEffect(() => {
    fetchGallery();
  }, [id]);

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Chyba pri načítaní galérie", err);
    }
  };

  /* =========================
      POMOCNÁ FUNKCIA PRE CESTU K OBRÁZKU
  ========================= */
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/600x400?text=Chyba+cesty";
    
    // Ak cesta začína na http, je to externý link (napr. z internetu)
    if (path.startsWith("http")) {
      return path;
    }
    
    // Ak je to len názov súboru, pridáme adresu backendu a priečinok uploads
    return `${BASE_URL}/uploads/${path}`;
  };

  /* =========================
      PRIDANIE OBRÁZKU
  ========================= */
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!url) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sportovisko_id: id,
          adresa_obrazka: url,
        }),
      });

      if (res.ok) {
        setUrl("");
        fetchGallery();
      }
    } catch (err) {
      console.error("Chyba pri pridávaní obrázku", err);
    }
  };

  /* =========================
      DELETE
  ========================= */
  const handleDelete = async (imageId) => {
    if (!window.confirm("Naozaj chceš vymazať obrázok?")) return;

    try {
      await fetch(`${API_URL}/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchGallery();
    } catch (err) {
      console.error("Chyba pri mazaní obrázku", err);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Galéria športoviska</h1>

      {/* FORM */}
      <form onSubmit={handleAdd} className="card p-4 shadow-sm mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-10">
            <input
              className="form-control"
              placeholder="Vlož URL alebo názov súboru (napr. stadion.jpg)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-danger">Pridať</button>
          </div>
        </div>
      </form>

      {/* GALÉRIA */}
      <div className="row g-4">
        {images.length === 0 && (
          <div className="col-12">
            <p className="text-muted">Žiadne obrázky v galérii.</p>
          </div>
        )}

        {images.map((img) => (
          <div className="col-md-3" key={img.id}>
            <div className="card shadow-sm h-100">
              <img
                src={getImageUrl(img.adresa_obrazka)}
                alt="galeria"
                className="card-img-top bg-light"
                style={{
                    height: "180px",
                    objectFit: "contain",}}
                // Ak sa obrázok nepodarí načítať, zobrazí sa placeholder
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x400?text=Obrázok+nenájdený";
                }}
              />
              <div className="card-body text-center">
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(img.id)}
                >
                  Zmazať
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate(-1)}
      >
        Späť
      </button>
    </div>
  );
}