import { useNavigate } from "react-router-dom";

const items = [
    { title: "Futbalové ihrisko", type: "Futbal", color: "bg-success", img: "https://www.decotrend.sk/uploads/images/product/Tapeta%20Futbalov%C3%A9%20ihrisko%2029313.jpg.large.jpg" },
    { title: "Tenisové kurty", type: "Tenis", color: "bg-warning", img: "https://www.hoteldaro.sk/wp-content/uploads/2022/02/1600-1066-tenisove-kurty-hotel-daro.jpg" },
    { title: "Basketbalové ihrisko", type: "Basketbal", color: "bg-primary", img: "https://www.shutterstock.com/image-photo/basketball-court-intense-lighting-while-260nw-2472451895.jpg" },
    { title: "Posilňovňa", type: "Posilňovňa", color: "bg-dark", img: "https://m.media-amazon.com/images/I/71t2iMRG+rL._AC_UF894,1000_QL80_.jpg" },
];

export default function Favorites() {
    const navigate = useNavigate();

    return (
        <div className="container my-5">
            <h2 className="fw-bold mb-4">Obľúbené športoviská</h2>
            <div className="row g-4">
                {items.map((item, i) => (
                    <div className="col-md-3" key={i}>
                        <div 
                            className="card shadow-sm border-0 sport-card h-100" 
                            onClick={() => navigate(`/reservation?type=${item.type}`)}
                        >
                            <div className={`card-img-container ${item.color}`}> 
                                <img 
                                    src={item.img} 
                                    className="card-img-top sport-img" 
                                    alt={item.title}
                                    style={{ height: "155px" }} 
                                    onError={(e) => {
                                        e.target.style.display = 'none'; 
                                    }}
                                />
                                <div className="img-fallback">{item.title}</div>
                            </div>
                            
                            <div className="card-body">
                                <h5 className="card-title text-center fw-bold">{item.title}</h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}