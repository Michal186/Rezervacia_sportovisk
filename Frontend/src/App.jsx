import Login from "./components/Login";
import Register from "./components/Register";
import Homepage from "./Homepage";
import {Routes, Route} from 'react-router-dom'

function App() {
  return (
      
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        
      </Routes>
    
  );
}

export default App;