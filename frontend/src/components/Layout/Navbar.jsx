// frontend\src\components\Layout\Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Stethoscope, 
  Map, 
  BookOpen,
  Users, 
  User,
  Menu,
  X,
  LogOut,
  Shield,
  ChevronDown
} from 'lucide-react';
import { getCurrentUser, logout } from '../../services/authService';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, [location]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home', public: true },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', public: false },
    { path: '/ai-assistant', icon: Stethoscope, label: 'AI Assistant', public: true },
    { path: '/risk-intelligence', icon: Map, label: 'Risk Map', public: true },
    { path: '/encyclopedia', icon: BookOpen, label: 'Encyclopedia', public: true },
    { path: '/community', icon: Users, label: 'Community', public: true },
    { path: '/profile', icon: User, label: 'Profile', public: false }
  ];

  const visibleNavItems = navItems.filter(item => item.public || user);

  const isActive = (path) => location.pathname === path;

  const styles = {
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      zIndex: 1000,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0.75rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoText: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    desktopNav: {
      display: 'flex',
      gap: '0.25rem',
      alignItems: 'center'
    },
    navLink: (active) => ({
      padding: '0.5rem 0.875rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: active ? '#4f46e5' : '#475569',
      background: active ? '#eef2ff' : 'transparent',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s'
    }),
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    userButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.375rem 0.75rem',
      borderRadius: '0.5rem',
      background: '#f1f5f9',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#1e293b',
      transition: 'all 0.2s'
    },
    userAvatar: {
      width: '32px',
      height: '32px',
      background: '#4f46e5',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '0.875rem',
      fontWeight: 600
    },
    userMenu: {
      position: 'absolute',
      top: '60px',
      right: '2rem',
      background: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      width: '220px',
      zIndex: 1001,
      overflow: 'hidden'
    },
    userMenuItem: {
      padding: '0.75rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.875rem',
      color: '#1e293b',
      cursor: 'pointer',
      transition: 'background 0.2s',
      textDecoration: 'none'
    },
    logoutItem: {
      borderTop: '1px solid #e2e8f0',
      color: '#dc2626'
    },
    mobileMenuBtn: {
      display: 'none',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem'
    },
    mobileSidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: '280px',
      background: 'white',
      zIndex: 1002,
      padding: '1.5rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease'
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1001,
      display: sidebarOpen ? 'block' : 'none'
    },
    mobileNavItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      color: active ? '#4f46e5' : '#475569',
      background: active ? '#eef2ff' : 'transparent',
      textDecoration: 'none',
      fontSize: '0.875rem',
      fontWeight: 500
    })
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.container}>
          {/* Logo */}
          <div style={styles.logo} onClick={() => navigate('/')}>
            <div style={styles.logoIcon}>
              <Shield size={18} color="white" />
            </div>
            <span style={styles.logoText}>JalChetna</span>
          </div>

          {/* Desktop Navigation */}
          <div style={styles.desktopNav} className="desktop-nav">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={styles.navLink(isActive(item.path))}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div style={styles.userSection}>
            {user ? (
              <>
                <button 
                  style={styles.userButton}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div style={styles.userAvatar}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {showUserMenu && (
                  <div style={styles.userMenu}>
                    <Link 
                      to="/profile" 
                      style={styles.userMenuItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                    <Link 
                      to="/dashboard" 
                      style={styles.userMenuItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <div 
                      style={{ ...styles.userMenuItem, ...styles.logoutItem }}
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" style={styles.navLink(false)}>
                <User size={18} />
                Sign In
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              style={styles.mobileMenuBtn}
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />

      {/* Mobile Sidebar */}
      <div style={styles.mobileSidebar}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>
        
        {user && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem 1rem',
            background: '#f1f5f9',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            <div style={styles.userAvatar}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</p>
              <p style={{ fontSize: '0.7rem', color: '#64748b' }}>{user.email}</p>
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={styles.mobileNavItem(isActive(item.path))}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
          
          {user && (
            <div 
              style={{ ...styles.mobileNavItem(false), color: '#dc2626', cursor: 'pointer' }}
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
            >
              <LogOut size={18} />
              Sign Out
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;