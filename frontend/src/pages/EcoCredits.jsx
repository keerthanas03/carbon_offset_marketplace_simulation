import React, { useState, useEffect } from 'react';
import { ecoService } from '../services/ecoService';
import {
    IoLeaf, IoWalk, IoFlash, IoFastFood, IoTrash, IoSnow,
    IoWallet, IoTrophy, IoPulse, IoTrendingUp, IoCheckmarkCircle
} from 'react-icons/io5';

const EcoCredits = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            const data = await ecoService.getUserStats();
            setUserStats(data);
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const TabButton = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === id ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                color: activeTab === id ? 'white' : '#64748b',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === id ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none'
            }}
        >
            <Icon size={20} />
            {label}
        </button>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 20px' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 className="text-gradient eco-title" style={{ fontWeight: '850', marginBottom: '10px' }}>
                    EcoCredit AI
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
                    Your personal AI-powered carbon credit bank.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="glass eco-tabs-nav" style={{
                display: 'flex',
                gap: '10px',
                padding: '10px',
                borderRadius: '16px',
                marginBottom: '2rem',
                justifyContent: 'center',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch'
            }}>
                <TabButton id="dashboard" icon={IoPulse} label="Dashboard" />
                <TabButton id="calculator" icon={IoLeaf} label="Calculator" />
                <TabButton id="coach" icon={IoSnow} label="Green Coach" />
                <TabButton id="wallet" icon={IoWallet} label="Wallet" />
                <TabButton id="invest" icon={IoTrendingUp} label="Auto Invest" />
            </div>

            {/* Content Area */}
            <div style={{ minHeight: '600px' }}>
                {activeTab === 'dashboard' && <DashboardView userStats={userStats} />}
                {activeTab === 'calculator' && <CalculatorView onCalculated={fetchUserStats} />}
                {activeTab === 'coach' && <CoachView onActionConfirmed={fetchUserStats} />}
                {activeTab === 'wallet' && <WalletView userStats={userStats} />}
                {activeTab === 'invest' && <InvestView userStats={userStats} />}
            </div>
        </div>
    );
};

// --- Sub-views ---

const DashboardView = ({ userStats }) => {
    if (!userStats) return <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading dashboard data...</div>;

    const badgeColors = {
        'Bronze': '#cd7f32',
        'Silver': '#c0c0c0',
        'Gold': '#ffd700',
        'Platinum': '#e5e4e2'
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="hero-stat-card" style={{ '--card-color': '#059669', '--card-shadow': 'rgba(5, 150, 105, 0.2)' }}>
                <div className="stat-label">Carbon Score</div>
                <div className="stat-number">{userStats.carbon_score}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Efficiency Rating / 100</div>
            </div>

            <div className="hero-stat-card" style={{ '--card-color': '#2563eb', '--card-shadow': 'rgba(37, 99, 235, 0.2)' }}>
                <div className="stat-label">Eco Credits Balance</div>
                <div className="stat-number">{userStats.eco_credits}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Spendable on Offsets</div>
            </div>

            <div className="hero-stat-card" style={{ '--card-color': badgeColors[userStats.badge], '--card-shadow': 'rgba(0,0,0,0.1)' }}>
                <div className="stat-label">Member Tier</div>
                <div className="stat-number" style={{ fontSize: '2.5rem' }}>
                    <IoTrophy style={{ display: 'block', margin: '0 auto 10px', fontSize: '3rem' }} />
                    {userStats.badge}
                </div>
            </div>
        </div>
    );
};

