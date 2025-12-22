import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    timeout: 10000,
});

export const getDashboardSummary = () => api.get('/dashboard-summary');
export const getEmissions = () => api.get('/emissions');
export const getOffsetProjects = () => api.get('/offset-projects');
export const sendChatMessage = (message) => api.post('/chat', { message });

export default api;
