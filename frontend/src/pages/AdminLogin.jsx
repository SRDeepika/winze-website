import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Set your admin password here
    const ADMIN_PASSWORD = 'Winzebglr'; 

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simple password check
        if (password === ADMIN_PASSWORD) {
            // Store login state
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminLoginTime', new Date().toISOString());
            navigate('/admin');
        } else {
            setError('Invalid password. Please try again.');
            setPassword('');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            padding: '20px'
        }}>
            <div style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '40px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 25px 45px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 15px'
                    }}>
                        <span style={{ fontSize: '30px' }}>🔐</span>
                    </div>
                    <h2 style={{ color: 'white', marginBottom: '10px' }}>Admin Login</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Enter password to access dashboard</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px',
                            marginBottom: '15px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            fontSize: '16px',
                            outline: 'none'
                        }}
                        autoFocus
                    />

                    {error && (
                        <div style={{
                            color: '#ff6b6b',
                            marginBottom: '15px',
                            padding: '10px',
                            background: 'rgba(255,107,107,0.1)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
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
                            opacity: loading ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.target.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        {loading ? 'Checking...' : 'Login to Dashboard'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                        Default password: <span style={{ color: '#FFD700' }}>admin123</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;