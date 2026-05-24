import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [householdId, setHouseholdId] = useState(localStorage.getItem("householdId"));
    const [newItem, setNewItem] = useState({ name: "", category: "dairy", expiryDate: "" });
    const [inviteCode, setInviteCode] = useState("");
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const API_URL = process.env.REACT_APP_API_URL;

    const loadItems = useCallback(async () => {
        if (!householdId) return;
        try {
            const res = await axios.get(`${API_URL}/api/items/${householdId}`);
            setItems(res.data.items);
        } catch (e) {
            console.error("Error loading items:", e);
        }
    }, [householdId,  API_URL]);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const addItem = async () => {
        if (!newItem.name || !newItem.expiryDate) {
            alert("Please fill all fields");
            return;
        }
        try {
            await axios.post(`${API_URL}/api/items/add`, {
                householdId,
                name: newItem.name,
                category: newItem.category,
                quantity: 1,
                expiryDate: newItem.expiryDate,
                userId
            });
            setNewItem({ name: "", category: "dairy", expiryDate: "" });
            loadItems();
        } catch (e) {
            alert("Error adding item: " + e.response?.data?.message);
        }
    };

    const deleteItem = async (itemId) => {
        try {
            await axios.delete(`${API_URL}/api/items/${itemId}`);
            loadItems();
        } catch (e) {
            alert("Error deleting item");
        }
    };

    const markDone = async (itemId) => {
        try {
            await axios.put(`${API_URL}/api/items/${itemId}/status`, {
                status: "used"
            });
            loadItems();
        } catch (e) {
            alert("Error updating item");
        }
    };

    const createHousehold = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/households/create`, {
                name: "My Household",
                userId
            });
            setHouseholdId(res.data.household._id);
            localStorage.setItem("householdId", res.data.household._id);
            setInviteCode(res.data.household.inviteCode);
        } catch (e) {
            alert("Error creating household");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("householdId");
        navigate("/login");
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h1>ShelfLife Dashboard</h1>
                <button onClick={logout} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer" }}>
                    Logout
                </button>
            </div>

            {!householdId ? (
                <div style={{ padding: "20px", backgroundColor: "#f0f0f0", marginBottom: "20px" }}>
                    <h2>Create a Household</h2>
                    <button onClick={createHousehold} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
                        Create Household
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ padding: "20px", backgroundColor: "#f0f0f0", marginBottom: "20px" }}>
                        <h3>Invite Code: <strong>{inviteCode}</strong></h3>
                        <p>Share this code with roommates to join your household!</p>
                    </div>

                    <div style={{ padding: "20px", backgroundColor: "#fff", border: "1px solid #ddd", marginBottom: "20px" }}>
                        <h2>Add Item</h2>
                        <input
                            type="text"
                            placeholder="Item name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
                        />
                        <select
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
                        >
                            <option value="dairy">Dairy</option>
                            <option value="produce">Produce</option>
                            <option value="meat">Meat</option>
                            <option value="pantry">Pantry</option>
                            <option value="frozen">Frozen</option>
                        </select>
                        <input
                            type="date"
                            value={newItem.expiryDate}
                            onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                            style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
                        />
                        <button onClick={addItem} style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}>
                            Add Item
                        </button>
                    </div>

                    <div>
                        <h2>Items ({items.length})</h2>
                        {items.length === 0 ? (
                            <p>No items yet. Add one above!</p>
                        ) : (
                            items.map((item) => (
                                <div key={item._id} style={{ padding: "15px", backgroundColor: "#f9f9f9", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                                    <h3>{item.name}</h3>
                                    <p>Category: {item.category}</p>
                                    <p>Expires: {new Date(item.expiryDate).toLocaleDateString()}</p>
                                    <p>Status: <strong>{item.status}</strong></p>
                                    <button onClick={() => markDone(item._id)} style={{ padding: "5px 10px", marginRight: "10px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}>
                                        Mark as Used
                                    </button>
                                    <button onClick={() => deleteItem(item._id)} style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer" }}>
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}