const CalculatorView = ({ onCalculated }) => {
    const [formData, setFormData] = useState({
        travel: 5,
        electricity: 10,
        diet: 'non-veg',
        plastic: 'medium',
        ac: 4
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await ecoService.calculateFootprint(formData);
            setResult(data);
            onCalculated();
        } catch (err) {
            alert("Calculation failed. Please ensure your Gemini API key is active on the backend.");
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '850px', margin: '0 auto' }} className="section-reveal">
            <div className="glass-card" style={{ padding: '3rem' }}>
                <h2 style={{ marginBottom: '2.5rem', textAlign: 'center', fontSize: '2.5rem' }}>AI Carbon Analysis</h2>
                <form onSubmit={handleSubmit} style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Daily Travel (km)</label>
                        <input
                            type="number"
                            style={inputStyle}
                            value={formData.travel}
                            onChange={(e) => setFormData({ ...formData, travel: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Electricity (kWh)</label>
                        <input
                            type="number"
                            style={inputStyle}
                            value={formData.electricity}
                            onChange={(e) => setFormData({ ...formData, electricity: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Diet Habits</label>
                        <select
                            style={inputStyle}
                            value={formData.diet}
                            onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                        >
                            <option value="veg">Vegetarian</option>
                            <option value="non-veg">Non-Vegetarian</option>
                            <option value="vegan">Vegan</option>
                            <option value="pescatarian">Pescatarian</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Plastic Waste</label>
                        <select
                            style={inputStyle}
                            value={formData.plastic}
                            onChange={(e) => setFormData({ ...formData, plastic: e.target.value })}
                        >
                            <option value="low">Minimal (Zero Waste)</option>
                            <option value="medium">Standard (Grocery bags, etc)</option>
                            <option value="high">High (Takeout, Single-use)</option>
                        </select>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>AC/Heating (hours/day)</label>
                        <input
                            type="number"
                            style={inputStyle}
                            value={formData.ac}
                            onChange={(e) => setFormData({ ...formData, ac: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ gridColumn: 'span 2', padding: '1.25rem', fontSize: '1.1rem', marginTop: '1rem' }}
                    >
                        {loading ? 'AI Engine Processing...' : 'Generate Impact Report'}
                    </button>
                </form>

                {result && (
                    <div className="section-reveal" style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-main)', borderRadius: '24px', border: '1px solid var(--primary-light)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="stat-icon"><IoPulse /></div>
                            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Analysis Insights</h3>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem' }}>
                            Score: {result.carbon_score}/100
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem' }}>{result.analysis}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CoachView = ({ onActionConfirmed }) => {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadActions();
    }, []);

    const loadActions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ecoService.getCoachActions();
            setActions(data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to load AI suggestions. Please check your connection.");
        }
        setLoading(false);
    };

    const handleConfirm = async (action) => {
        try {
            await ecoService.confirmAction(action);
            alert(`Great job! Earned ${action.credits} credits!`);
            onActionConfirmed();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>Our AI is looking for ways to improve your score...</p>
                <button onClick={loadActions} disabled={loading} className="btn" style={{ background: '#0f172a', color: 'white', padding: '12px 24px' }}>
                    {loading ? 'AI Engine Thinking...' : 'Refresh AI Tips'}
                </button>
            </div>

            {error && (
                <div className="glass-card section-reveal" style={{ padding: '2rem', border: '1px solid #fee2e2', background: '#fef2f2', color: '#991b1b', maxWidth: '600px', margin: '0 auto 2rem', textAlign: 'center' }}>
                    <h3 style={{ color: '#991b1b', marginBottom: '10px' }}>Connection Issue</h3>
                    <p>{error}</p>
                    <button onClick={loadActions} style={{ marginTop: '1rem', background: '#991b1b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Retry Now</button>
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#b91c1c' }}>Tip: Ensure you have run the SQL schema in your Supabase Editor.</div>
                </div>
            )}

            {!loading && !error && actions.length === 0 && (
                <div style={{ textAlign: 'center', color: '#64748b' }}>No actions found. Try refreshing.</div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {actions.map((act, i) => (
                    <div key={i} className="glass card-hover" style={{ padding: '25px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '99px', display: 'inline-block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>
                                +{act.credits} Credits
                            </div>
                            <h3 style={{ marginBottom: '10px', color: '#1e293b' }}>{act.action}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '15px' }}>{act.motivation}</p>
                            <div style={{ color: '#059669', fontWeight: 'bold' }}>Saves approx {act.carbon_saved} kg CO2</div>
                        </div>
                        <button
                            onClick={() => handleConfirm(act)}
                            style={{
                                marginTop: '20px',
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '12px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <IoCheckmarkCircle /> Confirm Done
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WalletView = ({ userStats }) => {
    if (!userStats) return null;
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
                <IoWallet size={80} style={{ color: '#10b981', marginBottom: '20px' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Green Wallet</h2>
                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1e293b' }}>{userStats.eco_credits}</div>
                <p style={{ color: '#64748b' }}>Current Balance in Eco Credits</p>

                <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.5)', padding: '20px', borderRadius: '20px' }}>
                        <h4 style={{ color: '#64748b' }}>Badge Level</h4>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#10b981' }}>{userStats.badge}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.5)', padding: '20px', borderRadius: '20px' }}>
                        <h4 style={{ color: '#64748b' }}>Next Milestone</h4>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#64748b' }}>
                            {userStats.badge === 'Bronze' ? '101 credits for Silver' :
                                userStats.badge === 'Silver' ? '301 credits for Gold' :
                                    userStats.badge === 'Gold' ? '701 credits for Platinum' : 'Top Level!'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InvestView = ({ userStats }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadInvest();
    }, []);

    const loadInvest = async () => {
        setLoading(true);
        try {
            const data = await ecoService.getAutoInvest();
            setRecommendations(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ color: '#1e293b' }}>AI Project Recommendations</h2>
                <p style={{ color: '#64748b' }}>Based on your footprint and credits, AI recommends investing in these projects.</p>
            </div>
            {loading ? <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>AI is analyzing marketplace...</div> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                    {recommendations.map((proj, i) => (
                        <div key={i} className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                            <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.9rem' }}>RECOMMENDED</div>
                            <h3 style={{ marginBottom: '15px' }}>{proj.project_type} in {proj.country}</h3>
                            <div className="glass" style={{ padding: '15px', borderRadius: '16px', marginBottom: '20px', background: 'rgba(16, 185, 129, 0.05)' }}>
                                <p style={{ color: '#166534', fontSize: '0.9rem', fontStyle: 'italic' }}>"{proj.reason}"</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.9rem' }}>
                                <span>Credits Needed: <strong>{proj.credits_needed}</strong></span>
                                <span>Cost: <strong>${proj.price_per_credit}/unit</strong></span>
                            </div>
                            <button className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '12px', background: '#0f172a' }}>
                                Invest Now
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: 'white'
};

export default EcoCredits;
