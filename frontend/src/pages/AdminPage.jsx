import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllClicks } from '../services/api';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminAuthenticated');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    // Check if logged in and session is not too old (8 hours max)
    if (isLoggedIn === 'true' && loginTime) {
      const loginDate = new Date(loginTime);
      const now = new Date();
      const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
      
      if (hoursDiff < 8) {
        setIsAuthenticated(true);
        fetchClicks();
      } else {
        // Session expired
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        navigate('/admin-login');
      }
    } else {
      navigate('/admin-login');
    }
  }, [navigate]);

  const fetchClicks = async () => {
    try {
      const response = await getAllClicks();
      setClicks(response.clicks);
      setTotalClicks(response.total);
    } catch (error) {
      console.error('Failed to fetch clicks:', error);
      toast.error('Failed to load click data');
    } finally {
      setLoading(false);
    }
  };

  // Remove this handleLogout from here if it exists
  // The logout is now handled in Header.jsx

  if (!isAuthenticated || loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px' }}>
        {/* REMOVED the duplicate Logout button from here */}

        {/* Stats Cards */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '30px',
          color: 'white',
          marginBottom: '30px'
        }}>
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Admin Dashboard</h1>
          <p style={{ opacity: 0.9 }}>Real-time click tracking analytics</p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '30px'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '15px'
            }}>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>Total Clicks</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalClicks}</div>
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '15px'
            }}>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>Unique Links</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                {new Set(clicks.map(c => c.link_url)).size}
              </div>
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '15px'
            }}>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>Last 24 Hours</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                {clicks.filter(c => new Date(c.clicked_at) > new Date(Date.now() - 24*60*60*1000)).length}
              </div>
            </div>
          </div>
        </div>

        {/* Clicks Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          overflowX: 'auto'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Click History</h2>
          
          {clicks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>No clicks tracked yet</p>
              <p>Start clicking links on the homepage!</p>
            </div>
          ) : (
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f5f5f5',
                  borderBottom: '2px solid #ddd'
                }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Link Title</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>URL</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Clicked At</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {clicks.map((click, index) => (
                  <tr key={click.id} style={{
                    borderBottom: '1px solid #eee',
                    transition: 'background 0.3s',
                  }}>
                    <td style={{ padding: '12px' }}>{click.id}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{click.link_title}</td>
                    <td style={{ padding: '12px', color: '#667eea' }}>
                      <a href={click.link_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#667eea' }}>
                        {click.link_url}
                      </a>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {new Date(click.clicked_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>{click.ip_address || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;