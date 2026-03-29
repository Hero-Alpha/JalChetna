// frontend\src\App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AIHealthAssistant from './pages/AIHealthAssistant';
import RiskIntelligence from './pages/RiskIntelligence';
import CommunityHub from './pages/CommunityHub';
import UserProfile from './pages/UserProfile';
import DiseaseEncyclopedia from './pages/DiseaseEncyclopedia';
import LoginPage from './pages/LoginPage.jsx';
import { getCurrentUser } from './services/authService';
import './global.css';

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ai-assistant" element={<AIHealthAssistant />} />
          <Route path="/risk-intelligence" element={<RiskIntelligence />} />
          <Route path="/encyclopedia" element={<DiseaseEncyclopedia />} />
          <Route path="/community" element={<CommunityHub />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;