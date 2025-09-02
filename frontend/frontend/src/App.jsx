import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import DashBoard from "./Components/DashBoard";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </div>
  );
}

export default App;
