// components/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Uprav cestu podľa toho, kde máš Navbar.jsx

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="container-fluid p-0">
        <Outlet />
      </div>
    </>
  );
}