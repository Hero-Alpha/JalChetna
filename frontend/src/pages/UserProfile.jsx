// frontend\src\pages\UserProfile.jsx

import React, { useState, useEffect } from 'react';
import { User, FileText, Calendar, Shield, Edit2, Download, Trash2, LogOut, Heart, Activity, MapPin, Mail, Clock, ChevronRight } from 'lucide-react';
import { getCurrentUser, logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllPredictions, generatePrediction } from '../services/api';
import { generateRiskReport } from '../utils/pdfGenerator';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [allPredictions, setAllPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', location: '' });
  const [selectedRegion, setSelectedRegion] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setEditForm({ name: currentUser.name, location: currentUser.location || '' });
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await getAllPredictions();
      const predictions = response.data.data || [];
      setAllPredictions(predictions);
      
      // For now, show all predictions (later filter by user ID)
      setUserReports(predictions.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Update local storage
      const updatedUser = { ...user, name: editForm.name, location: editForm.location };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleGenerateNewReport = async () => {
    if (!selectedRegion.trim()) {
      toast.error('Please enter a region name');
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await generatePrediction(selectedRegion);
      const newReport = response.data.data;
      setUserReports([newReport, ...userReports.slice(0, 4)]);
      setAllPredictions([newReport, ...allPredictions]);
      toast.success(`Report for ${selectedRegion} generated!`);
      setSelectedRegion('');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReport = (reportId) => {
    setUserReports(userReports.filter(r => r._id !== reportId));
    toast.success('Report deleted');
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'Critical': return '#dc2626';
      case 'High': return '#f97316';
      case 'Medium': return '#eab308';
      case 'Low': return '#22c55e';
      default: return '#64748b';
    }
  };

  const getRiskStats = () => {
    const highRisk = allPredictions.filter(p => p.risk_level === 'High' || p.risk_level === 'Critical').length;
    const mediumRisk = allPredictions.filter(p => p.risk_level === 'Medium').length;
    const lowRisk = allPredictions.filter(p => p.risk_level === 'Low').length;
    return { highRisk, mediumRisk, lowRisk, total: allPredictions.length };
  };

  const stats = getRiskStats();

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' },
    subtitle: { color: '#64748b' },
    
    // Profile Card
    profileCard: { background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2rem', marginBottom: '2rem' },
    profileHeader: { display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' },
    avatar: { width: '100px', height: '100px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: '2.5rem', fontWeight: 'bold', color: 'white' },
    profileInfo: { flex: 1 },
    nameRow: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' },
    name: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' },
    editBtn: { padding: '0.375rem 0.75rem', background: '#f1f5f9', border: 'none', borderRadius: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' },
    detailRow: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' },
    logoutBtn: { padding: '0.5rem 1rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' },
    
    // Stats Grid
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem' },
    statCard: { padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', textAlign: 'center' },
    statValue: { fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' },
    statLabel: { fontSize: '0.7rem', color: '#64748b' },
    
    // New Report Section
    newReportCard: { background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2rem' },
    sectionTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    inputGroup: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
    input: { flex: 1, padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '0.875rem' },
    generateBtn: { padding: '0.75rem 1.5rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    
    // Reports List
    reportsCard: { background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem' },
    reportItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #e2e8f0' },
    reportInfo: { flex: 1 },
    reportRegion: { fontWeight: 600, marginBottom: '0.25rem' },
    reportDate: { fontSize: '0.7rem', color: '#94a3b8' },
    reportRisk: (level) => ({ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: getRiskColor(level), color: 'white' }),
    reportActions: { display: 'flex', gap: '0.5rem' },
    actionBtn: { padding: '0.375rem', background: '#f1f5f9', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
    
    // Edit Modal
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modal: { background: 'white', borderRadius: '1rem', padding: '2rem', width: '90%', maxWidth: '400px' },
    modalInput: { width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', marginBottom: '1rem' },
    modalButtons: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' },
    saveBtn: { padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' },
    cancelBtn: { padding: '0.5rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Profile</h1>
        <p style={styles.subtitle}>Manage your health history and saved reports</p>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            <span style={styles.avatarText}>{user.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div style={styles.profileInfo}>
            <div style={styles.nameRow}>
              <h2 style={styles.name}>{user.name}</h2>
              <button style={styles.editBtn} onClick={() => setIsEditing(true)}>
                <Edit2 size={14} /> Edit
              </button>
            </div>
            <div style={styles.detailRow}>
              <span><Mail size={14} /> {user.email}</span>
              <span><MapPin size={14} /> {user.location || 'Location not set'}</span>
              <span><Clock size={14} /> Member since {new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <FileText size={20} color="#4f46e5" />
            <p style={styles.statValue}>{stats.total}</p>
            <p style={styles.statLabel}>Total Reports</p>
          </div>
          <div style={styles.statCard}>
            <Heart size={20} color="#dc2626" />
            <p style={styles.statValue}>{stats.highRisk}</p>
            <p style={styles.statLabel}>High Risk</p>
          </div>
          <div style={styles.statCard}>
            <Activity size={20} color="#eab308" />
            <p style={styles.statValue}>{stats.mediumRisk}</p>
            <p style={styles.statLabel}>Medium Risk</p>
          </div>
          <div style={styles.statCard}>
            <Shield size={20} color="#22c55e" />
            <p style={styles.statValue}>{stats.lowRisk}</p>
            <p style={styles.statLabel}>Low Risk</p>
          </div>
        </div>
      </div>

      {/* Generate New Report */}
      <div style={styles.newReportCard}>
        <h3 style={styles.sectionTitle}>
          <FileText size={18} /> Generate New Risk Report
        </h3>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Enter city or region (e.g., Delhi, Mumbai)"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleGenerateNewReport} disabled={isGenerating} style={styles.generateBtn}>
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Saved Reports */}
      <div style={styles.reportsCard}>
        <h3 style={styles.sectionTitle}>
          <Calendar size={18} /> Saved Reports
        </h3>
        {userReports.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
            No saved reports yet. Generate a report above to see it here.
          </p>
        ) : (
          userReports.map((report) => (
            <div key={report._id} style={styles.reportItem}>
              <div style={styles.reportInfo}>
                <p style={styles.reportRegion}>{report.region}</p>
                <p style={styles.reportDate}>
                  {new Date(report.createdAt).toLocaleDateString()} • Risk Score: {report.risk_score}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={styles.reportRisk(report.risk_level)}>{report.risk_level}</span>
                <div style={styles.reportActions}>
                  <button 
                    style={styles.actionBtn}
                    onClick={() => generateRiskReport(report)}
                    title="Download PDF"
                  >
                    <Download size={14} />
                  </button>
                  <button 
                    style={{ ...styles.actionBtn, color: '#dc2626' }}
                    onClick={() => handleDeleteReport(report._id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div style={styles.modalOverlay} onClick={() => setIsEditing(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem' }}>Edit Profile</h3>
            <input
              type="text"
              placeholder="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              style={styles.modalInput}
            />
            <input
              type="text"
              placeholder="Location"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              style={styles.modalInput}
            />
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleUpdateProfile}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;