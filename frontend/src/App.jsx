import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';

import FunZone from './pages/FunZone';
import Calculator from './pages/Calculator';
import EcoCredits from './pages/EcoCredits';
import ChatAssistant from './components/ChatAssistant';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/fun-zone" element={<FunZone />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/eco-credits" element={<EcoCredits />} />
          </Routes>
        </div>
        <ChatAssistant />
      </div>
    </Router>
  );
}

export default App;
