import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const LOGIN_URL = 'http://localhost:3000/api/login'; 

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    heslo: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(''); 
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setServerError('');
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Email je povinný.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Emailová adresa je neplatná.";
    if (!formData.heslo) tempErrors.heslo = "Heslo je povinné.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, heslo: formData.heslo }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Chyba pri prihlásení. Skúste znova.');
        }

        const token = data.token;
        const role = data.user.rola;

        localStorage.setItem('userToken', token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem("userRole", role);

        if (onLoginSuccess) {
            onLoginSuccess(token); 
        } else {
            navigate('/');
        }

    } catch (error) {
        console.error("Chyba pri fetch volaní:", error.message);
        setServerError(error.message); 
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Prihlásenie</h2>
      <form onSubmit={handleSubmit}>
        
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

        {serverError && <p style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{serverError}</p>}

        {/* --- TLAČIDLO PRIHLÁSIŤ (Hlavná akcia) --- */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            width: '100%',
            padding: '10px 15px', 
            backgroundColor: isSubmitting ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isSubmitting ? 'Prihlasujem...' : 'Prihlásiť sa'}
        </button>

        {/* --- SEKCIA PRE REGISTRÁCIU --- */}
        <div style={{ marginTop: '25px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <p style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
            Ak nie ste registrovaný, kliknite tu:
          </p>
          <button 
            type="button" 
            onClick={() => navigate('/register')}
            style={{ 
              width: '100%',
              padding: '8px 15px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            Registrovať sa
          </button>

          {/* --- NÁVRAT DOMOV --- */}
          <button 
            type="button" 
            onClick={() => navigate('/')}
            style={{ 
              width: '100%',
              padding: '8px 15px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
          >
            Návrat domov
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;