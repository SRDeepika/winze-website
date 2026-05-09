import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSocialLinks from './AdminSocialLinks';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://winze-backend-api.onrender.com/api';

// Helper to get auth config
const getAuthConfig = () => {
    const token = sessionStorage.getItem('adminToken');
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
                sessionStorage.clear();
                sessionStorage.setItem('adminToken', res.data.token);
                sessionStorage.setItem('adminUsername', username);
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
                    <input type="text" placeholder="Username" value={username}
                        onChange={(e) => setUsername(e.target.value)} style={styles.input} required />
                    <input type="password" placeholder="Password" value={password}
                        onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
                    {error && <div style={styles.error}>{error}</div>}
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Profile Settings Component - NO PASSWORD LENGTH LIMIT
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
                    sessionStorage.clear();
                    onLogout();
                }, 2000);
            }
        } catch (err) {
            setMessage({ text: err.response?.data?.error || 'Failed to change username', type: 'error' });
            setNewUsername('');
            setCurrentPassword('');
        }
        setLoading(false);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ text: 'New passwords do not match', type: 'error' });
            return;
        }
        // REMOVED: Password length check - admin can use any password now
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
                    sessionStorage.clear();
                    onLogout();
                }, 2000);
            }
        } catch (err) {
            setMessage({ text: err.response?.data?.error || 'Failed to change password', type: 'error' });
            setNewPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
        }
        setLoading(false);
    };

    return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '20px', color: '#1a1a2e' }}>👤 Admin Profile Settings</h2>
            
            {message.text && (
                <div style={{
                    padding: '12px', marginBottom: '20px', borderRadius: '8px',
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

            {/* Change Username Section */}
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

            {/* Change Password Section - NO LENGTH LIMIT */}
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

            {/* Logout Button */}
            <div style={{ marginTop: '30px', textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <button
                    onClick={onLogout}
                    style={{ padding: '12px 30px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    🚪 Logout
                </button>
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
        const token = sessionStorage.getItem('adminToken');
        const username = sessionStorage.getItem('adminUsername');
        if (token && username) {
            setIsLoggedIn(true);
            setAdminUsername(username);
        }
        setLoading(false);
    }, []);

    const handleLogin = (username) => {
        setIsLoggedIn(true);
        setAdminUsername(username);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        setAdminUsername('');
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
            if (err.response?.status === 401) handleLogout();
        }
    };

    const fetchAllClicks = async () => {
        try {
            const config = getAuthConfig();
            const res = await axios.get(`${API_BASE_URL}/clicks`, config);
            if (res.data.success) {
                const clicks = res.data.clicks;
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
            if (err.response?.status === 401) handleLogout();
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
                </nav>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: '260px', flex: 1, padding: '30px', background: '#f5f6fa', minHeight: '100vh' }}>
                {activeTab === 'dashboard' && (
                    <div>
                        <h1 style={{ marginBottom: '10px', color: '#1a1a2e' }}>Click Analytics Dashboard</h1>
                        <p style={{ color: '#666', marginBottom: '30px' }}>Complete click tracking statistics for your website</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '25px', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📈</div>
                                <h3>Total Clicks</h3>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{stats.total}</p>
                            </div>
                            <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '25px', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔗</div>
                                <h3>Unique Links</h3>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{totalUniqueLinks}</p>
                            </div>
                            <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '25px', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⏰</div>
                                <h3>Last 24 Hours</h3>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{stats.last24Hours}</p>
                            </div>
                        </div>

                        <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
                            <h3>📋 All Clicks ({stats.total} total)</h3>
                            {Object.keys(groupedClicks).length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '40px' }}>No clicks recorded yet.</p>
                            ) : (
                                Object.entries(groupedClicks).map(([title, clicks]) => (
                                    <div key={title} style={{ marginBottom: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                                        <div onClick={() => toggleCategory(title)} style={{
                                            padding: '15px', background: '#f8f9fa', cursor: 'pointer',
                                            display: 'flex', justifyContent: 'space-between'
                                        }}>
                                            <strong>{title}</strong>
                                            <span>({clicks.length} clicks) {expandedCategories[title] ? '▼' : '▶'}</span>
                                        </div>
                                        {expandedCategories[title] && (
                                            <div style={{ padding: '15px' }}>
                                                {clicks.map((click, idx) => (
                                                    <div key={click.id} style={{ marginBottom: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                                                        #{idx + 1} - {new Date(click.clicked_at).toLocaleString()} - IP: {click.ip_address || 'unknown'}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
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
    icon: { fontSize: '35px' },
    title: { color: 'white', marginBottom: '10px', fontSize: '28px' },
    subtitle: { color: 'rgba(255,255,255,0.7)', marginBottom: '30px', fontSize: '14px' },
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