import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // This will read from .env file
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
    
    // For safety, add a fallback (remove this once .env is set)
    // const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'WinzeAdmin2026';
    
    if (password === ADMIN_PASSWORD) {
        // Login success
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        toast.success('Login successful!');
        navigate('/admin');
    } else {
        toast.error('Invalid password');
        setPassword('');
    }
    setLoading(false);
};

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <div style={styles.logo}>
                    <span style={styles.logoIcon}>🔐</span>
                    <h1 style={styles.title}>Admin Login</h1>
                </div>
                <p style={styles.subtitle}>Enter password to access dashboard</p>
                
                <form onSubmit={handleLogin} style={styles.form}>
                    <input
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        autoFocus
                    />
                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login to Dashboard'}
                    </button>
                </form>
                
                <p style={styles.hint}>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                        Contact administrator if you forgot password
                    </span>
                </p>
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
    },
    loginBox: {
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '10px',
    },
    logoIcon: {
        fontSize: '40px',
    },
    title: {
        fontSize: '28px',
        color: '#333',
        margin: 0,
    },
    subtitle: {
        color: '#666',
        marginBottom: '30px',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    input: {
        padding: '14px',
        fontSize: '16px',
        border: '2px solid #e0e0e0',
        borderRadius: '10px',
        outline: 'none',
        transition: 'border-color 0.3s',
    },
    button: {
        padding: '14px',
        fontSize: '16px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
    hint: {
        marginTop: '20px',
        fontSize: '12px',
        color: '#999',
    },
};

export default AdminLogin;