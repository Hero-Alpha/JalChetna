// frontend/src/pages/LoginPage.jsx


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
        toast.success('Logged in successfully!');
      } else {
        result = await register(formData);
        toast.success('Account created successfully!');
      }
      
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    },
    card: {
      background: 'white',
      borderRadius: '1.5rem',
      padding: '2rem',
      width: '100%',
      maxWidth: '450px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '0.5rem',
      color: '#1e293b'
    },
    subtitle: {
      textAlign: 'center',
      color: '#64748b',
      marginBottom: '2rem',
      fontSize: '0.875rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      marginBottom: '1rem'
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      background: '#4f46e5',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: '0.5rem'
    },
    toggle: {
      textAlign: 'center',
      marginTop: '1rem',
      fontSize: '0.875rem',
      color: '#64748b'
    },
    toggleLink: {
      color: '#4f46e5',
      cursor: 'pointer',
      fontWeight: 500
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>JalChetna</h1>
        <p style={styles.subtitle}>{isLogin ? 'Welcome back' : 'Create your account'}</p>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          {!isLogin && (
            <input
              type="text"
              name="location"
              placeholder="City (optional)"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
            />
          )}
          
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        
        <div style={styles.toggle}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={styles.toggleLink} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;