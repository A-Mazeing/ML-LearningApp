import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Select from '../SelectPage/SelectScreen.jsx';
import FreeTestSite from "../FreeTestSite/FreeTestSite.jsx";
import AutoTestSite from "../AutoTestSite/AutoTestSite.jsx";


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} /> {/* Hauptseite */}
                <Route path="/select" element={<Select/>} /> {/* Selection-Seite */}
                <Route path="/freeTestSite" element={<FreeTestSite />} />
                <Route path="/autoTestSite" element={<AutoTestSite />} />
            </Routes>
        </Router>
    </StrictMode>
);
