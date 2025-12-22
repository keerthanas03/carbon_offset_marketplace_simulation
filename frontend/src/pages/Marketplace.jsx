import React, { useEffect, useState } from 'react';
import { getOffsetProjects } from '../services/api';
import {
    IoGlobeOutline,
    IoLeafOutline,
    IoFlashOutline,
    IoWaterOutline,
    IoSunnyOutline,
    IoPeopleOutline,
    IoMapOutline,
    IoTrendingUpOutline,
    IoCheckmarkCircle,
    IoWalletOutline,
    IoCloseOutline,
    IoArrowForwardOutline,
    IoStarOutline,
    IoSparklesOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const Marketplace = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);
    const [fundAmount, setFundAmount] = useState('');
    const [isFunding, setIsFunding] = useState(false);
    const [fundingSuccess, setFundingSuccess] = useState(false);
    const [recommendedProject, setRecommendedProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await getOffsetProjects();
            setProjects(response.data);

            // Recommendation Logic: lowest price, then highest credits needed (available)
            if (response.data && response.data.length > 0) {
                const recommended = response.data.reduce((min, p) => {
                    if (!min) return p;
                    if (p.price_per_credit < min.price_per_credit) return p;
                    if (p.price_per_credit === min.price_per_credit && p.credits_needed > min.credits_needed) return p;
                    return min;
                }, null);
                setRecommendedProject(recommended);
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || p.project_type.includes(filterType);
        return matchesSearch && matchesFilter;
    });

    const handleFundClick = (project) => {
        setSelectedProject(project);
        setFundAmount('');
        setFundingSuccess(false);
    };

    const handleConfirmFund = () => {
        setIsFunding(true);
        // Simulate API call
        setTimeout(() => {
            setIsFunding(false);
            setFundingSuccess(true);
            setTimeout(() => {
                setSelectedProject(null);
                setFundingSuccess(false);
            }, 2000);
        }, 1500);
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading marketplace data...</div>;

    // Helper to format large numbers
    const formatMetric = (num) => {
        if (!num) return '0';
        if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
        return num.toLocaleString();
    };

    // Helper to get Project Icon
    const getProjectIcon = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('solar')) return <IoSunnyOutline />;
        if (t.includes('wind') || t.includes('energy')) return <IoFlashOutline />;
        if (t.includes('water') || t.includes('ocean')) return <IoWaterOutline />;
        return <IoLeafOutline />;
    };

    // Card Colors Configuration
    const cardColors = [
        { border: '#3b82f6', badge: '#dbeafe', badgeText: '#1e40af' }, // Blue
        { border: '#ef4444', badge: '#fee2e2', badgeText: '#991b1b' }, // Red
        { border: '#10b981', badge: '#d1fae5', badgeText: '#065f46' }, // Green
        { border: '#f59e0b', badge: '#fef3c7', badgeText: '#92400e' }, // Amber
        { border: '#8b5cf6', badge: '#ede9fe', badgeText: '#5b21b6' }, // Purple
    ];

    const projectTypes = ['All', 'Solar', 'Wind', 'Forest', 'Conservation', 'Nuclear'];

    return (
        <div className="section-reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>EcoRoute Marketplace</h1>
                    <p style={{ color: '#64748b' }}>Discover and invest in verified global offset projects.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Search country or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0',
                            outline: 'none', background: 'white', width: '250px', fontSize: '0.9rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{
                            padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0',
                            outline: 'none', background: 'white', fontSize: '0.9rem', cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                    >
                        {projectTypes.map(t => <option key={t} value={t}>{t} Projects</option>)}
                    </select>
                </div>
            </div>

            {/* Recommended Project Section */}
            {recommendedProject && (
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.5rem', background: '#fef3c7', color: '#d97706', borderRadius: '10px', display: 'flex' }}>
                            <IoSparklesOutline size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Recommended Offset Project</h2>
                    </div>

                    <div className="glass-card" style={{
                        padding: '2rem',
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto',
                        gap: '2rem',
                        alignItems: 'center',
                        borderLeft: '8px solid #f59e0b',
                        background: 'linear-gradient(to right, #fffbeb, #ffffff)',
                        '--card-color': '#f59e0b',
                        '--card-shadow': '#f59e0b20'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {recommendedProject.code && (
                                <img
                                    src={`https://flagcdn.com/w80/${recommendedProject.code.toLowerCase()}.png`}
                                    width="60"
                                    alt={recommendedProject.country}
                                    style={{ borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                                />
                            )}
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>{recommendedProject.country}</h3>
                                <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem', fontWeight: '600' }}>{recommendedProject.project_type}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '3rem' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Price per Credit</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#d97706' }}>${recommendedProject.price_per_credit?.toFixed(2)}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Credits Available</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669' }}>{formatMetric(recommendedProject.credits_needed)}</div>
                            </div>
                            <div style={{ maxWidth: '250px' }}>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e', fontStyle: 'italic' }}>
                                    "This project is recommended based on cost-effectiveness and availability."
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleFundClick(recommendedProject)}
                            className="btn btn-primary"
                            style={{
                                padding: '1rem 2rem',
                                background: '#f59e0b',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)'
                            }}
                        >
                            <IoStarOutline /> Invest Now
                        </button>
                    </div>
                </div>
            )}

            <div className="marketplace-grid section-reveal delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {filteredProjects.map((project, index) => {
                    const colors = cardColors[index % cardColors.length];
                    const isCompleted = project.status === 'Completed';

                    return (
                        <div key={project.id} className="glass-card" style={{
                            padding: '0',
                            borderTop: `4px solid ${colors.border}`,
                            position: 'relative',
                            overflow: 'hidden',
                            '--card-color': colors.border,
                            '--card-shadow': `${colors.border}40` // 25% opacity hex
                        }}>
                            {/* Card Header */}
                            <div style={{ padding: '2rem 2rem 1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {project.code && (
                                            <img
                                                src={`https://flagcdn.com/w40/${project.code.toLowerCase()}.png`}
                                                srcSet={`https://flagcdn.com/w80/${project.code.toLowerCase()}.png 2x`}
                                                width="32"
                                                alt={project.country}
                                                style={{ borderRadius: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                                            />
                                        )}
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{project.country}</h3>
                                    </div>
                                    <span style={{
                                        background: isCompleted ? '#dbeafe' : (project.status === 'Pending' ? '#fef3c7' : '#d1fae5'),
                                        color: isCompleted ? '#1e40af' : (project.status === 'Pending' ? '#92400e' : '#065f46'),
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        display: 'flex', alignItems: 'center', gap: '0.25rem'
                                    }}>
                                        {isCompleted ? '• Completed' : (project.status === 'Pending' ? '• Pending' : '• Active')}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                    <IoGlobeOutline /> {project.code} • {project.year}
                                </div>

                                {/* Project Pill */}
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '50px',
                                    fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '2rem'
                                }}>
                                    {getProjectIcon(project.project_type)} {project.project_type}
                                </div>

                                {/* Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

                                    {/* Emissions - Red */}
                                    <div style={{ background: '#fff1f2', padding: '1rem', borderRadius: '12px', border: '1px solid #ffe4e6' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#881337', marginBottom: '0.25rem' }}>CO2 Emissions</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#e11d48' }}>{formatMetric(project.co2_emission)}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#9f1239' }}>metric tons</div>
                                    </div>

                                    {/* Credits Needed - Green */}
                                    <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#064e3b', marginBottom: '0.25rem' }}>Credits Needed</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>{formatMetric(project.credits_needed)}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#065f46' }}>carbon credits</div>
                                    </div>

                                    {/* Price - Purple */}
                                    <div style={{ background: '#f5f3ff', padding: '1rem', borderRadius: '12px', border: '1px solid #ede9fe' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#4c1d95', marginBottom: '0.25rem' }}>$ Price/Credit</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#7c3aed' }}>${project.price_per_credit?.toFixed(2)}</div>
                                    </div>

                                    {/* Cost - Blue */}
                                    <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#1e3a8a', marginBottom: '0.25rem' }}>↗ Offset Cost</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#2563eb' }}>${formatMetric(project.offset_cost)}</div>
                                    </div>

                                </div>
                            </div>

                            {/* Action Button */}
                            <div style={{ padding: '0 2rem 2rem' }}>
                                <button
                                    onClick={() => handleFundClick(project)}
                                    className="fund-button"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: `linear-gradient(135deg, ${colors.border}, ${colors.border}dd)`,
                                        color: 'white',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        transition: 'all 0.3s ease',
                                        boxShadow: `0 10px 15px -3px ${colors.border}40`
                                    }}
                                >
                                    <IoWalletOutline size={20} />
                                    Provide Fund
                                    <IoArrowForwardOutline className="arrow-icon" style={{ marginLeft: 'auto' }} />
                                </button>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Funding Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, padding: '1rem'
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{
                                background: 'white', borderRadius: '24px', width: '100%', maxWidth: '450px',
                                overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                            }}
                        >
                            <div style={{ padding: '2rem', position: 'relative' }}>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    style={{
                                        position: 'absolute', top: '1.5rem', right: '1.5rem',
                                        background: '#f1f5f9', border: 'none', borderRadius: '50%',
                                        width: '32px', height: '32px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <IoCloseOutline size={20} />
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        padding: '0.75rem', background: '#ecfdf5', borderRadius: '12px',
                                        color: '#059669', display: 'flex'
                                    }}>
                                        <IoWalletOutline size={24} />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>Provide Funding</h2>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>{selectedProject.country} • {selectedProject.project_type}</p>
                                    </div>
                                </div>

                                {fundingSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ textAlign: 'center', padding: '2rem 0' }}
                                    >
                                        <div style={{
                                            width: '64px', height: '64px', background: '#d1fae5',
                                            borderRadius: '50%', color: '#059669', margin: '0 auto 1.5rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <IoCheckmarkCircle size={40} />
                                        </div>
                                        <h3 style={{ marginBottom: '0.5rem' }}>Transaction Successful!</h3>
                                        <p style={{ color: '#64748b' }}>Thank you for contributing to a greener future.</p>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Price per Credit</span>
                                                <span style={{ fontWeight: '700' }}>${selectedProject.price_per_credit?.toFixed(2)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Remaining Offset Need</span>
                                                <span style={{ fontWeight: '700', color: '#059669' }}>{formatMetric(selectedProject.credits_needed)} credits</span>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '2rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.9rem' }}>
                                                Amount to Fund (USD)
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: '#64748b' }}>$</span>
                                                <input
                                                    type="number"
                                                    value={fundAmount}
                                                    onChange={(e) => setFundAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    style={{
                                                        width: '100%', padding: '1rem 1rem 1rem 2rem', borderRadius: '12px',
                                                        border: '2px solid #e2e8f0', outline: 'none', fontSize: '1.1rem',
                                                        fontWeight: '700', transition: 'border-color 0.2s'
                                                    }}
                                                    autoFocus
                                                />
                                            </div>
                                            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                                Est. {fundAmount ? (parseFloat(fundAmount) / (selectedProject.price_per_credit || 1)).toFixed(2) : 0} credits will be offset.
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleConfirmFund}
                                            disabled={!fundAmount || isFunding}
                                            style={{
                                                width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
                                                background: '#10b981', color: 'white', fontWeight: '800',
                                                fontSize: '1rem', cursor: (fundAmount && !isFunding) ? 'pointer' : 'not-allowed',
                                                opacity: (fundAmount && !isFunding) ? 1 : 0.7,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
                                            }}
                                        >
                                            {isFunding ? 'Processing...' : 'Confirm Funding'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Marketplace;
