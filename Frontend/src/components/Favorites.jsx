const items = [
  { title: "Futbalové ihrisko", color: "bg-success", img: "https://i.imgur.com/KuXbzxD.jpeg" },
  { title: "Tenisové kurty", color: "bg-warning", img: "https://i.imgur.com/1tPWQ5F.jpeg" },
  { title: "Basketbalové ihrisko", color: "bg-primary", img: "https://i.imgur.com/vH0gZxf.jpeg" },
  { title: "Posilňovňa", color: "bg-dark", img: "https://i.imgur.com/LUyL1Yt.jpeg" },
];

export default function Favorites() {
  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">Obľúbené športoviská</h2>

      <div className="row g-4">
        {items.map((item, i) => (
          <div className="col-md-3" key={i}>
            <div className="card shadow-sm border-0">
              <img src={item.img} className="card-img-top" height="150" />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
