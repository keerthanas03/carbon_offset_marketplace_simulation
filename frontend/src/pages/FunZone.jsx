import React, { useState, useEffect } from 'react';
import { IoLeafOutline, IoLeaf, IoFlowerOutline, IoWaterOutline, IoSunnyOutline, IoCloudOutline } from 'react-icons/io5';

const FunZone = () => {
    const [score, setScore] = useState(0);
    const [trees, setTrees] = useState([]);
    const [particles, setParticles] = useState([]);

    // Preload tree types
    const treeTypes = [<IoLeaf />, <IoLeafOutline />, <IoFlowerOutline />];
    const colors = ['#10b981', '#34d399', '#059669', '#84cc16', '#65a30d'];

    const plantTree = (e) => {
        // Calculate random position variation around click or center
        const x = Math.random() * 80 + 10; // 10% to 90%
        const y = Math.random() * 80 + 10;

        const newTree = {
            id: Date.now(),
            left: x + '%',
            top: y + '%',
            scale: 0,
            icon: treeTypes[Math.floor(Math.random() * treeTypes.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
        };

        setTrees(prev => [...prev, newTree]);
        setScore(prev => prev + 1);

        // Add confetti burst
        const newParticles = Array.from({ length: 8 }).map((_, i) => ({
            id: Date.now() + i,
            left: x + '%',
            top: y + '%',
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 1) * 20,
            life: 1
        }));
        setParticles(prev => [...prev, ...newParticles]);
    };

    // Animation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            // Grow trees
            setTrees(prev => prev.map(t => ({
                ...t,
                scale: t.scale < 1 ? t.scale + 0.1 : 1
            })));

            // Move particles
            setParticles(prev => prev
                .map(p => ({
                    ...p,
                    left: parseFloat(p.left) + p.vx * 0.5 + '%',
                    top: parseFloat(p.top) + p.vy * 0.5 + '%',
                    vy: p.vy + 1, // Gravity
                    life: p.life - 0.05
                }))
                .filter(p => p.life > 0)
            );

        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Interactive Stats
    const co2Reduced = (score * 0.02).toFixed(2); // Mock calc

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Eco Playground
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
                    Relax, plant a virtual forest, and visualize your collaborative impact.
                </p>
            </div>

            {/* Game Container */}
            <div className="glass-card" style={{
                maxWidth: '900px', margin: '0 auto', height: '500px', position: 'relative',
                overflow: 'hidden', background: 'linear-gradient(to bottom, #f0fdf4 0%, #dcfce7 100%)',
                boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.1)'
            }}>

                {/* Sky Elements */}
                <div style={{ position: 'absolute', top: '20px', left: '10%', opacity: 0.6 }}>
                    <IoCloudOutline size={60} color="#3b82f6" />
                </div>
                <div style={{ position: 'absolute', top: '50px', right: '15%', opacity: 0.4 }}>
                    <IoCloudOutline size={80} color="#3b82f6" />
                </div>
                <div style={{ position: 'absolute', top: '20px', right: '5%', opacity: 0.8 }}>
                    <IoSunnyOutline size={50} color="#f59e0b" />
                </div>

                {/* Score Board */}
                <div style={{
                    position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.9)',
                    padding: '1rem 1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    display: 'flex', flexDirection: 'column', gap: '0.2rem', backdropFilter: 'blur(8px)'
                }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Forest Density</span>
                    <span style={{ fontSize: '2rem', fontWeight: '800', color: '#059669', lineHeight: 1 }}>{score}</span>
                    <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Est. -{co2Reduced} tons CO2</span>
                </div>

                {/* Trees Render */}
                {trees.map(tree => (
                    <div key={tree.id} style={{
                        position: 'absolute',
                        left: tree.left,
                        top: tree.top,
                        transform: `scale(${tree.scale}) translate(-50%, -100%)`, // Grow up from point
                        color: tree.color,
                        fontSize: '3rem',
                        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))'
                    }}>
                        {tree.icon}
                    </div>
                ))}

                {/* Particles Render */}
                {particles.map(p => (
                    <div key={p.id} style={{
                        position: 'absolute', left: p.left, top: p.top, width: '8px', height: '8px',
                        background: '#facc15', borderRadius: '50%', opacity: p.life,
                        transform: 'translate(-50%, -50%)', pointerEvents: 'none'
                    }} />
                ))}

                {/* CTA Overlay */}
                <div style={{
                    position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
                    textAlign: 'center', width: '100%', pointerEvents: 'none'
                }}>
                    <button
                        onClick={plantTree}
                        className="btn btn-primary"
                        style={{
                            fontSize: '1.2rem', padding: '1rem 3rem', pointerEvents: 'auto',
                            boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
                            animation: 'pulse 2s infinite'
                        }}
                    >
                        Click to Plant 🌱
                    </button>
                    <p style={{ marginTop: '1rem', color: '#166534', fontWeight: '600', opacity: 0.8 }}>
                        Every click simulates a new carbon offset project!
                    </p>
                </div>
            </div>

            {/* Fun Facts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '3rem auto 0' }}>
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', '--card-color': '#f59e0b' }}>
                    <IoSunnyOutline size={40} color="#f59e0b" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Did you know?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#64748b' }}>One acre of forest absorbs six tons of carbon dioxide and puts out four tons of oxygen.</p>
                </div>
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', '--card-color': '#3b82f6' }}>
                    <IoWaterOutline size={40} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Ocean Power</h3>
                    <p style={{ fontSize: '0.95rem', color: '#64748b' }}>The ocean absorbs about 30% of carbon dioxide produced by humans, buffering global warming.</p>
                </div>
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', '--card-color': '#10b981' }}>
                    <IoLeafOutline size={40} color="#10b981" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Your Impact</h3>
                    <p style={{ fontSize: '0.95rem', color: '#64748b' }}>Even small lifestyle changes like planting a single tree can have lasting effects for 100+ years.</p>
                </div>
            </div>
        </div>
    );
};

export default FunZone;
