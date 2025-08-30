import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const Register = ({ onToggleForm }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Išvalyti konkretaus lauko klaidą, kai vartotojas rašo
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = 'Vartotojo vardas turi būti bent 3 simboliai / Username must be at least 3 characters';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Neteisingas el. pašto formatas / Invalid email format';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Slaptažodis turi būti bent 6 simboliai / Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Slaptažodžiai nesutampa / Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validuoti formą
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await apiService.register(registrationData);
      login(response.user, response.token);
    } catch (error) {
      if (error.message.includes('email')) {
        setErrors({ email: 'El. paštas jau naudojamas / Email already in use' });
      } else if (error.message.includes('username')) {
        setErrors({ username: 'Vartotojo vardas jau naudojamas / Username already in use' });
      } else {
        setErrors({ general: error.message || 'Registracijos klaida / Registration error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Registracija</h2>
      
      {errors.general && (
        <div className="alert error">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Vartotojo vardas:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          {errors.username && <div style={{ color: 'red', fontSize: '14px' }}>{errors.username}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">El. paštas:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          {errors.email && <div style={{ color: 'red', fontSize: '14px' }}>{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Slaptažodis:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          {errors.password && <div style={{ color: 'red', fontSize: '14px' }}>{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Patvirtinti slaptažodį:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          {errors.confirmPassword && <div style={{ color: 'red', fontSize: '14px' }}>{errors.confirmPassword}</div>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registruojamasi...' : 'Registruotis'}
        </button>
        
        <button type="button" onClick={onToggleForm}>
          Turite paskyrą? Prisijunkite
        </button>
      </form>
    </div>
  );
};

export default Register;
