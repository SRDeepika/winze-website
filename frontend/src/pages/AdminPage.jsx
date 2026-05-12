import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSocialLinks from './AdminSocialLinks';
import { 
  getAdminBlogs, createBlog, updateBlog, deleteBlog,
  getAdminJobs, createJob, updateJob, deleteJob,
  getApplications, updateApplicationStatus,
  getQuotes, getAdminStats,
  getUsers, createUser, deleteUser, adminLogin
} from '../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://winze-backend-api.onrender.com/api';

const getAuthConfig = () => {
    const token = sessionStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// ============================================
// CAPTCHA GENERATOR
// ============================================
const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
};

// ============================================
// ADMIN LOGIN COMPONENT WITH CAPTCHA
// ============================================
const AdminLogin = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaValue, setCaptchaValue] = useState(generateCaptcha());
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const refreshCaptcha = () => {
        setCaptchaValue(generateCaptcha());
        setCaptchaInput('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (captchaInput !== captchaValue) {
            setError('Invalid CAPTCHA. Please try again.');
            refreshCaptcha();
            setLoading(false);
            return;
        }

        if (username === 'admin' && password === 'admin123') {
            sessionStorage.clear();
            sessionStorage.setItem('adminToken', 'admin-token');
            sessionStorage.setItem('adminUsername', 'admin');
            sessionStorage.setItem('adminRole', 'admin');
            onLogin('admin', 'admin');
        } else {
            setError('Invalid credentials. Please try again.');
            refreshCaptcha();
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
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} required />
                    <div style={{ position: 'relative' }}>
                        <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
                        <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</span>
                    </div>
                    <div style={styles.captchaContainer}>
                        <div style={styles.captchaBox}>
                            <span style={styles.captchaText}>{captchaValue}</span>
                            <button type="button" onClick={refreshCaptcha} style={styles.captchaRefresh}>⟳</button>
                        </div>
                        <input type="text" placeholder="Enter CAPTCHA" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} style={styles.input} required />
                    </div>
                    {error && <div style={styles.error}>{error}</div>}
                    <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Logging in...' : 'Login'}</button>
                </form>
            </div>
        </div>
    );
};

