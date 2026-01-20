import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"; // Importuj tvoj nový Footer

export default function MainLayout() {
  return (
    // d-flex flex-column min-vh-100 zabezpečí, že footer bude na spodu
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      {/* flex-grow-1 vyplní zvyšné miesto, čím potlačí footer dole */}
      <div className="container-fluid p-0 flex-grow-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}