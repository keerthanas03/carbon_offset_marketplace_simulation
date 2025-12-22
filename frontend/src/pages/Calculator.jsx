import React, { useState } from 'react';
import {
    IoCalculatorOutline,
    IoFlashOutline,
    IoAirplaneOutline,
    IoAnalyticsOutline,
    IoLeafOutline,
    IoArrowForwardOutline
} from 'react-icons/io5';

const Calculator = () => {
    const [electricity, setElectricity] = useState('');
    const [transport, setTransport] = useState('');
    const [results, setResults] = useState(null);

    const EMISSION_FACTORS = {
        electricity: 0.82, // kg CO2 per kWh
        transport: 0.21,   // kg CO2 per km
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        const elecEmissions = parseFloat(electricity || 0) * EMISSION_FACTORS.electricity;
        const transEmissions = parseFloat(transport || 0) * EMISSION_FACTORS.transport;
        const total = elecEmissions + transEmissions;

        setResults({
            electricity: elecEmissions.toFixed(2),
            transport: transEmissions.toFixed(2),
            total: total.toFixed(2),
            credits: Math.ceil(total) // 1 carbon credit = 1 kg CO₂
        });
    };

    return (
        <div className="section-reveal">
            {/* Header Section */}
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <span style={{
                    background: '#dcfce7', color: '#10b981', padding: '0.5rem 1rem',
                    borderRadius: '50px', fontSize: '0.85rem', fontWeight: '700',
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'
                }}>
                    <IoLeafOutline /> ECO-TOOLS
                </span>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                    Carbon Footprint <span style={{ color: '#10b981' }}>Calculator</span>
                </h1>
                <p style={{ color: '#64748b', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    Measure your environmental impact in seconds. Input your monthly habits to see your CO₂ footprint and learn how to offset it.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto' }}>

                {/* 1. Input Form Section */}
                <div className="glass-card" style={{ padding: '3rem', '--card-color': '#10b981' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem', fontWeight: '800' }}>Usage Data</h3>
                        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Provide your average monthly consumption.</p>
                    </div>

                    <form onSubmit={handleCalculate}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '700', color: '#1e293b' }}>
                                <IoFlashOutline color="#10b981" /> Electricity Consumption (kWh)
                            </label>
                            <input
                                type="number"
                                value={electricity}
                                onChange={(e) => setElectricity(e.target.value)}
                                placeholder="Your monthly kWh..."
                                style={{
                                    width: '100%', padding: '1.25rem', borderRadius: '16px', border: '2px solid #f1f5f9',
                                    outline: 'none', background: '#f8fafc', fontSize: '1.1rem', transition: 'all 0.2s ease',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '700', color: '#1e293b' }}>
                                <IoAirplaneOutline color="#10b981" /> Travel Distance (km)
                            </label>
                            <input
                                type="number"
                                value={transport}
                                onChange={(e) => setTransport(e.target.value)}
                                placeholder="Total km per month..."
                                style={{
                                    width: '100%', padding: '1.25rem', borderRadius: '16px', border: '2px solid #f1f5f9',
                                    outline: 'none', background: '#f8fafc', fontSize: '1.1rem', transition: 'all 0.2s ease',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.4rem', fontSize: '1.1rem', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            Analyze Impact <IoArrowForwardOutline />
                        </button>
                    </form>
                </div>

                {/* 2. Results Visualization Section */}
                <div className="glass-card" style={{
                    padding: '3rem',
                    '--card-color': '#3b82f6',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: results ? 'flex-start' : 'center',
                    minHeight: '450px',
                    position: 'relative'
                }}>
                    {!results ? (
                        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                            <div style={{
                                width: '80px', height: '80px', background: '#f8fafc', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                            }}>
                                <IoAnalyticsOutline size={40} />
                            </div>
                            <h4 style={{ color: '#475569', marginBottom: '0.5rem' }}>Awaiting Data</h4>
                            <p style={{ fontSize: '0.9rem' }}>Fill in the fields to generate your footprint analysis.</p>
                        </div>
                    ) : (
                        <div className="section-reveal">
                            <h3 style={{ margin: '0 0 2rem', fontSize: '1.75rem', fontWeight: '800' }}>Impact Summary</h3>

                            <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                    <span style={{ color: '#64748b', fontWeight: '600' }}>Electricity</span>
                                    <span style={{ fontWeight: '800', color: '#0f172a' }}>{results.electricity} kg CO₂</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                    <span style={{ color: '#64748b', fontWeight: '600' }}>Transport</span>
                                    <span style={{ fontWeight: '800', color: '#0f172a' }}>{results.transport} kg CO₂</span>
                                </div>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '1.75rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    color: 'white', borderRadius: '18px', boxShadow: '0 12px 20px -5px rgba(59, 130, 246, 0.4)'
                                }}>
                                    <span style={{ fontWeight: '600' }}>Total Footprint</span>
                                    <span style={{ fontWeight: '900', fontSize: '1.5rem' }}>{results.total} kg CO₂</span>
                                </div>
                            </div>

                            <div style={{
                                padding: '1.75rem',
                                background: '#f0fdf4',
                                border: '2px dashed #10b981',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem'
                            }}>
                                <div style={{ background: '#10b981', padding: '0.75rem', borderRadius: '50%', display: 'flex' }}>
                                    <IoLeafOutline size={24} color="white" />
                                </div>
                                <p style={{ margin: 0, color: '#064e3b', fontWeight: '700', fontSize: '1rem', lineHeight: '1.4' }}>
                                    You need <span style={{ color: '#10b981', fontSize: '1.3rem', fontWeight: '900' }}>{results.credits}</span> offset credits to neutralize your monthly footprint.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Scientific Footer */}
            <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    *Calculated using standardized global emission coefficients: Electricity @ 0.82kg/kWh & Transport @ 0.21kg/km.
                </p>
            </div>
        </div>
    );
};

export default Calculator;
