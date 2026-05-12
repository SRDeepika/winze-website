import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WinzePage from './pages/WinzePage';
import AdminPage from './pages/AdminPage';  // Correct path

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WinzePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/*" element={<AdminPage />} />
            </Routes>
        </Router>
    );
}

export default App;