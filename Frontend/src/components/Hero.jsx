export default function Hero() {
  return (
    <div
      className="hero-banner text-white d-flex align-items-center"
      style={{
        backgroundImage: "url('https://static.biano.sk/i/product/1020-1020/1b/b9/a6/628b1af2862b666afa4f0bf12a80cce4aa2baa53-fototapeta-futbalove-ihrisko-254x184-cm.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <h1 className="fw-bold display-4 banner-title">
          Rezervujte si športovisko online
        </h1>
        <p className="lead banner-subtitle">
          Vyberte si športovisko a rezervujte si termín rýchlo a jednoducho
        </p>
      </div>
    </div>
  );
}