// ============================================
// PROFILE SETTINGS
// ============================================
const ProfileSettings = ({ username, onLogout }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/admin/change-username`, {
                username, newUsername, password: currentPassword
            }, getAuthConfig());
            if (res.data.success) {
                setMessage('Username changed! Please login again.');
                setTimeout(() => { sessionStorage.clear(); onLogout(); }, 2000);
            }
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        try {
            const res = await axios.post(`${API_BASE_URL}/admin/change-password`, {
                username, oldPassword: currentPassword, newPassword
            }, getAuthConfig());
            if (res.data.success) {
                setMessage('Password changed! Please login again.');
                setTimeout(() => { sessionStorage.clear(); onLogout(); }, 2000);
            }
        } catch (err) {
            setMessage(err.response?.data?.error || 'Failed');
        }
    };

    return (
        <div style={styles.dashboardCard}>
            <h2>👤 Profile Settings</h2>
            {message && <div style={styles.successMessage}>{message}</div>}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                <h3>Change Username</h3>
                <form onSubmit={handleUpdateUsername}>
                    <div style={{ position: 'relative' }}>
                        <input type={showCurrent ? "text" : "password"} placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={styles.input} required />
                        <span onClick={() => setShowCurrent(!showCurrent)} style={styles.eyeIcon}>{showCurrent ? '🙈' : '👁️'}</span>
                    </div>
                    <input type="text" placeholder="New Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} style={styles.input} required />
                    <button type="submit" style={styles.saveBtn}>Update Username</button>
                </form>
            </div>
            <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                <h3>Change Password</h3>
                <form onSubmit={handleUpdatePassword}>
                    <div style={{ position: 'relative' }}>
                        <input type={showCurrent ? "text" : "password"} placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={styles.input} required />
                        <span onClick={() => setShowCurrent(!showCurrent)} style={styles.eyeIcon}>{showCurrent ? '🙈' : '👁️'}</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input type={showNew ? "text" : "password"} placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={styles.input} required />
                        <span onClick={() => setShowNew(!showNew)} style={styles.eyeIcon}>{showNew ? '🙈' : '👁️'}</span>
                    </div>
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={styles.input} required />
                    <button type="submit" style={styles.saveBtn}>Update Password</button>
                </form>
            </div>
        </div>
    );
};

// ============================================
// USER MANAGER - FIXED VERSION
// ============================================
const UserManager = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'admin' });

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        const res = await getUsers(token);
        if (res.success) setUsers(res.users);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        await createUser(newUser, token);
        await loadUsers();
        setShowForm(false);
        setNewUser({ username: '', password: '', role: 'admin' });
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Delete this user permanently?')) {
            await deleteUser(id, token);
            await loadUsers();
        }
    };

    return (
        <div style={styles.dashboardCard}>
            <div style={styles.cardHeader}>
                <h2>👥 Admin Management</h2>
                <button onClick={() => setShowForm(true)} style={styles.addButton}>+ Add New Admin</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Username</th>
                            <th style={styles.th}>Role</th>
                            <th style={styles.th}>Created</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td style={styles.td}>{user.username}</td>
                                <td style={styles.td}>
                                    <span style={{...styles.statusBadge, background: user.role === 'admin' ? '#d4edda' : '#ffeaa7'}}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={styles.td}>{new Date(user.created_at).toLocaleDateString()}</td>
                                <td style={styles.td}>
                                    {user.username === 'admin' ? (
                                        <span style={{ color: '#888', fontSize: '12px' }}>Primary Admin</span>
                                    ) : (
                                        <button onClick={() => handleDeleteUser(user.id)} style={styles.deleteBtn}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showForm && (
                <div style={styles.modal} onClick={() => setShowForm(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>Add New Admin</h3>
                        <form onSubmit={handleCreateUser}>
                            <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} style={styles.input} required />
                            <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} style={styles.input} required />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button type="submit" style={styles.saveBtn}>Create Admin</button>
                                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Placeholder components for other managers (BlogManager, JobManager, etc.)
// Add your existing implementations here...

// ============================================
// MAIN ADMIN PAGE
// ============================================
const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [adminUsername, setAdminUsername] = useState('');
    const [adminRole, setAdminRole] = useState('');
    const [stats, setStats] = useState({});
    const [allClicks, setAllClicks] = useState([]);
    const [groupedClicks, setGroupedClicks] = useState({});
    const [expanded, setExpanded] = useState({});
    const [token, setToken] = useState('');

    useEffect(() => {
        const storedToken = sessionStorage.getItem('adminToken');
        const username = sessionStorage.getItem('adminUsername');
        const role = sessionStorage.getItem('adminRole');
        if (storedToken && username) {
            setToken(storedToken);
            setAdminUsername(username);
            setAdminRole(role);
            setIsLoggedIn(true);
        }
        setLoading(false);
    }, []);

    const handleLogin = (username, role) => {
        setAdminUsername(username);
        setAdminRole(role);
        setToken(sessionStorage.getItem('adminToken'));
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
    };

    useEffect(() => {
        if (isLoggedIn) {
            loadStats();
            loadAllClicks();
        }
    }, [isLoggedIn]);

    const loadStats = async () => {
        const res = await getAdminStats(token);
        if (res.success) setStats(res.stats);
    };

    const loadAllClicks = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/clicks`, getAuthConfig());
            if (res.data.success && res.data.clicks) {
                setAllClicks(res.data.clicks);
                const grouped = {};
                res.data.clicks.forEach(click => {
                    const title = click.link_title || 'Unknown';
                    if (!grouped[title]) grouped[title] = [];
                    grouped[title].push(click);
                });
                setGroupedClicks(grouped);
            }
        } catch (err) {
            console.error('Error loading clicks:', err);
        }
    };

    const toggleGroup = (key) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const totalClicks = allClicks.length;
    const uniqueLinks = Object.keys(groupedClicks).length;
    const last24Hours = allClicks.filter(click => {
        const clickDate = new Date(click.clicked_at);
        const now = new Date();
        const diffHours = (now - clickDate) / (1000 * 60 * 60);
        return diffHours <= 24;
    }).length;

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    if (!isLoggedIn) return <AdminLogin onLogin={handleLogin} />;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <h2>⚡ Admin Panel</h2>
                    <p style={{ fontSize: '12px', color: '#aaa' }}>{adminUsername}</p>
                </div>
                <nav>
                    <button onClick={() => setActiveTab('dashboard')} style={{...styles.navBtn, background: activeTab === 'dashboard' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'}}>📊 Dashboard</button>
                    <button onClick={() => setActiveTab('clickAnalytics')} style={{...styles.navBtn, background: activeTab === 'clickAnalytics' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'}}>📈 Click Analytics</button>
                    <button onClick={() => setActiveTab('profile')} style={{...styles.navBtn, background: activeTab === 'profile' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'}}>👤 Profile</button>
                    <button onClick={() => setActiveTab('users')} style={{...styles.navBtn, background: activeTab === 'users' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'}}>👥 Admins</button>
                    <button onClick={handleLogout} style={{...styles.navBtn, marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#ff6b6b'}}>🚪 Logout</button>
                </nav>
            </div>

            <div style={styles.mainContent}>
                {activeTab === 'dashboard' && (
                    <div>
                        <h1 style={{ marginBottom: '20px' }}>Dashboard</h1>
                        <div style={styles.statsGrid}>
                            <div style={styles.statCard}><div>📝</div><h3>{stats.totalBlogs || 0}</h3><p>Total Blogs</p></div>
                            <div style={styles.statCard}><div>✅</div><h3>{stats.publishedBlogs || 0}</h3><p>Published Blogs</p></div>
                            <div style={styles.statCard}><div>💼</div><h3>{stats.totalJobs || 0}</h3><p>Total Jobs</p></div>
                            <div style={styles.statCard}><div>🔴</div><h3>{stats.activeJobs || 0}</h3><p>Active Jobs</p></div>
                            <div style={styles.statCard}><div>📋</div><h3>{stats.totalApplications || 0}</h3><p>Applications</p></div>
                            <div style={styles.statCard}><div>📧</div><h3>{stats.totalQuotes || 0}</h3><p>Quotes</p></div>
                            <div style={styles.statCard}><div>📈</div><h3>{totalClicks}</h3><p>Total Clicks</p></div>
                            <div style={styles.statCard}><div>⏰</div><h3>{last24Hours}</h3><p>Last 24 Hours</p></div>
                            <div style={styles.statCard}><div>🔗</div><h3>{uniqueLinks}</h3><p>Unique Links</p></div>
                        </div>
                    </div>
                )}

                {activeTab === 'clickAnalytics' && (
                    <div style={styles.dashboardCard}>
                        <h2>📈 Click Analytics</h2>
                        <div style={styles.statsGrid}>
                            <div style={styles.statCard}><div>📈</div><h3>{totalClicks}</h3><p>Total Clicks</p></div>
                            <div style={styles.statCard}><div>🔗</div><h3>{uniqueLinks}</h3><p>Unique Links</p></div>
                            <div style={styles.statCard}><div>⏰</div><h3>{last24Hours}</h3><p>Last 24 Hours</p></div>
                        </div>
                        {Object.keys(groupedClicks).length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '40px' }}>No clicks recorded yet.</p>
                        ) : (
                            Object.entries(groupedClicks).map(([title, clicks]) => (
                                <div key={title} style={{ marginBottom: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                                    <div onClick={() => toggleGroup(title)} style={{ padding: '12px 15px', background: '#f8f9fa', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                                        <span>🔗 {title}</span>
                                        <span>({clicks.length} clicks) {expanded[title] ? '▼' : '▶'}</span>
                                    </div>
                                    {expanded[title] && (
                                        <div style={{ padding: '10px' }}>
                                            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr style={{ background: '#f5f5f5' }}>
                                                        <th style={{ padding: '8px', textAlign: 'left' }}>#</th>
                                                        <th style={{ padding: '8px', textAlign: 'left' }}>Date & Time</th>
                                                        <th style={{ padding: '8px', textAlign: 'left' }}>IP Address</th>
                                                        <th style={{ padding: '8px', textAlign: 'left' }}>Page URL</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {clicks.map((click, idx) => (
                                                        <tr key={click.id}>
                                                            <td style={{ padding: '8px' }}>{idx + 1}</td>
                                                            <td style={{ padding: '8px' }}>{new Date(click.clicked_at).toLocaleString()}</td>
                                                            <td style={{ padding: '8px' }}>{click.ip_address || 'unknown'}</td>
                                                            <td style={{ padding: '8px', wordBreak: 'break-all' }}>{click.link_url || click.link_title}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'profile' && <ProfileSettings username={adminUsername} onLogout={handleLogout} />}
                {activeTab === 'users' && <UserManager token={token} />}
            </div>
        </div>
    );
};

// ============================================
// STYLES
// ============================================
const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', padding: '20px' },
    card: { background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '450px', textAlign: 'center' },
    dashboardCard: { background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
    iconContainer: { width: '70px', height: '70px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
    icon: { fontSize: '35px' },
    title: { color: 'white', marginBottom: '10px', fontSize: '28px' },
    subtitle: { color: 'rgba(255,255,255,0.7)', marginBottom: '30px', fontSize: '14px' },
    input: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' },
    select: { padding: '8px', borderRadius: '6px', border: '1px solid #ddd', background: 'white', width: '100%', marginBottom: '10px' },
    button: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
    error: { color: '#ff6b6b', marginBottom: '15px', padding: '10px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px', fontSize: '14px', textAlign: 'center' },
    successMessage: { background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' },
    eyeIcon: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '18px' },
    captchaContainer: { marginBottom: '15px' },
    captchaBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px', padding: '10px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px' },
    captchaText: { fontFamily: 'monospace', fontSize: '24px', fontWeight: 'bold', letterSpacing: '5px', color: '#FFD700', background: '#1a1a2e', padding: '8px 15px', borderRadius: '8px' },
    captchaRefresh: { background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 12px', cursor: 'pointer', fontSize: '16px' },
    sidebar: { width: '260px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', padding: '20px 0', position: 'fixed', height: '100vh', overflowY: 'auto' },
    sidebarHeader: { padding: '0 20px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', textAlign: 'center' },
    navBtn: { width: '100%', padding: '12px 20px', border: 'none', color: 'white', textAlign: 'left', cursor: 'pointer', fontSize: '15px', background: 'transparent' },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px', background: '#f5f6fa', minHeight: '100vh' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' },
    statCard: { background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    addButton: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    refreshBtn: { padding: '10px 20px', background: '#48c774', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    editBtn: { padding: '6px 12px', background: '#4facfe', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
    deleteBtn: { padding: '6px 12px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    viewBtn: { padding: '6px 12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    saveBtn: { padding: '10px 20px', background: '#48c774', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    cancelBtn: { padding: '10px 20px', background: '#ccc', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    closeModalBtn: { marginTop: '15px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' },
    td: { padding: '12px', borderBottom: '1px solid #eee' },
    statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'auto' },
    modalContent: { background: 'white', borderRadius: '15px', padding: '30px', maxWidth: '700px', width: '100%', maxHeight: '85vh', overflow: 'auto' },
};

export default AdminPage;