import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '../services/api';
import ImportModal from '../components/ImportModal';
import {
    IoAnalytics,
    IoLeafOutline,
    IoGlobeOutline,
    IoBarChartOutline,
    IoTrendingUpOutline,
    IoWalletOutline,
    IoDocumentTextOutline,
    IoBusinessOutline,
    IoFlashOutline
} from 'react-icons/io5';

const Home = () => {
    const [stats, setStats] = useState(null);
    const [isImportOpen, setIsImportOpen] = useState(false);

    useEffect(() => {
        getDashboardSummary().then(res => setStats(res.data)).catch(() => { });
    }, []);

    // Helper items for the Grid
    const features = [
        {
            icon: <IoTrendingUpOutline size={28} color="white" />,
            bg: '#f43f5e', // Rose
            title: 'Emissions Tracking',
            desc: 'Monitor by country, year, and sector'
        },
        {
            icon: <IoLeafOutline size={28} color="white" />,
            bg: '#10b981', // Emerald
            title: 'Offset Analysis',
            desc: 'Project types and availability'
        },
        {
            icon: <IoBusinessOutline size={28} color="white" />,
            bg: '#f97316', // Orange
            title: 'Cost Analytics',
            desc: 'Pricing trends and projections'
        },
        {
            icon: <IoDocumentTextOutline size={28} color="white" />,
            bg: '#3b82f6', // Blue
            title: 'Data Export',
            desc: 'CSV export for Tableau & Excel'
        }
    ];

    const infoCards = [
        {
            icon: <IoBusinessOutline size={28} color="white" />,
            bg: '#f97316',
            title: 'Carbon Emissions',
            desc: 'Carbon emissions refer to the release of carbon dioxide (CO2) and other greenhouse gases into the atmosphere.',
            list: []
        },
        {
            icon: <IoTrendingUpOutline size={28} color="white" />,
            bg: '#10b981',
            title: 'Carbon Offsets',
            desc: 'Carbon offsets are credits representing a reduction in greenhouse gas emissions. One credit equals one metric ton of CO2 reduced.',
            list: [
                'Reforestation & forest conservation',
                'Renewable energy projects',
                'Carbon capture technology',
                'Methane capture from landfills'
            ]
        },
        {
            icon: <IoGlobeOutline size={28} color="white" />,
            bg: '#6366f1',
            title: 'Our Marketplace',
            desc: 'This platform provides comprehensive data analytics for understanding global carbon emissions and offset opportunities.',
            list: [
                'Tracking emissions by country & sector',
                'Analyzing offset project availability',
                'Understanding pricing and costs',
                'Exporting data for detailed analysis'
            ]
        }
    ];

    return (
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0f172a' }}>

            {/* Hero Section */}
            <div className="section-reveal" style={{ textAlign: 'center', padding: '6rem 1rem', background: 'radial-gradient(circle at center, rgba(20, 184, 166, 0.05) 0%, transparent 60%)' }}>

                {/* Tagline Pill */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: '#e2e8f0', padding: '0.5rem 1.25rem', borderRadius: '50px',
                    fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '2rem'
                }}>
                    <IoFlashOutline /> Environmental Data Analytics Platform
                </div>

                {/* Main Logo Box */}
                <div style={{
                    width: '100px', height: '100px', background: '#10b981', borderRadius: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
                    boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.2)'
                }}>
                    <IoLeafOutline size={50} color="white" />
                </div>

                {/* Main Title */}
                <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '4rem' }}>
                    EcoRoute <br />
                    <span style={{ color: '#14b8a6' }}>Marketplace</span>
                </h1>

                {/* Stats Row */}
                <div className="section-reveal delay-1" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>

                    <div className="hero-stat-card" style={{ flex: 1, minWidth: '220px', '--card-color': '#10b981', '--card-shadow': 'rgba(16, 185, 129, 0.25)' }}>
                        <div className="stat-number">195+</div>
                        <div className="stat-label">Countries</div>
                    </div>

                    <div className="hero-stat-card" style={{ flex: 1, minWidth: '220px', '--card-color': '#3b82f6', '--card-shadow': 'rgba(59, 130, 246, 0.25)' }}>
                        <div className="stat-number">{(stats?.totalEmissions / 1000000).toFixed(0) || '20'}M+</div>
                        <div className="stat-label">Tons CO2 Tracked</div>
                    </div>

                    <div className="hero-stat-card" style={{ flex: 1, minWidth: '220px', '--card-color': '#f59e0b', '--card-shadow': 'rgba(245, 158, 11, 0.25)' }}>
                        <div className="stat-number">6+</div>
                        <div className="stat-label">Project Types</div>
                    </div>

                    <div className="hero-stat-card" style={{ flex: 1, minWidth: '220px', '--card-color': '#8b5cf6', '--card-shadow': 'rgba(139, 92, 246, 0.25)' }}>
                        <div className="stat-number">Real-time</div>
                        <div className="stat-label">Analytics</div>
                    </div>

                </div>
            </div>

            {/* Info Section (Understanding Carbon...) */}
            <div style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Understanding Carbon Emissions & Offsets</h2>
                    <p style={{ maxWidth: '700px', margin: '0 auto', color: '#64748b', fontSize: '1.1rem' }}>
                        Learn how carbon emissions impact our environment and how offset projects help create a sustainable future.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {infoCards.map((card, i) => (
                        <div key={i} className="glass-card" style={{
                            padding: '2.5rem',
                            '--card-color': card.bg,
                            '--card-shadow': `${card.bg}40`
                        }}>
                            <div style={{
                                width: '56px', height: '56px', background: card.bg, borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                                boxShadow: `0 10px 15px -3px ${card.bg}33`
                            }}>
                                {card.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>{card.title}</h3>
                            <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '1.5rem' }}>{card.desc}</p>

                            {card.list.length > 0 && (
                                <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
                                    {card.list.map((item, j) => (
                                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: card.bg }}></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Title */}
            <div style={{ textAlign: 'center', marginTop: '6rem', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Powerful Analytics & Insights</h2>
                <p style={{ maxWidth: '700px', margin: '1rem auto 0', color: '#64748b', fontSize: '1.1rem' }}>
                    Our platform provides enterprise-grade analytics capabilities compatible with tools like Tableau for in-depth environmental data analysis.
                </p>
            </div>

            {/* Features Grid */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {features.map((feature, idx) => (
                    <div key={idx} className="glass-card" style={{
                        padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                        '--card-color': feature.bg,
                        '--card-shadow': `${feature.bg}40`
                    }}>
                        <div style={{
                            width: '48px', height: '48px', background: feature.bg, borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
                        }}>
                            {feature.icon}
                        </div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{feature.title}</h4>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* CTA Banner */}
            <div style={{ maxWidth: '1200px', margin: '6rem auto 4rem', padding: '0 2rem' }}>
                <div style={{
                    background: '#14b8a6', // Teal
                    borderRadius: '24px',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    color: 'white',
                    boxShadow: '0 20px 25px -5px rgba(20, 184, 166, 0.3)'
                }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>Ready to explore the data?</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.1rem', opacity: '0.9' }}>
                        Start analyzing global carbon emissions and discover offset opportunities to make data-driven environmental decisions.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                        <Link to="/dashboard" style={{
                            background: 'white', color: '#0f172a', padding: '1rem 2rem', borderRadius: '8px',
                            fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                            <IoBarChartOutline /> View Analytics
                        </Link>
                        <button onClick={() => setIsImportOpen(true)} style={{
                            background: 'rgba(255,255,255,0.1)', color: 'white', padding: '1rem 2rem', borderRadius: '8px',
                            fontWeight: '600', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'inherit'
                        }}>
                            Import Your Data
                        </button>
                    </div>
                </div>
            </div>

            <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
        </div>
    );
};

export default Home;
