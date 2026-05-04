import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WinzePage from './pages/WinzePage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin'; // Add this
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<WinzePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin-login" element={<AdminLogin />} /> {/* Add this */}
            </Routes>
        </Router>
    );
}

export default App;