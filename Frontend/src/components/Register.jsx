import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    meno: '',
    email: '',
    heslo: '',
    confirmHeslo: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.meno.trim()) tempErrors.meno = "Meno je povinné.";
    if (!formData.email) tempErrors.email = "Email je povinný.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Emailová adresa je neplatná.";
    if (formData.heslo.length < 6) tempErrors.heslo = "Heslo musí mať aspoň 6 znakov.";
    if (formData.heslo !== formData.confirmHeslo) tempErrors.confirmHeslo = "Heslá sa nezhodujú.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const REGISTER_URL = 'http://localhost:3000/api/register';

    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meno: formData.meno,
          email: formData.email,
          heslo: formData.heslo
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Chyba registrácie.');

      console.log("Registrácia úspešná:", data);
      navigate('/Login');
    } catch (error) {
      console.error(error.message);
      setErrors({ server: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container" style={{ maxWidth: '450px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Registrácia nového používateľa</h2>
      <form onSubmit={handleSubmit}>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Meno:</label>
          <input type="text" name="meno" value={formData.meno} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          {errors.meno && <p style={{ color: 'red', fontSize: '12px' }}>{errors.meno}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Heslo:</label>
          <input type="password" name="heslo" value={formData.heslo} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          {errors.heslo && <p style={{ color: 'red', fontSize: '12px' }}>{errors.heslo}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Potvrdiť Heslo:</label>
          <input type="password" name="confirmHeslo" value={formData.confirmHeslo} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          {errors.confirmHeslo && <p style={{ color: 'red', fontSize: '12px' }}>{errors.confirmHeslo}</p>}
        </div>

        {errors.server && <p style={{ color: 'red', fontWeight: 'bold' }}>{errors.server}</p>}

        {/* --- TLAČIDLO REGISTROVAŤ (Hlavná akcia) --- */}
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
          {isSubmitting ? 'Odosielam...' : 'Registrovať'}
        </button>

        {/* --- SEKCIA PRE PRIHLÁSENIE (Nižšie) --- */}
        <div style={{ marginTop: '25px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <p style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
            Už ste registrovaný? Kliknite tu:
          </p>
          <button 
            type="button" 
            onClick={() => navigate('/Login')}
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
            Prihlásiť sa
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

export default Register;