import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WinzePage from './pages/WinzePage';
import AdminPage from './pages/AdminPage';
// Remove this line - no separate login route needed
// import AdminLogin from './pages/AdminLogin';
// Remove Toaster - no popups
// import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            {/* Remove Toaster component */}
            <Routes>
                <Route path="/" element={<WinzePage />} />
                <Route path="/admin" element={<AdminPage />} />
                {/* Remove the /admin-login route */}
            </Routes>
        </Router>
    );
}

export default App;