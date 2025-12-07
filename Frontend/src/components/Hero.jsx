export default function Hero() {
  return (
    // Pridanie triedy 'hero-banner' na hlavný kontajner
    <div
      className="hero-banner text-white d-flex align-items-center"
      style={{
        // Ponecháme len štýly, ktoré sú dynamické alebo viazané na React (ako pozadie z URL)
        backgroundImage: "url('https://static.biano.sk/i/product/1020-1020/1b/b9/a6/628b1af2862b666afa4f0bf12a80cce4aa2baa53-fototapeta-futbalove-ihrisko-254x184-cm.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        // Výšku (height) presunieme do CSS triedy .hero-banner v index.css
      }}
    >
      <div className="container">
        {/* Pridanie triedy 'banner-title' pre štylizáciu textu */}
        <h1 className="fw-bold display-4 banner-title">
          Rezervujte si športovisko online
        </h1>
        {/* Štylizáciu podnadpisu (p.lead) pridáme tiež do index.css, ak chceme, aby mal rovnaký štýl */}
        <p className="lead banner-subtitle">
          Vyberte si športovisko a rezervujte si termín rýchlo a jednoducho
        </p>
      </div>
    </div>
  );
}