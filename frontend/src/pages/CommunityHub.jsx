// frontend\src\pages\CommunityHub.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Heart, Flag, Share2, RefreshCw, AlertTriangle, ExternalLink, ChevronDown, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CommunityHub = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);
  const [showReportModal, setShowReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    username: '',
    location: '',
    message: '',
    isAnonymous: false
  });
  const [submitting, setSubmitting] = useState(false);
  
  const [reports, setReports] = useState([
    { id: 1, user: "HealthWorker_Delhi", location: "Delhi NCR", message: "Increased diarrhea cases in Okhla area. Water testing recommended.", timestamp: "2 hours ago", likes: 24, verified: true },
    { id: 2, user: "Citizen_Mumbai", location: "Mumbai Suburbs", message: "Water supply intermittent in Andheri East. Neighbors reporting stomach issues.", timestamp: "5 hours ago", likes: 12, verified: false }
  ]);

  useEffect(() => {
    fetchHealthNews();
  }, []);

  const fetchHealthNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/news/health-news`);
      setNews(response.data.data || []);
      setVisibleCount(5);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      toast.error('Could not load news');
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = () => {
    fetchHealthNews();
    toast.success("News refreshed");
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 5, news.length));
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!newReport.message.trim()) {
      toast.error('Please enter a report message');
      return;
    }
    if (!newReport.location.trim()) {
      toast.error('Please enter a location');
      return;
    }

    setSubmitting(true);
    
    // Simulate API call - later connect to backend
    setTimeout(() => {
      const newReportObj = {
        id: reports.length + 1,
        user: newReport.isAnonymous ? 'Anonymous' : (newReport.username || 'Community Member'),
        location: newReport.location,
        message: newReport.message,
        timestamp: 'Just now',
        likes: 0,
        verified: false
      };
      
      setReports([newReportObj, ...reports]);
      setShowReportModal(false);
      setNewReport({ username: '', location: '', message: '', isAnonymous: false });
      toast.success('Report submitted successfully!');
      setSubmitting(false);
    }, 500);
  };

  const handleLike = (id) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, likes: report.likes + 1 } : report
    ));
  };

  const visibleNews = news.slice(0, visibleCount);
  const hasMore = visibleCount < news.length;

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' },
    subtitle: { color: '#64748b' },
    grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' },
    card: { background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' },
    reportItem: { borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem', transition: 'background 0.2s' },
    newsItem: { borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.75rem' },
    newsLink: { textDecoration: 'none', color: 'inherit' },
    newsTitle: { fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' },
    newsDesc: { fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' },
    newsMeta: { fontSize: '0.65rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' },
    tipsBox: { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '1rem', padding: '1.5rem', color: 'white' },
    loadMoreBtn: {
      width: '100%',
      padding: '0.5rem',
      marginTop: '0.75rem',
      background: '#f1f5f9',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      color: '#4f46e5',
      fontSize: '0.75rem',
      fontWeight: 500,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modal: {
      background: 'white',
      borderRadius: '1rem',
      maxWidth: '500px',
      width: '90%',
      padding: '1.5rem',
      position: 'relative'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid #e2e8f0'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      marginBottom: '1rem'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      marginBottom: '1rem',
      fontFamily: 'inherit',
      resize: 'vertical'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    submitBtn: {
      width: '100%',
      padding: '0.75rem',
      background: '#4f46e5',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Community Hub</h1>
        <p style={styles.subtitle}>Real-time health news, community reports, and verified alerts</p>
      </div>

      <div style={styles.grid}>
        {/* Main Feed - Community Reports */}
        <div>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 600 }}>Community Reports</h3>
              <button 
                onClick={() => setShowReportModal(true)}
                style={{ color: '#4f46e5', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                + Report Issue
              </button>
            </div>
            {reports.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No reports yet. Be the first to report!</p>
            ) : (
              reports.map((report) => (
                <div key={report.id} style={styles.reportItem}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', background: '#eef2ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageCircle size={20} color="#4f46e5" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 500 }}>{report.user}</span>
                        {report.verified && <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.7rem', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>Verified</span>}
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{report.location}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '0.5rem' }}>{report.message}</p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                        <span>{report.timestamp}</span>
                        <button 
                          onClick={() => handleLike(report.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                        >
                          <Heart size={14} /> {report.likes}
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                          <Flag size={14} /> Report
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                          <Share2 size={14} /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar - Live News */}
        <div>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 600 }}>Live Health News</h3>
              <button onClick={refreshNews} disabled={loading} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              </button>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="spinner" style={{ width: '30px', height: '30px' }}></div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Loading latest news...</p>
              </div>
            ) : news.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No news available</p>
            ) : (
              <>
                {visibleNews.map((item, idx) => (
                  <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" style={styles.newsLink}>
                    <div style={styles.newsItem}>
                      <h4 style={styles.newsTitle}>{item.title}</h4>
                      <p style={styles.newsDesc}>{item.description?.substring(0, 100)}...</p>
                      <div style={styles.newsMeta}>
                        <span>{item.source}</span>
                        <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </a>
                ))}
                {hasMore && (
                  <button onClick={loadMore} style={styles.loadMoreBtn}>
                    <ChevronDown size={14} />
                    Load More ({news.length - visibleCount} remaining)
                  </button>
                )}
              </>
            )}
          </div>

          <div style={styles.tipsBox}>
            <AlertTriangle size={24} style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Quick Prevention Tips</h3>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', lineHeight: '1.75' }}>
              <li>✓ Boil water before drinking</li>
              <li>✓ Wash hands with soap</li>
              <li>✓ Avoid street food during outbreaks</li>
              <li>✓ Report symptoms early</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div style={styles.modalOverlay} onClick={() => setShowReportModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ fontWeight: 600 }}>Report a Health Issue</h3>
              <button 
                onClick={() => setShowReportModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleReportSubmit}>
              <input
                type="text"
                placeholder="Your name (optional)"
                value={newReport.username}
                onChange={(e) => setNewReport({...newReport, username: e.target.value})}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Location *"
                value={newReport.location}
                onChange={(e) => setNewReport({...newReport, location: e.target.value})}
                style={styles.input}
                required
              />
              <textarea
                rows="4"
                placeholder="Describe the issue (water contamination, disease cases, etc.) *"
                value={newReport.message}
                onChange={(e) => setNewReport({...newReport, message: e.target.value})}
                style={styles.textarea}
                required
              />
              <div style={styles.checkbox}>
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={newReport.isAnonymous}
                  onChange={(e) => setNewReport({...newReport, isAnonymous: e.target.checked})}
                />
                <label htmlFor="anonymous" style={{ fontSize: '0.875rem', color: '#64748b' }}>Post anonymously</label>
              </div>
              <button type="submit" disabled={submitting} style={styles.submitBtn}>
                {submitting ? 'Submitting...' : <><Send size={16} /> Submit Report</>}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CommunityHub;