import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Header = () => {
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem('adminAuthenticated');

    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        navigate('/admin-login');
    };

    return (
        <header style={styles.header}>
            <div style={styles.logo}>🎯 ClickTracker Admin</div>
            <nav style={styles.nav}>
                {/* REMOVED "Home" link - only Admin Panel and Logout remain */}
                <Link to="/admin" style={styles.link}>📊 Dashboard</Link>
                {isAdmin && (
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        🚪 Logout
                    </button>
                )}
            </nav>
        </header>
    );
};

const styles = {
    header: {
        background: '#2c3e50',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
    },
    logo: {
        fontSize: '20px',
        fontWeight: 'bold'
    },
    nav: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        padding: '8px 15px',
        borderRadius: '5px',
        transition: 'background 0.3s'
    },
    logoutBtn: {
        background: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background 0.3s'
    }
};

export default Header;