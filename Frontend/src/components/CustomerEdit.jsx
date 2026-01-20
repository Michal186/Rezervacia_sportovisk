import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/users"; 

export default function CustomerEdit() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stav pre upozornenie (namiesto alertu)
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // Stav pre editáciu
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ meno: "", email: "", rola: "" });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Chyba pri načítaní používateľov", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setMessage({ text: "", type: "" }); // Vymazať správu pri začatí editácie
    setEditingId(user.id);
    setEditFormData({ meno: user.meno, email: user.email, rola: user.rola });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setMessage({ text: "", type: "" });
  };

  const handleSaveClick = async (id) => {
    // --- VALIDÁCIA ---
    if (!editFormData.meno.trim()) {
      setMessage({ text: "Meno nemôže byť prázdne.", type: "danger" });
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(editFormData.email)) {
      setMessage({ text: "Neplatný email", type: "danger" });
      return;
    }
    // -----------------

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        setUsers(users.map((u) => (u.id === id ? { ...u, ...editFormData } : u)));
        setEditingId(null);
        setMessage({ text: "Používateľ úspešne upravený.", type: "success" });
        
        // Správa po 3 sekundách zmizne
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      } else {
        const errorData = await response.json();
        setMessage({ text: errorData.message || "Chyba pri ukladaní.", type: "danger" });
      }
    } catch (err) {
      console.error("Chyba pri komunikácii so serverom", err);
      setMessage({ text: "Chyba spojenia so serverom.", type: "danger" });
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Naozaj chceš odstrániť používateľa?")) return;
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      setUsers(users.filter((u) => u.id !== id));
      setMessage({ text: "Používateľ bol odstránený.", type: "info" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      console.error("Chyba pri mazaní používateľa", err);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Správa používateľov</h1>

      {/* Upozornenie hore */}
      {message.text && (
        <div className={`alert alert-${message.type} mb-4`} role="alert">
          {message.text}
        </div>
      )}

      {loading ? (
        <p>Načítavam...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Meno</th>
                <th>Email</th>
                <th>Rola</th>
                <th className="text-end">Akcie</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {editingId === user.id ? (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editFormData.meno}
                        onChange={(e) => setEditFormData({ ...editFormData, meno: e.target.value })}
                      />
                    ) : (user.meno)}
                  </td>
                  <td>
                    {editingId === user.id ? (
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      />
                    ) : (user.email)}
                  </td>
                  <td>
                    {editingId === user.id ? (
                      <select
                        className="form-select form-select-sm"
                        value={editFormData.rola}
                        onChange={(e) => setEditFormData({ ...editFormData, rola: e.target.value })}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`badge ${user.rola === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                        {user.rola}
                      </span>
                    )}
                  </td>
                  <td className="text-end">
                    {editingId === user.id ? (
                      <>
                        <button className="btn btn-sm btn-success me-2" onClick={() => handleSaveClick(user.id)}>
                          Uložiť
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={handleCancelClick}>
                          Zrušiť
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(user)}>
                          Upraviť
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(user.id)}>
                          Odstrániť
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/adminedit")}>
        Späť do admin panelu
      </button>
    </div>
  );
}