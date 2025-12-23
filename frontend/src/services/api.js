import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    timeout: 10000,
});

// Log the API URL for debugging
console.log('🔗 API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:5001/api');
console.log('🌍 Environment:', import.meta.env.MODE);

export const getDashboardSummary = () => api.get('/dashboard-summary');
export const getEmissions = () => api.get('/emissions');
export const getOffsetProjects = () => api.get('/offset-projects');
export const sendChatMessage = (message) => api.post('/chat', { message });

export default api;
