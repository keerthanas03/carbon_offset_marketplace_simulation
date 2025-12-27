import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoLeafOutline, IoHomeOutline, IoBarChartOutline, IoStorefrontOutline, IoCloudUploadOutline, IoSparklesOutline, IoCalculatorOutline } from 'react-icons/io5';
import ImportModal from './ImportModal';

const Navbar = () => {
    const location = useLocation();
    const [isImportOpen, setIsImportOpen] = useState(false);

    const navItemStyle = (path) => ({
        padding: '0.6rem 1.25rem',
        borderRadius: '99px',
        fontSize: '0.95rem',
        fontWeight: '600',
        color: location.pathname === path ? 'white' : '#64748b',
        background: location.pathname === path ? '#10b981' : 'transparent',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.2s ease'
    });

    return (
        <>
            <nav className="glass" style={{
                position: 'sticky', top: '1.5rem', left: '0', right: '0',
                maxWidth: '1200px', margin: '0 auto', zIndex: '1000',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1.5rem', borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)'
            }}>
                <Link to="/" className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <IoLeafOutline size={30} />
                    <span>EcoRoute</span>
                </Link>

                <div className="nav-links-container" style={{ display: 'flex', gap: '0.25rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: '99px' }}>
                    <Link to="/" style={navItemStyle('/')}>
                        <IoHomeOutline /> Home
                    </Link>
                    <Link to="/dashboard" style={navItemStyle('/dashboard')}>
                        <IoBarChartOutline /> Stats
                    </Link>
                    <Link to="/marketplace" style={navItemStyle('/marketplace')}>
                        <IoStorefrontOutline /> Market
                    </Link>
                    <Link to="/calculator" style={navItemStyle('/calculator')}>
                        <IoCalculatorOutline /> Calculator
                    </Link>
                    <Link to="/eco-credits" style={navItemStyle('/eco-credits')}>
                        <IoLeafOutline /> EcoCredits
                    </Link>
                    <Link to="/fun-zone" style={navItemStyle('/fun-zone')}>
                        <IoSparklesOutline /> Playground
                    </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => setIsImportOpen(true)} style={{
                        ...navItemStyle('/import'),
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        background: '#0f172a',
                        color: 'white'
                    }}>
                        <IoCloudUploadOutline /> Import
                    </button>
                </div>
            </nav>
            <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
        </>
    );
};

export default Navbar;
