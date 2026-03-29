// frontend\src\components\Layout\Layout.jsx

import React from 'react';
import Navbar from './Navbar.jsx';

const Layout = ({ children }) => {
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    main: {
      flex: 1,
      paddingTop: '70px'
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;