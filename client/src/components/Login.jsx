import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const Login = ({ onToggleForm }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.login(formData);
      login(response.user, response.token);
    } catch (error) {
      setError(error.message || 'Prisijungimo klaida / Login error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Prisijungimas</h2>
      
      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Prisijungiama...' : 'Prisijungti'}
        </button>
        
        <button type="button" onClick={onToggleForm}>
          Neturite paskyros? Registruokitės
        </button>
      </form>
    </div>
  );
};

export default Login;
