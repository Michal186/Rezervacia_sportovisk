import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/users"; // uprav podľa backendu

export default function CustomerEdit() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ochrana stránky + načítanie používateľov
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

  const deleteUser = async (id) => {
    if (!window.confirm("Naozaj chceš odstrániť používateľa?") ) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Chyba pri mazaní používateľa", err);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Správa používateľov</h1>

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
                  <td>{user.meno}</td>
                  <td>{user.email}</td>
                  <td>{user.rola}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2">
                      Upraviť
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteUser(user.id)}
                    >
                      Odstrániť
                    </button>
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
