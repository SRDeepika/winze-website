import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSocialLinks from './AdminSocialLinks';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ total: 0, uniqueLinks: 0, last24Hours: 0 });
    const [allClicks, setAllClicks] = useState([]);
    const [groupedClicks, setGroupedClicks] = useState({});
    const [loading, setLoading] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState({});
    const navigate = useNavigate();

    // Check if user is logged in
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (!isLoggedIn) {
            navigate('/admin-login');
        }
    }, [navigate]);

    // Fetch click statistics and all clicks
    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchStats();
            fetchAllClicks();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/clicks/stats');
            if (res.data.success) {
                setStats(res.data.stats);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
        setLoading(false);
    };

    const fetchAllClicks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/clicks');
            if (res.data.success) {
                const clicks = res.data.clicks;
                setAllClicks(clicks);
                
                // Group clicks by link_title
                const grouped = {};
                clicks.forEach(click => {
                    const title = click.link_title;
                    if (!grouped[title]) {
                        grouped[title] = [];
                    }
                    grouped[title].push(click);
                });
                setGroupedClicks(grouped);
                
                // Initialize expanded state (all collapsed by default)
                const initialExpanded = {};
                Object.keys(grouped).forEach(key => {
                    initialExpanded[key] = false;
                });
                setExpandedCategories(initialExpanded);
            }
        } catch (err) {
            console.error('Error fetching clicks:', err);
        }
    };

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        navigate('/admin-login');
    };

    // Calculate total unique links from grouped data
    const totalUniqueLinks = Object.keys(groupedClicks).length;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div style={{
                width: '260px',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: 'white',
                padding: '20px 0',
                position: 'fixed',
                height: '100vh',
                overflowY: 'auto'
            }}>
                <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.3rem', margin: 0 }}>⚡ Admin Panel</h2>
                    <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '5px' }}>Winze Technologies</p>
                </div>

                <nav>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            background: activeTab === 'dashboard' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                            border: 'none',
                            color: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '15px',
                            transition: 'all 0.3s',
                            borderLeft: activeTab === 'dashboard' ? '3px solid #FFD700' : '3px solid transparent'
                        }}
                    >
                        📊 Click Analytics
                    </button>

                    <button
                        onClick={() => setActiveTab('socialLinks')}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            background: activeTab === 'socialLinks' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                            border: 'none',
                            color: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '15px',
                            transition: 'all 0.3s',
                            borderLeft: activeTab === 'socialLinks' ? '3px solid #FFD700' : '3px solid transparent'
                        }}
                    >
                        🔗 Social Links
                    </button>

                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            background: 'transparent',
                            border: 'none',
                            color: '#ff6b6b',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '15px',
                            transition: 'all 0.3s',
                            marginTop: '20px',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            paddingTop: '20px'
                        }}
                    >
                        🚪 Logout
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: '260px', flex: 1, padding: '30px', background: '#f5f6fa', minHeight: '100vh' }}>
                {/* Dashboard Tab - Click Analytics */}
                {activeTab === 'dashboard' && (
                    <div>
                        <h1 style={{ marginBottom: '10px', color: '#1a1a2e' }}>Click Analytics Dashboard</h1>
                        <p style={{ color: '#666', marginBottom: '30px' }}>Complete click tracking statistics for your website</p>

                        {/* Stats Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px',
                            marginBottom: '30px'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                padding: '25px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                textAlign: 'center',
                                color: 'white'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📈</div>
                                <h3 style={{ marginBottom: '10px', opacity: 0.9 }}>Total Clicks</h3>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
                                    {loading ? '...' : stats.total}
                                </p>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                padding: '25px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                textAlign: 'center',
                                color: 'white'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔗</div>
                                <h3 style={{ marginBottom: '10px', opacity: 0.9 }}>Unique Links</h3>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
                                    {loading ? '...' : totalUniqueLinks}
                                </p>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                padding: '25px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                textAlign: 'center',
                                color: 'white'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⏰</div>
                                <h3 style={{ marginBottom: '10px', opacity: 0.9 }}>Last 24 Hours</h3>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
                                    {loading ? '...' : stats.last24Hours}
                                </p>
                            </div>
                        </div>

                        {/* All Clicks Grouped by Link Title */}
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                        }}>
                            <h3 style={{ marginBottom: '20px', color: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>📋 All Clickable Links ({totalUniqueLinks} unique links, {stats.total} total clicks)</span>
                                <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                                    Click on any category to expand/collapse
                                </span>
                            </h3>

                            {Object.keys(groupedClicks).length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                                    No clicks recorded yet. Click around your website to see data.
                                </p>
                            ) : (
                                <div>
                                    {Object.entries(groupedClicks).map(([title, clicks]) => (
                                        <div key={title} style={{
                                            marginBottom: '15px',
                                            border: '1px solid #eee',
                                            borderRadius: '8px',
                                            overflow: 'hidden'
                                        }}>
                                            {/* Category Header */}
                                            <div
                                                onClick={() => toggleCategory(title)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '15px',
                                                    background: '#f8f9fa',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    borderBottom: expandedCategories[title] ? '1px solid #eee' : 'none'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#e9ecef'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                            >
                                                <div>
                                                    <strong style={{ fontSize: '16px', color: '#1a1a2e' }}>{title}</strong>
                                                    <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
                                                        ({clicks.length} {clicks.length === 1 ? 'click' : 'clicks'})
                                                    </span>
                                                </div>
                                                <span style={{ fontSize: '18px', color: '#667eea' }}>
                                                    {expandedCategories[title] ? '▼' : '▶'}
                                                </span>
                                            </div>

                                            {/* Category Details (Expandable) */}
                                            {expandedCategories[title] && (
                                                <div style={{ padding: '15px' }}>
                                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                        <thead>
                                                            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                                                                <th style={{ padding: '10px', textAlign: 'left' }}>#</th>
                                                                <th style={{ padding: '10px', textAlign: 'left' }}>URL</th>
                                                                <th style={{ padding: '10px', textAlign: 'left' }}>Clicked At</th>
                                                                <th style={{ padding: '10px', textAlign: 'left' }}>IP Address</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {clicks.map((click, idx) => (
                                                                <tr key={click.id} style={{ borderBottom: '1px solid #eee' }}>
                                                                    <td style={{ padding: '10px' }}>{idx + 1}</td>
                                                                    <td style={{ padding: '10px' }}>
                                                                        <a href={click.link_url} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', fontSize: '12px' }}>
                                                                            {click.link_url?.substring(0, 60)}...
                                                                        </a>
                                                                    </td>
                                                                    <td style={{ padding: '10px', fontSize: '12px' }}>
                                                                        {new Date(click.clicked_at).toLocaleString()}
                                                                    </td>
                                                                    <td style={{ padding: '10px', fontSize: '12px' }}>
                                                                        {click.ip_address || 'user'}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Social Links Tab */}
                {activeTab === 'socialLinks' && <AdminSocialLinks />}
            </div>
        </div>
    );
};

export default AdminPage;