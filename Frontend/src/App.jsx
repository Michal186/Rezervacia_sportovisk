import Login from "./components/Login";
import Register from "./components/Register";
import AdminEdit from "./components/AdminEdit";
import Homepage from "./Homepage";
import {Routes, Route} from 'react-router-dom'

function App() {
  return (
      
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/AdminEdit" element={<AdminEdit />} />
      </Routes>
    
  );
}

export default App;