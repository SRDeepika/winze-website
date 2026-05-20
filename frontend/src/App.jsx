import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WinzePage from './pages/WinzePage';
import AdminPage from './pages/AdminPage';
import JobsPage from './pages/JobsPage';
import BlogsPage from './pages/BlogsPage';  // ← Make sure this import exists

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WinzePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/*" element={<AdminPage />} />
                <Route path="/careers" element={<JobsPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/blogs" element={<BlogsPage />} />     {/* ← ADD THIS LINE */}
                <Route path="/blog/:slug" element={<BlogsPage />} /> {/* ← Optional: for single blog */}
            </Routes>
        </Router>
    );
}

export default App;