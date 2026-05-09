import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';  // Use TestPage
import AdminPage from './pages/AdminPage';
// import WinzePage from './pages/WinzePage';  // Comment out

function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <Routes>
                <Route path="/" element={<TestPage />} />  {/* Use TestPage */}
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    );
}

export default App;