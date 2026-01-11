import Login from "./components/Login";
import Register from "./components/Register";
import AdminEdit from "./components/AdminEdit";
import Homepage from "./Homepage";
import CustomerEdit from "./components/CustomerEdit";
import SportoviskoEdit from "./components/SportoviskoEdit";
import GalleryEdit from "./components/GalleryEdit";
import CalendarEdit from "./components/CalendarEdit";
import {Routes, Route} from 'react-router-dom'

function App() {
  return (
      
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/AdminEdit" element={<AdminEdit />} />
        <Route path="/CustomerEdit" element={<CustomerEdit />} />
        <Route path="/SportoviskoEdit" element={<SportoviskoEdit />} />
        <Route path="/admin/sportovisko/:id/galeria" element={<GalleryEdit />} />
        <Route path="/CalendarEdit" element={<CalendarEdit />} />
        <Route path="/admin/sportovisko/:id/kalendar" element={<CalendarEdit />} />
      </Routes>
    
  );
}

export default App;