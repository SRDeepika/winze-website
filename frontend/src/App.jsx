import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WinzePage from './pages/WinzePage';
import AdminPage from './pages/AdminPage';
import JobsPage from './pages/JobsPage';  // ← ADD THIS

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WinzePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/*" element={<AdminPage />} />
                <Route path="/careers" element={<JobsPage />} />  {/* ← ADD THIS */}
                <Route path="/jobs" element={<JobsPage />} />     {/* ← ADD THIS (optional) */}
            </Routes>
        </Router>
    );
}

export default App;