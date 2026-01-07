import React, { useState } from 'react';
// Predpokladáme, že tu je import pre presmerovanie, napr.:
import { useNavigate } from 'react-router-dom'; 

// ⚠️ URL tvojho Express Login endpointu
const LOGIN_URL = 'http://localhost:3000/api/login'; 

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    heslo: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(''); // Na chyby z backendu
  
  // Hook pre presmerovanie
  const navigate = useNavigate();

  // Handler, ktorý aktualizuje stav pri zmene inputu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setServerError('');
  };

  // Klientská validácia
  const validate = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Email je povinný.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Emailová adresa je neplatná.";
    if (!formData.heslo) tempErrors.heslo = "Heslo je povinné.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Spracovanie odoslania formulára s natívnym fetch
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                // Kľúčové: Uvádzame, že posielame JSON
                'Content-Type': 'application/json',
            },
            // JavaScript objekt musíme previesť na JSON reťazec
            body: JSON.stringify({ email: formData.email, heslo: formData.heslo }),
        });

        const data = await response.json(); // Manuálne parsovanie JSON odpovede

        if (!response.ok) {
            // Ak je status 4xx/5xx (napr. 401 Nesprávne heslo), vyhodíme chybu
            throw new Error(data.message || 'Chyba pri prihlásení. Skúste znova.');
        }

        // Úspešné prihlásenie: Získame token
        const token = data.token;
        const role = data.user.rola;

        localStorage.setItem('userToken', token);
        localStorage.setItem('isLoggedIn', 'true');

        
        localStorage.setItem("userRole", role);

        
        // Vykonáme presmerovanie alebo callback
        if (onLoginSuccess) {
            onLoginSuccess(token); 
        } else {
            // Predvolené presmerovanie, napr. na domovskú stránku      NAVIGATE
            navigate('/');
            console.log("Prihlásenie úspešné, token uložený.");
        }

    } catch (error) {
        // Spracovanie chýb zo siete alebo chýb vyhodených v bloku 'if (!response.ok)'
        console.error("Chyba pri fetch volaní:", error.message);
        setServerError(error.message); // Zobrazíme chybu používateľovi
        
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Prihlásenie</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Email */}
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
        </div>

        {/* Heslo */}
        <div style={{ marginBottom: '15px' }}>
          <label>Heslo:</label>
          <input
            type="password"
            name="heslo"
            value={formData.heslo}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {errors.heslo && <p style={{ color: 'red', fontSize: '12px' }}>{errors.heslo}</p>}
        </div>

        {/* Serverová chyba (pre nesprávne meno/heslo) */}
        {serverError && <p style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{serverError}</p>}


        {/* Tlačidlo Submit */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ padding: '10px 15px', backgroundColor: isSubmitting ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
        >
          {isSubmitting ? 'Prihlasujem...' : 'Prihlásiť sa'}
        </button>
      </form>
    </div>
  );
}

export default Login;