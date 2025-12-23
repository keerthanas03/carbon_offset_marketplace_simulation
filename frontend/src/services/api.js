import axios from 'axios';

const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    // Remove trailing slash if present
    url = url.replace(/\/$/, '');
    // Ensure it ends with /api
    return url.endsWith('/api') ? url : `${url}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
});

// Log the API URL for debugging
console.log('🔗 API Base URL:', getBaseURL());
console.log('🌍 Environment:', import.meta.env.MODE);

export const getDashboardSummary = () => api.get('/dashboard-summary');
export const getEmissions = () => api.get('/emissions');
export const getOffsetProjects = () => api.get('/offset-projects');
export const sendChatMessage = (message) => api.post('/chat', { message });

export default api;
