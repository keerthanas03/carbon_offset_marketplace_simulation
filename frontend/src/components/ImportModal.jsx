import React, { useState } from 'react';
import { IoCloudUploadOutline, IoCheckmarkCircleOutline, IoClose } from 'react-icons/io5';

const ImportModal = ({ isOpen, onClose, onImport }) => {
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleUpload(file);
        }
    };

    const handleUpload = (file) => {
        setStatus('uploading');
        setErrorMessage('');

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let data = [];

                if (file.name.endsWith('.json')) {
                    data = JSON.parse(content);
                } else if (file.name.endsWith('.csv')) {
                    // Simple CSV parser
                    const lines = content.split('\n');
                    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

                    data = lines.slice(1).filter(line => line.trim()).map(line => {
                        const values = line.split(',');
                        const obj = {};
                        headers.forEach((header, i) => {
                            let value = values[i]?.trim();
                            // Convert numeric strings to numbers
                            if (!isNaN(value) && value !== '') {
                                value = Number(value);
                            }
                            obj[header] = value;
                        });
                        return obj;
                    });
                }

                // Basic validation: check if it has required fields
                if (data.length > 0 && (data[0].country || data[0].co2_emission)) {
                    setTimeout(() => {
                        setStatus('success');
                        if (onImport) onImport(data);

                        setTimeout(() => {
                            setStatus('idle');
                            onClose();
                        }, 1500);
                    }, 1000);
                } else {
                    throw new Error("Invalid format. Ensure your file has 'country' and 'co2_emission' columns.");
                }
            } catch (err) {
                console.error("Import error:", err);
                setErrorMessage(err.message || "Failed to parse file.");
                setStatus('error');
            }
        };

        reader.onerror = () => {
            setErrorMessage("Failed to read file.");
            setStatus('error');
        };

        reader.readAsText(file);
    };

    const triggerFilePicker = () => {
        document.getElementById('file-upload-input').click();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999
        }} onClick={onClose}>
            <div style={{
                background: 'white', padding: '2.5rem', borderRadius: '24px',
                width: '100%', maxWidth: '500px', position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }} onClick={e => e.stopPropagation()}>

                <button onClick={onClose} style={{
                    position: 'absolute', top: '1.5rem', right: '1.5rem',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8'
                }}>
                    <IoClose size={24} />
                </button>

                {status === 'idle' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            background: '#eff6ff', width: '80px', height: '80px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                            color: '#3b82f6'
                        }}>
                            <IoCloudUploadOutline size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a' }}>Import Emissions Data</h3>
                        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Upload your .csv or .json file to update the dashboard.</p>

                        <input
                            type="file"
                            id="file-upload-input"
                            style={{ display: 'none' }}
                            accept=".csv,.json"
                            onChange={handleFileChange}
                        />

                        <div style={{
                            border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '3rem',
                            marginBottom: '2rem', cursor: 'pointer', transition: 'all 0.2s',
                            background: '#f8fafc'
                        }} className="upload-zone" onClick={triggerFilePicker}>
                            <span style={{ color: '#94a3b8', fontWeight: '500' }}>Drop files here or click to browse</span>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={triggerFilePicker}>
                            Select File
                        </button>
                    </div>
                )}

                {status === 'uploading' && (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div className="spinner" style={{
                            width: '50px', height: '50px', border: '4px solid #e2e8f0',
                            borderTopColor: '#3b82f6', borderRadius: '50%', margin: '0 auto 2rem',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Processing Data...</h3>
                        <p style={{ color: '#64748b' }}>Validating schema and updating records.</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {status === 'success' && (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{
                            color: '#10b981', fontSize: '5rem', marginBottom: '1rem',
                            animation: 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                        }}>
                            <IoCheckmarkCircleOutline />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a' }}>Import Successful!</h3>
                        <p style={{ color: '#64748b' }}>Your dashboard has been updated.</p>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{
                            color: '#ef4444', fontSize: '5rem', marginBottom: '1rem'
                        }}>
                            <IoClose />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a' }}>Import Failed</h3>
                        <p style={{ color: '#ef4444', marginBottom: '2rem' }}>{errorMessage}</p>
                        <button className="btn btn-primary" onClick={() => setStatus('idle')}>
                            Try Again
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ImportModal;
