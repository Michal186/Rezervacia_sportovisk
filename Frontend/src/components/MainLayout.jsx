import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"; 

export default function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <div className="container-fluid p-0 flex-grow-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}