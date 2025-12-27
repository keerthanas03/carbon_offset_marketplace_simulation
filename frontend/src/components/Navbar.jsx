import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoLeafOutline, IoHomeOutline, IoBarChartOutline, IoStorefrontOutline, IoCloudUploadOutline, IoSparklesOutline, IoCalculatorOutline } from 'react-icons/io5';
import ImportModal from './ImportModal';

const Navbar = () => {
    const location = useLocation();
    const [isImportOpen, setIsImportOpen] = useState(false);

    return (
        <>
            <nav className="navbar glass">
                <Link to="/" className="text-gradient logo">
                    <IoLeafOutline size={30} />
                    <span>EcoRoute</span>
                </Link>

                <div className="nav-links-container nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        <IoHomeOutline /> <span>Home</span>
                    </Link>
                    <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        <IoBarChartOutline /> <span>Stats</span>
                    </Link>
                    <Link to="/marketplace" className={`nav-link ${location.pathname === '/marketplace' ? 'active' : ''}`}>
                        <IoStorefrontOutline /> <span>Market</span>
                    </Link>
                    <Link to="/calculator" className={`nav-link ${location.pathname === '/calculator' ? 'active' : ''}`}>
                        <IoCalculatorOutline /> <span>Calculator</span>
                    </Link>
                    <Link to="/eco-credits" className={`nav-link ${location.pathname === '/eco-credits' ? 'active' : ''}`}>
                        <IoLeafOutline /> <span>EcoCredits</span>
                    </Link>
                    <Link to="/fun-zone" className={`nav-link ${location.pathname === '/fun-zone' ? 'active' : ''}`}>
                        <IoSparklesOutline /> <span>Playground</span>
                    </Link>
                </div>

                <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => setIsImportOpen(true)} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                        <IoCloudUploadOutline /> <span>Import</span>
                    </button>
                </div>
            </nav>
            <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
        </>
    );
};

export default Navbar;
