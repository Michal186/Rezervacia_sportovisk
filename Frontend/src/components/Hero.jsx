export default function Hero() {
  return (
    <div
      className="text-white d-flex align-items-center"
      style={{
        height: "380px",
        backgroundImage: "url('https://i.imgur.com/KuXbzxD.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <h1 className="fw-bold display-4">Rezervujte si športovisko online</h1>
        <p className="lead">Vyberte si športovisko a rezervujte si termín rýchlo a jednoducho</p>
      </div>
    </div>
  );
}
