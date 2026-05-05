import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WinzePage from './pages/WinzePage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<WinzePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>
        </Router>
    );
}

export default App;