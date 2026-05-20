import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/signup", {
                name,
                email,
                password
            });
            alert("Signup successful! Please login.");
            navigate("/login");
        } catch (e) {
            setError(e.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
            <h1>Sign Up</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <button onClick={handleSignup} style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}>
                Sign Up
            </button>
            <p>
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
}