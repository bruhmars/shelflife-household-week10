import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;