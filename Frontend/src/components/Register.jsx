import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Register() {
    
    const navigate = useNavigate();

  // 1. Nastavenie stavu formulára pomocou useState
  const [formData, setFormData] = useState({
    meno: '',
    email: '',
    heslo: '',
    confirmHeslo: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Handler pre zmenu inputov
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Aktualizuje iba zmenené pole v objekte formData
    setFormData({ ...formData, [name]: value });
  };

  // 3. Základná validácia formulára
  const validate = () => {
    let tempErrors = {};

    if (!formData.meno.trim()) tempErrors.meno = "Meno je povinné.";
    if (!formData.email) tempErrors.email = "Email je povinný.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Emailová adresa je neplatná.";
    if (formData.heslo.length < 6) tempErrors.heslo = "Heslo musí mať aspoň 6 znakov.";
    if (formData.heslo !== formData.confirmHeslo) tempErrors.confirmHeslo = "Heslá sa nezhodujú.";
    
    setErrors(tempErrors);
    // Vráti true, ak je objekt tempErrors prázdny (žiadne chyby)
    return Object.keys(tempErrors).length === 0;
  };

  // 4. Handler pre odoslanie formulára
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const REGISTER_URL = 'http://localhost:3000/api/register';

    async function registraciaNative(meno, email, heslo) {
        const dataToSend = { meno, email, heslo };

        try {
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Chyba registrácie.');
            }

            return { success: true, message: data.message };

        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    const result = await registraciaNative(
        formData.meno,
        formData.email,
        formData.heslo
    );

    console.log(result);
    navigate('/Login');
};

  return (
    <div className="register-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Registrácia nového používateľa</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Meno */}
        <div style={{ marginBottom: '15px' }}>
          <label>Meno:</label>
          <input
            type="text"
            name="meno"
            value={formData.meno}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {errors.meno && <p style={{ color: 'red', fontSize: '12px' }}>{errors.meno}</p>}
        </div>

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

        {/* Potvrdenie Hesla */}
        <div style={{ marginBottom: '15px' }}>
          <label>Potvrdiť Heslo:</label>
          <input
            type="password"
            name="confirmHeslo"
            value={formData.confirmHeslo}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {errors.confirmHeslo && <p style={{ color: 'red', fontSize: '12px' }}>{errors.confirmHeslo}</p>}
        </div>

        {/* Tlačidlo Submit */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ padding: '10px 15px', backgroundColor: isSubmitting ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          
        >

            {isSubmitting ? 'Odosielam...' : 'Registrovať'}
        </button>
      </form>
    </div>
  );
}

export default Register;