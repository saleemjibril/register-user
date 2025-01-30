import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setAlert({ type: '', message: '' });

      const response = await loginAdmin(formData);
      
      if (response.success) {
        setAlert({
          type: 'success',
          message: 'Login successful! Redirecting...'
        });
        localStorage.setItem('adminToken', response.token);
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__container">
        <div className="admin-login__header">
          <div className="admin-login__header-logo">
            {/* <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg> */}
          </div>
          <h1 className="admin-login__header-title">Admin Login</h1>
          <p className="admin-login__header-subtitle">
            Enter your credentials to access the admin panel
          </p>
        </div>

        {alert.message && (
          <div className={`admin-login__alert admin-login__alert--${alert.type}`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-login__form-group">
            <label className="admin-login__form-label">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`admin-login__form-input ${
                errors.email ? 'admin-login__form-input--error' : ''
              }`}
              placeholder="admin@company.com"
            />
            {errors.email && (
              <p className="admin-login__form-error">{errors.email}</p>
            )}
          </div>

          <div className="admin-login__form-group">
            <label className="admin-login__form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`admin-login__form-input ${
                errors.password ? 'admin-login__form-input--error' : ''
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="admin-login__form-error">{errors.password}</p>
            )}
          </div>

          {/* <a href="/forgot-password" className="admin-login__form-forgot">
            Forgot password?
          </a> */}

          <button
            type="submit"
            className="admin-login__form-submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

const loginAdmin = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'admin@company.com' && credentials.password === 'password123') {
        resolve({
          success: true,
          token: 'mock-jwt-token'
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};