import axios from 'axios';

const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    url = url.replace(/\/$/, '');
    return url.endsWith('/api') ? url : `${url}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
});

export const ecoService = {
    getUserStats: async () => {
        const response = await api.get('/eco/user-stats');
        return response.data;
    },
    calculateFootprint: async (data) => {
        const response = await api.post('/eco/calculate-footprint', data);
        return response.data;
    },
    getCoachActions: async () => {
        const response = await api.get('/eco/coach-actions');
        return response.data;
    },
    confirmAction: async (actionData) => {
        const response = await api.post('/eco/confirm-action', actionData);
        return response.data;
    },
    getAutoInvest: async () => {
        const response = await api.get('/eco/auto-invest');
        return response.data;
    },
};

export default api;
