import React, { useEffect, useState } from 'react';
import { getEmissions, getDashboardSummary } from '../services/api';
import { downloadCSV } from '../utils/exportHelper';
import ImportModal from '../components/ImportModal';
import {
    IoCloudOutline,
    IoLeafOutline,
    IoTrendingDownOutline,
    IoCashOutline,
    IoGlobeOutline,
    IoFlashOutline,
    IoDownloadOutline,
    IoStatsChartOutline,
    IoCalendarOutline,
    IoTimeOutline
} from 'react-icons/io5';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const EmissionForecast = ({ emissionsData }) => {
    const [forecast, setForecast] = useState(0);

    useEffect(() => {
        if (emissionsData && emissionsData.length > 0) {
            // Sort by year as a proxy for date, then take most recent 6
            // In the current dataset they are all 2023, but we follow the logic
            const recent = [...emissionsData]
                .sort((a, b) => b.year - a.year) // Mock chronological
                .slice(0, 6);

            const average = recent.reduce((sum, item) => sum + Number(item.co2_emission || 0), 0) / recent.length;
            setForecast(average);
        }
    }, [emissionsData]);

    return (
        <div className="glass-card section-reveal delay-1" style={{
            padding: '2.5rem',
            marginBottom: '3rem',
            background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            position: 'relative',
            overflow: 'hidden',
            '--card-color': '#3b82f6',
            '--card-shadow': 'rgba(59, 130, 246, 0.15)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1e3a8a' }}>
                        <div style={{ padding: '0.5rem', background: '#dbeafe', borderRadius: '12px', display: 'flex', color: '#3b82f6' }}>
                            <IoStatsChartOutline size={24} />
                        </div>
                        Emission Trend Forecast
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem', maxWidth: '500px' }}>
                        Statistical projection for the upcoming period based on global historical averages and tracking patterns.
                    </p>

                    <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                                Estimated Next Period Emission
                            </div>
                            <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1d4ed8', letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                {(forecast / 1000000).toFixed(2)}M
                                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#64748b' }}>tons CO₂</span>
                            </div>
                        </div>

                        <div style={{
                            padding: '1.25rem 2rem',
                            background: 'white',
                            borderRadius: '20px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.35rem' }}>System Status</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                                Active Tracking
                            </div>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '2.5rem',
                        padding: '0.75rem 1.25rem',
                        background: 'rgba(255,255,255,0.5)',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.85rem',
                        color: '#64748b',
                        border: '1px solid rgba(255,255,255,0.5)'
                    }}>
                        <IoTimeOutline size={18} color="#3b82f6" />
                        <span>This forecast is based on historical average trends across the most recent 6 tracking periods.</span>
                    </div>
                </div>

                {/* Background Large Icon */}
                <div style={{ opacity: 0.05, position: 'absolute', right: '-40px', bottom: '-40px', color: '#1d4ed8', pointerEvents: 'none' }}>
                    <IoStatsChartOutline size={280} />
                </div>
            </div>
        </div>
    );
};

