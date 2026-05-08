import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSocialLinks from './AdminSocialLinks';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://winze-backend-api.onrender.com/api';

// Helper to get auth config
const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

// Login Component
const AdminLogin = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${API_BASE_URL}/admin/login`, { username, password });
            if (res.data.success) {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', username);
                localStorage.setItem('adminToken', res.data.token);
                onLogin(username);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.iconContainer}>
                    <span style={styles.icon}>🔐</span>
                </div>
                <h2 style={styles.title}>Admin Login</h2>
                <p style={styles.subtitle}>Enter your credentials to access dashboard</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    {error && <div style={styles.error}>{error}</div>}
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Profile Settings Component
const ProfileSettings = ({ username, onLogout }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        if (!newUsername) {
            setMessage({ text: 'Please enter a new username', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            const config = getAuthConfig();
            const res = await axios.post(`${API_BASE_URL}/admin/change-username`, {
                username,
                newUsername,
                password: currentPassword
            }, config);
            if (res.data.success) {
                setMessage({ text: 'Username changed successfully! Please login again.', type: 'success' });
                setTimeout(() => {
                    localStorage.removeItem('adminLoggedIn');
                    localStorage.removeItem('adminUsername');
                    localStorage.removeItem('adminToken');
                    onLogout();
                }, 2000);
            }
        } catch (err) {
            setMessage({ text: err.response?.data?.error || 'Failed to change username', type: 'error' });
        }
        setLoading(false);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ text: 'New passwords do not match', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            const config = getAuthConfig();
            const res = await axios.post(`${API_BASE_URL}/admin/change-password`, {
                username,
                oldPassword: currentPassword,
                newPassword
            }, config);
            if (res.data.success) {
                setMessage({ text: 'Password changed successfully! Please login again.', type: 'success' });
                setTimeout(() => {
                    localStorage.removeItem('adminLoggedIn');
                    localStorage.removeItem('adminUsername');
                    localStorage.removeItem('adminToken');
                    onLogout();
                }, 2000);
            }
        } catch (err) {
            setMessage({ text: err.response?.data?.error || 'Failed to change password', type: 'error' });
        }
        setLoading(false);
    };

    return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '20px', color: '#1a1a2e' }}>👤 Admin Profile Settings</h2>

            {message.text && (
                <div style={{
                    padding: '12px',
                    marginBottom: '20px',
                    borderRadius: '8px',
                    background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: message.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ marginBottom: '25px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>Current Account Info</h3>
                <p><strong>Username:</strong> {username}</p>
            </div>

            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a1a2e' }}>Change Username</h3>
                <form onSubmit={handleUpdateUsername} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                        required
                    />
                    <input
                        type="text"
                        placeholder="New Username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        {loading ? 'Updating...' : 'Update Username'}
                    </button>
                </form>
            </div>

            <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a1a2e' }}>Change Password</h3>
                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Main Admin Page Component
const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [adminUsername, setAdminUsername] = useState('');
    const [stats, setStats] = useState({ total: 0, last24Hours: 0 });
    const [groupedClicks, setGroupedClicks] = useState({});
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {
        const loggedIn = localStorage.getItem('adminLoggedIn');
        const username = localStorage.getItem('adminUsername');
        if (loggedIn) {
            setIsLoggedIn(true);
            setAdminUsername(username || 'admin');
        }
        setLoading(false);
    }, []);

    const handleLogin = (username) => {
        setIsLoggedIn(true);
        setAdminUsername(username);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
    };

    useEffect(() => {
        if (isLoggedIn && activeTab === 'dashboard') {
            fetchStats();
            fetchAllClicks();
        }
    }, [isLoggedIn, activeTab]);

    const fetchStats = async () => {
        try {
            const config = getAuthConfig();
            const res = await axios.get(`${API_BASE_URL}/clicks/stats`, config);
            if (res.data.success) {
                setStats({
                    total: res.data.stats.total || 0,
                    last24Hours: res.data.stats.today || 0
                });
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const fetchAllClicks = async () => {
        try {
            const config = getAuthConfig();
            const res = await axios.get(`${API_BASE_URL}/clicks`, config);
            if (res.data.success) {
                const clicks = res.data.clicks;
                console.log('Clicks received:', clicks);

                const grouped = {};
                clicks.forEach(click => {
                    const title = click.link_title || 'Unknown';
                    if (!grouped[title]) {
                        grouped[title] = [];
                    }
                    grouped[title].push(click);
                });
                setGroupedClicks(grouped);

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

    const totalUniqueLinks = Object.keys(groupedClicks).length;

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    if (!isLoggedIn) {
        return <AdminLogin onLogin={handleLogin} />;
    }

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
                            borderLeft: activeTab === 'socialLinks' ? '3px solid #FFD700' : '3px solid transparent'
                        }}
                    >
                        🔗 Social Links
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            background: activeTab === 'profile' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                            border: 'none',
                            color: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '15px',
                            borderLeft: activeTab === 'profile' ? '3px solid #FFD700' : '3px solid transparent'
                        }}
                    >
                        👤 Admin Profile
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
                                textAlign: 'center',
                                color: 'white',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📈</div>
                                <h3 style={{ marginBottom: '10px', opacity: 0.9 }}>Total Clicks</h3>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{stats.total || 0}</p>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                padding: '25px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                color: 'white',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔗</div>
                                <h3 style={{ marginBottom: '10px', opacity: 0.9 }}>Unique Links</h3>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{totalUniqueLinks || 0}</p>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                padding: '25px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                color: 'white',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⏰</div>
                                <h3 style={{ marginBottom: '10px', opacity: 0.9 }}>Last 24 Hours</h3>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{stats.last24Hours || 0}</p>
                            </div>
                        </div>

                        {/* All Clicks Grouped by Link Title */}
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                        }}>
                            <h3 style={{ marginBottom: '20px', color: '#1a1a2e' }}>
                                📋 All Clickable Links ({totalUniqueLinks} unique links, {stats.total} total clicks)
                                <span style={{ fontSize: '12px', color: '#666', marginLeft: '15px' }}>Click on any category to expand/collapse</span>
                            </h3>

                            {Object.keys(groupedClicks).length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No clicks recorded yet. Click around your website to see data.</p>
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
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#e9ecef'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = '#f8f9fa'; }}
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
                {activeTab === 'socialLinks' && <AdminSocialLinks />}
                {activeTab === 'profile' && <ProfileSettings username={adminUsername} onLogout={handleLogout} />}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        padding: '20px'
    },
    card: {
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    },
    iconContainer: {
        width: '70px',
        height: '70px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px'
    },
    icon: {
        fontSize: '35px'
    },
    title: {
        color: 'white',
        marginBottom: '10px',
        fontSize: '28px'
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        marginBottom: '30px',
        fontSize: '14px'
    },
    input: {
        width: '100%',
        padding: '14px',
        marginBottom: '15px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        fontSize: '16px',
        outline: 'none',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        marginTop: '10px'
    },
    error: {
        color: '#ff6b6b',
        marginBottom: '15px',
        padding: '10px',
        background: 'rgba(255,107,107,0.1)',
        borderRadius: '8px',
        fontSize: '14px',
        textAlign: 'center'
    }
};

export default AdminPage;