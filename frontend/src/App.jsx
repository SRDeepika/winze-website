import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WinzePage from './pages/WinzePage';
import AdminPage from './pages/AdminPage';


function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <Routes>
                <Route path="/" element={<WinzePage />} />
                <Route path="/admin" element={<AdminPage />} />
                
            </Routes>
        </Router>
    );
}

export default App;