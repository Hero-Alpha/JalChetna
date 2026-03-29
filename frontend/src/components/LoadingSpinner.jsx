// frontend/src/components/LoadingSpinner.jsx

import React from 'react';

const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    spinner: {
      width: size,
      height: size,
      border: `3px solid #e2e8f0`,
      borderTopColor: '#4f46e5',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    },
    message: {
      marginTop: '1rem',
      fontSize: '0.875rem',
      color: '#64748b'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      {message && <p style={styles.message}>{message}</p>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;