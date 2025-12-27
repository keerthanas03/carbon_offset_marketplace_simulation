import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
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
