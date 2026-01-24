import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const FINANCE_URL = 'http://localhost:5000';
const AI_URL = 'http://localhost:5001';
const REALTIME_URL = 'http://localhost:3000';

// Create axios instance with auth interceptor
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('omni_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('omni_token');
            localStorage.removeItem('omni_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const authApi = {
    login: async (email: string, password: string) => {
        const response = await api.post('/api/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('omni_token', response.data.token);
            localStorage.setItem('omni_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (data: { email: string; password: string; name: string; phone?: string }) => {
        const response = await api.post('/api/auth/register', data);
        if (response.data.token) {
            localStorage.setItem('omni_token', response.data.token);
            localStorage.setItem('omni_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('omni_token');
        localStorage.removeItem('omni_user');
    },

    getCurrentUser: async () => {
        const response = await api.get('/api/auth/me');
        return response.data;
    },

    getStoredUser: () => {
        const user = localStorage.getItem('omni_user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('omni_token');
    },
};

// Orders endpoints
export const ordersApi = {
    getAll: async () => {
        const response = await api.get('/api/orders');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/api/orders/${id}`);
        return response.data;
    },

    track: async (orderNumber: string) => {
        const response = await api.get(`/api/orders/track/${orderNumber}`);
        return response.data;
    },

    create: async (order: any) => {
        const response = await api.post('/api/orders', order);
        return response.data;
    },

    update: async (id: number, order: any) => {
        const response = await api.put(`/api/orders/${id}`, order);
        return response.data;
    },

    updateStatus: async (id: number, status: string) => {
        const response = await api.put(`/api/orders/${id}/status`, { status });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/api/orders/${id}`);
        return response.data;
    },
};

// Trucks endpoints
export const trucksApi = {
    getAll: async () => {
        const response = await api.get('/api/trucks');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/api/trucks/${id}`);
        return response.data;
    },

    getAvailable: async () => {
        const response = await api.get('/api/trucks/available');
        return response.data;
    },

    create: async (truck: any) => {
        const response = await api.post('/api/trucks', truck);
        return response.data;
    },

    update: async (id: number, truck: any) => {
        const response = await api.put(`/api/trucks/${id}`, truck);
        return response.data;
    },

    updateLocation: async (id: number, location: { latitude: number; longitude: number; location: string }) => {
        const response = await api.put(`/api/trucks/${id}/location`, location);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/api/trucks/${id}`);
        return response.data;
    },
};

// Finance endpoints (C# service)
export const financeApi = {
    getInvoices: async () => {
        const response = await axios.get(`${FINANCE_URL}/invoices`);
        return response.data;
    },

    triggerMpesaPay: async (phoneNumber: string, amount: number, reference: string) => {
        const response = await axios.post(`${FINANCE_URL}/api/mpesa/pay`, {
            PhoneNumber: phoneNumber,
            Amount: amount,
            Reference: reference,
        });
        return response.data;
    },
};

// AI endpoints (Python service)
export const aiApi = {
    optimizeRoute: async (origin: string, destination: string, cargoWeight: number, priority: string) => {
        const response = await axios.post(`${AI_URL}/api/optimize-route`, {
            origin,
            destination,
            cargo_weight: cargoWeight,
            priority,
        });
        return response.data;
    },

    predictDelivery: async (routeId: string, historicalData: number[]) => {
        const response = await axios.post(`${AI_URL}/api/predict-delivery`, {
            route_id: routeId,
            historical_data: historicalData,
        });
        return response.data;
    },

    detectAnomalies: async (truckId?: string) => {
        const response = await axios.get(`${AI_URL}/api/anomaly-detection`, {
            params: { truck_id: truckId },
        });
        return response.data;
    },

    forecastDemand: async (region: string, days: number) => {
        const response = await axios.get(`${AI_URL}/api/demand-forecast`, {
            params: { region, days },
        });
        return response.data;
    },

    predictRevenue: async (monthsAhead: number) => {
        const response = await axios.get(`${AI_URL}/api/analytics/revenue-prediction`, {
            params: { months_ahead: monthsAhead },
        });
        return response.data;
    },
};

// Realtime endpoints
export const realtimeApi = {
    getTruckPositions: async () => {
        const response = await axios.get(`${REALTIME_URL}/api/trucks/positions`);
        return response.data;
    },

    updateTruckPosition: async (plateNumber: string, position: any) => {
        const response = await axios.post(`${REALTIME_URL}/api/trucks/${plateNumber}/position`, position);
        return response.data;
    },
};

export default api;
