import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = "http://localhost:3000";
const API_URL = `${BASE_URL}/api/galeria`;

export default function GalleryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken");
  const role = localStorage.getItem("userRole");

  const [images, setImages] = useState([]);
  const [url, setUrl] = useState("");

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('https://cdn.discordapp.com/attachments/768364763406794762/1463317157398974556/1ef86e48-5134-63f4-9df8-c92ce60e2725.png?ex=697163cd&is=6970124d&hm=1a9b64bfc9aa538c0f0ee26f89acc2f0a14afd56ea3f0c1d0ba5b72cda022ead&')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100%",
    paddingBottom: "50px"
  };

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);

  useEffect(() => {
    fetchGallery();
  }, [id]);

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Chyba pri načítaní galérie", err);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/600x400?text=Chyba+cesty";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path}`;
  };

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

  const handleDelete = async (imageId) => {
    if (!window.confirm("Naozaj chceš vymazať obrázok?")) return;

    try {
      await fetch(`${API_URL}/${imageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGallery();
    } catch (err) {
      console.error("Chyba pri mazaní obrázku", err);
    }
  };

  return (
    <div style={backgroundStyle}>
      <div className="container py-5">
        <h1 className="fw-bold mb-4 text-white text-center" style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.8)" }}>
          <i className="bi bi-images me-2"></i>Galéria športoviska
        </h1>

        {/* FORM PRE PRIDANIE */}
        <div className="card shadow-lg p-4 mb-5 bg-white bg-opacity-95 rounded-4 border-0">
          <h5 className="fw-bold mb-3 text-dark">Pridať nový obrázok</h5>
          <form onSubmit={handleAdd}>
            <div className="row g-3 align-items-center">
              <div className="col-md-9">
                <input
                  className="form-control form-control-lg shadow-sm"
                  placeholder="Vlož URL adresu obrázka (napr. https://...)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3 d-grid">
                <button className="btn btn-danger btn-lg fw-bold rounded-pill shadow">
                  <i className="bi bi-plus-lg me-2"></i>Pridať do galérie
                </button>
              </div>
            </div>
            <small className="text-muted mt-2 d-block">Tip: Môžete vložiť priamy odkaz na obrázok z internetu.</small>
          </form>
        </div>

        {/* GRID GALÉRIE */}
        <div className="row g-4">
          {images.length === 0 && (
            <div className="col-12 text-center py-5">
              <div className="card bg-white bg-opacity-75 p-5 rounded-4 border-0">
                <i className="bi bi-image text-muted display-1"></i>
                <p className="text-muted fs-4 mt-3">Galéria je zatiaľ prázdna.</p>
              </div>
            </div>
          )}

          {images.map((img) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={img.id}>
              <div className="card shadow border-0 h-100 rounded-4 overflow-hidden bg-white bg-opacity-95 gallery-card">
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <img
                    src={getImageUrl(img.adresa_obrazka)}
                    alt="galeria"
                    className="w-100 h-100"
                    style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400?text=Obrázok+nenájdený";
                    }}
                  />
                </div>
                <div className="card-body text-center bg-white">
                  <button
                    className="btn btn-outline-danger w-100 fw-bold rounded-pill"
                    onClick={() => handleDelete(img.id)}
                  >
                    <i className="bi bi-trash3 me-2"></i>Vymazať
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* NAVIGÁCIA SPÄŤ */}
        <div className="mt-5">
          <button
            className="btn btn-light btn-lg px-4 shadow rounded-pill fw-bold"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i>Späť na zoznam
          </button>
        </div>
      </div>
    </div>
  );
}