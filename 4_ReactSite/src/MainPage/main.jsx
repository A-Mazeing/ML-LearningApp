import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Select from '../SelectPage/SelectScreen.jsx'; // Importiere die Select-Seite

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} /> {/* Hauptseite */}
                <Route path="/select" element={<Select />} /> {/* Select-Seite */}
            </Routes>
        </Router>
    </StrictMode>
);