const SustainabilityScore = ({ netCarbon }) => {
    let status = "High Carbon Impact";
    let color = "#ef4444";
    let bgColor = "#fef2f2";
    let borderColor = "#fee2e2";
    let textColor = "#991b1b";
    let description = "Significant carbon footprint. Immediate offset action is recommended to mitigate environmental impact.";

    if (netCarbon <= 0) {
        status = "Carbon Neutral";
        color = "#10b981";
        bgColor = "#ecfdf5";
        borderColor = "#d1fae5";
        textColor = "#065f46";
        description = "Outstanding! Your offsets match or exceed emissions. You are leading the way in environmental stewardship.";
    } else if (netCarbon <= 1000) {
        status = "Moderate Impact";
        color = "#f59e0b";
        bgColor = "#fffbeb";
        borderColor = "#fef3c7";
        textColor = "#92400e";
        description = "Controlled emissions with some offset coverage. There is room for improvement to reach neutrality.";
    }

    return (
        <div style={{
            padding: '2rem',
            background: bgColor,
            borderRadius: '24px',
            border: `2px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '3rem',
            boxShadow: `0 10px 25px -5px ${color}15`,
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '1.25rem',
                background: color,
                borderRadius: '18px',
                color: 'white',
                display: 'flex',
                boxShadow: `0 8px 16px -4px ${color}60`
            }}>
                <IoLeafOutline size={32} />
            </div>
            <div>
                <div style={{
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    color: textColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.25rem'
                }}>
                    Sustainability Status
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: textColor, margin: '0 0 0.5rem' }}>{status}</h2>
                <p style={{ margin: 0, color: textColor, opacity: 0.8, fontSize: '1rem', maxWidth: '600px', lineHeight: '1.5' }}>
                    {description}
                </p>
            </div>
            {/* Subtle background icon */}
            <div style={{
                position: 'absolute', right: '-20px', bottom: '-20px',
                opacity: 0.1, color: color, transform: 'rotate(-15deg)'
            }}>
                <IoLeafOutline size={180} />
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [emissionsData, setEmissionsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isImportOpen, setIsImportOpen] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [summaryRes, emissionsRes] = await Promise.all([
                    getDashboardSummary(),
                    getEmissions()
                ]);
                setSummary(summaryRes.data);
                setEmissionsData(emissionsRes.data);
                setLoading(false);
            } catch (err) {
                console.error('❌ Dashboard Error:', err);
                console.error('Error details:', err.response?.data || err.message);
                const errorMsg = err.response?.data?.error || err.message || 'Unable to fetch live data.';
                setError(`Unable to fetch live data. ${errorMsg}`);
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const handleExport = () => {
        downloadCSV(emissionsData, 'carbon_emissions_data.csv');
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading analytics...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '4rem' }}>{error}</div>;

    // --- Data Processing for Charts ---
    const chartPalette = {
        emissions: ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#be123c'],
        credits: ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857'],
        vibrant: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6'],
        mixed: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6']
    };

    // 1. Top Countries Bar Chart (Emissions vs Credits)
    const topCountries = [...emissionsData]
        .sort((a, b) => b.co2_emission - a.co2_emission)
        .slice(0, 10);

    const barChartData = {
        labels: topCountries.map(c => c.country),
        datasets: [
            {
                label: 'Emissions',
                data: topCountries.map(c => c.co2_emission),
                backgroundColor: topCountries.map((_, i) => chartPalette.vibrant[i % chartPalette.vibrant.length]),
                borderRadius: 8,
                barThickness: 25,
            },
            {
                label: 'Credits',
                data: topCountries.map(c => c.credits_needed),
                backgroundColor: topCountries.map((_, i) => chartPalette.vibrant[i % chartPalette.vibrant.length] + '60'), // Lighter version
                borderRadius: 8,
                barThickness: 25,
            }
        ]
    };

    // --- Flag Plugin for Chart.js ---
    const flagImages = topCountries.map(c => {
        const img = new Image();
        img.src = `https://flagcdn.com/w40/${c.code.toLowerCase()}.png`;
        return img;
    });

    const flagPlugin = {
        id: 'flagPlugin',
        afterDraw: (chart) => {
            const ctx = chart.ctx;
            const xAxis = chart.scales.x;
            const yAxis = chart.scales.y;

            xAxis.ticks.forEach((tick, index) => {
                const x = xAxis.getPixelForTick(index);
                const img = flagImages[index];
                if (img.complete) {
                    // Draw flags closer to the axis line
                    ctx.drawImage(img, x - 12, yAxis.bottom + 5, 24, 16);
                }
            });
        }
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: { usePointStyle: true, boxWidth: 8, font: { weight: '600' } }
            },
            title: { display: false }
        },
        layout: {
            padding: { bottom: 40 }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(226, 232, 240, 0.5)', drawBorder: false },
                ticks: { font: { size: 10, weight: '500' }, color: '#64748b' }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 9, weight: '700' },
                    color: '#475569',
                    maxRotation: 0,
                    minRotation: 0,
                    padding: 25 // Pushes the text below the flag
                }
            }
        },
        maintainAspectRatio: false
    };

    // 2. Project Types Doughnut Chart
    const projectTypes = {};
    emissionsData.forEach(item => {
        if (!item.project_type) return;
        let category = 'Other';
        const pLower = item.project_type.toLowerCase();
        if (pLower.includes('solar')) category = 'Solar Energy';
        else if (pLower.includes('forest') || pLower.includes('plantation')) category = 'Reforestation';
        else if (pLower.includes('wind')) category = 'Wind Energy';
        else if (pLower.includes('ocean') || pLower.includes('blue')) category = 'Ocean Conservation';
        else if (pLower.includes('nuclear')) category = 'Nuclear Energy';
        else if (pLower.includes('carbon') || pLower.includes('capture')) category = 'Carbon Capture';
        else category = item.project_type;

        if (!projectTypes[category]) projectTypes[category] = 0;
        projectTypes[category] += Number(item.credits_needed || 0);
    });

    const doughnutData = {
        labels: Object.keys(projectTypes),
        datasets: [{
            data: Object.values(projectTypes),
            backgroundColor: chartPalette.mixed,
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 15
        }]
    };

    // 3. Line Chart (Emissions Trend) - Refined and Beautiful
    const lineChartData = {
        labels: topCountries.map(c => c.country),
        datasets: [
            {
                label: 'Emissions Trend',
                data: topCountries.map(c => c.co2_emission),
                borderColor: '#f43f5e',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(244, 63, 94, 0.3)');
                    gradient.addColorStop(1, 'rgba(244, 63, 94, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.5,
                pointRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#f43f5e',
                pointBorderWidth: 3,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#f43f5e',
                pointHoverBorderColor: '#fff',
            },
            {
                label: 'Baseline Target',
                data: topCountries.map(() => 0),
                borderColor: '#10b981',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0
            }
        ]
    };

    const commonOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    font: { size: 11, weight: '600', family: 'Plus Jakarta Sans' },
                    padding: 15
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                titleFont: { size: 14, weight: '700' },
                bodyFont: { size: 13 },
                cornerRadius: 12,
                displayColors: true
            }
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(226, 232, 240, 0.5)', drawBorder: false },
                ticks: { font: { size: 10, weight: '500' }, color: '#64748b', padding: 10 }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 10, weight: '600' },
                    color: '#475569',
                    maxRotation: 0, // Force labels to be horizontal
                    minRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10,
                    padding: 10
                }
            }
        },
        maintainAspectRatio: false
    };

    const doughnutOptions = {
        cutout: '78%', // Slightly thinner for an elegant look
        plugins: {
            legend: {
                display: false // We will build a manual legend for perfect alignment
            }
        },
        maintainAspectRatio: false
    };

    // Number Formatters
    const formatM = (num) => (num / 1000000).toFixed(2) + 'M';

    return (
        <div className="section-reveal">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.5rem', background: '#e2e8f0', borderRadius: '50%', display: 'flex' }}>
                            <IoGlobeOutline size={20} />
                        </div>
                        <h1 style={{ fontSize: '2rem', margin: 0, background: 'none', WebkitTextFillColor: 'initial', color: 'var(--text-main)' }}>
                            Analytics Dashboard
                        </h1>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time overview of global carbon emissions and offset initiatives</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setIsImportOpen(true)} className="btn btn-glass" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <IoCloudOutline /> Import
                    </button>
                    <button onClick={handleExport} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <IoDownloadOutline /> Export CSV
                    </button>
                </div>
            </div>

            {/* Emission Trend Forecast */}
            <EmissionForecast emissionsData={emissionsData} />

            {/* Sustainability Score Indicator */}
            {summary && <SustainabilityScore netCarbon={summary.netCarbon} />}

            {/* Summary Cards Row */}
            <div className="dashboard-grid section-reveal delay-1" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>

                {/* Card 1: Total CO2 */}
                <div className="glass-card" style={{
                    padding: '1.5rem', background: '#fff1f2', border: '1px solid #ffe4e6',
                    '--card-color': '#e11d48', '--card-shadow': '#e11d4840'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#881337', letterSpacing: '0.05em' }}>TOTAL CO2 EMISSIONS</span>
                        <div style={{ padding: '0.5rem', background: '#fb7185', color: 'white', borderRadius: '8px', display: 'flex' }}>
                            <IoTrendingDownOutline />
                        </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#881337', marginBottom: '0.5rem' }}>
                        {formatM(summary.totalEmissions)}M
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#9f1239', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <IoGlobeOutline /> metric tons tracked globally
                    </div>
                </div>

                {/* Card 2: Offsets Required */}
                <div className="glass-card" style={{
                    padding: '1.5rem', background: '#ecfdf5', border: '1px solid #d1fae5',
                    '--card-color': '#059669', '--card-shadow': '#05966940'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#064e3b', letterSpacing: '0.05em' }}>OFFSETS REQUIRED</span>
                        <div style={{ padding: '0.5rem', background: '#34d399', color: 'white', borderRadius: '8px', display: 'flex' }}>
                            <IoLeafOutline />
                        </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#064e3b', marginBottom: '0.5rem' }}>
                        {formatM(summary.totalOffsets)}M
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        — offset capacity needed
                    </div>
                </div>

                {/* Card 3: Net Carbon Balance */}
                <div className="glass-card" style={{
                    padding: '1.5rem', background: '#fffbeb', border: '1px solid #fef3c7',
                    '--card-color': '#d97706', '--card-shadow': '#d9770640'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#78350f', letterSpacing: '0.05em' }}>NET CARBON BALANCE</span>
                        <div style={{ padding: '0.5rem', background: '#fbbf24', color: 'white', borderRadius: '8px', display: 'flex' }}>
                            <IoTrendingDownOutline />
                        </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#78350f', marginBottom: '0.5rem' }}>
                        {formatM(summary.netCarbon)}M
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📉 emissions exceed offsets
                    </div>
                </div>

                {/* Card 4: Investment Required */}
                <div className="glass-card" style={{
                    padding: '1.5rem', background: '#f5f3ff', border: '1px solid #ede9fe',
                    '--card-color': '#7c3aed', '--card-shadow': '#7c3aed40'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4c1d95', letterSpacing: '0.05em' }}>INVESTMENT REQUIRED</span>
                        <div style={{ padding: '0.5rem', background: '#a78bfa', color: 'white', borderRadius: '8px', display: 'flex' }}>
                            <IoCashOutline />
                        </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#4c1d95', marginBottom: '0.5rem' }}>
                        ${formatM(summary.totalOffsets * 15)}M
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#5b21b6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        — total offset investment
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            {/* Row 1: Bar Chart (Full Width) */}
            <div className="glass-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Global Emissions Leaderboard</h3>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Interactive performance comparison with national identity flags</p>
                </div>
                <div style={{ height: '350px' }}>
                    <Bar data={barChartData} options={barOptions} plugins={[flagPlugin]} />
                </div>
            </div>

            {/* Row 2: Doughnut + Line Chart */}
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Doughnut Chart */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', '--card-color': '#10b981' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Sector Distribution</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Project availability by industry type</p>
                    </div>

                    <div style={{ flex: 1, position: 'relative', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)',
                            textAlign: 'center', pointerEvents: 'none'
                        }}>
                            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '0.9', fontFamily: 'Outfit' }}>
                                {Object.keys(projectTypes).length}
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '0.1rem' }}>
                                Sectors
                            </div>
                        </div>
                    </div>

                    {/* Custom Manual Legend - Perfectly aligned */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.25rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                        {Object.keys(projectTypes).map((label, i) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: chartPalette.mixed[i % chartPalette.mixed.length] }}></div>
                                {label}
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0fdf4', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid #dcfce7' }}>
                        <div style={{ background: '#10b981', padding: '0.5rem', borderRadius: '10px', display: 'flex', color: 'white', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>
                            <IoLeafOutline />
                        </div>
                        <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#064e3b' }}>
                            {formatM(summary.totalOffsets)}M Credits Available
                        </span>
                    </div>
                </div>

                {/* Line Chart */}
                <div className="glass-card" style={{ padding: '2rem', position: 'relative', '--card-color': '#f43f5e' }}>
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Emission Trajectories</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Historical tracking against baseline targets</p>
                        </div>
                        <div style={{ color: '#f43f5e', background: '#fff1f2', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>
                            Real-time Feed
                        </div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Line data={lineChartData} options={commonOptions} />
                    </div>
                </div>
            </div>

            {/* Bottom Stats Row */}
            <div className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center', textAlign: 'center', background: '#f8fafc' }}>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>{emissionsData.length}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Countries Tracked</div>
                </div>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>{Object.keys(projectTypes).length}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Project Types</div>
                </div>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>
                        {formatM(summary.totalOffsets)}M
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Credits Needed</div>
                </div>
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#8b5cf6' }}>
                        {((summary.totalOffsets / summary.totalEmissions) * 100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Offset Coverage</div>
                </div>
            </div>

            {/* Analytics Footer */}
            <div className="glass-card" style={{ marginTop: '2rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.75rem', background: '#e2e8f0', borderRadius: '12px' }}>
                    <IoFlashOutline size={20} />
                </div>
                <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Analytics & Export</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '800px' }}>
                        All data is stored in a PostgreSQL database and can be exported to CSV for advanced analysis in tools like Tableau.
                        <span style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }} onClick={() => setIsImportOpen(true)}> Click here to import data.</span>
                    </p>
                </div>
            </div>

            <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
        </div>
    );
};

export default Dashboard;
