import { Routes, Route } from 'react-router-dom';
import MainLayout from "./components/MainLayout"; 
import Login from "./components/Login";
import Register from "./components/Register";
import AdminEdit from "./components/AdminEdit";
import Homepage from "./Homepage";
import CustomerEdit from "./components/CustomerEdit";
import SportoviskoEdit from "./components/SportoviskoEdit";
import GalleryEdit from "./components/GalleryEdit";
import CalendarEdit from "./components/CalendarEdit";
import Reservation from "./components/Reservation";
import MakingReservation from "./components/MakingReservation";
import MyReservations from './components/MyReservations';
import Contacts from './components/Contacts';

function App() {
  return (
    <Routes>
      {/* 1. SKUPINA: Stránky BEZ Navbaru (napr. prihlasovanie) */}
      <Route path="/Register" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/AdminEdit" element={<AdminEdit />} />
      <Route path="/CustomerEdit" element={<CustomerEdit />} />
      <Route path="/SportoviskoEdit" element={<SportoviskoEdit />} />
      <Route path="/admin/sportovisko/:id/galeria" element={<GalleryEdit />} />
      <Route path="/CalendarEdit" element={<CalendarEdit />} />
      <Route path="/admin/sportovisko/:id/kalendar" element={<CalendarEdit />} />

      {/* 2. SKUPINA: Stránky S Navbarom */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/Reservation" element={<Reservation />} />
        <Route path="/MakingReservation/:id" element={<MakingReservation />} />
        <Route path="/MyReservations" element={<MyReservations />} />
        <Route path="/Contact" element={<Contacts />} />

      </Route>
    </Routes>
  );
}

export default App;