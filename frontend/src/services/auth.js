import axios from 'axios';
import { jwtDecode } from 'jwt-decode'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const response = await api.post('auth/refresh/', { refresh: refreshToken });
                    const newAccessToken = response.data.access;
                    localStorage.setItem('accessToken', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest); 
                } catch (refreshError) {
                    console.error('Erro ao renovar token:', refreshError);
                    logout();
                    window.location.href = '/login'; 
                    return Promise.reject(refreshError);
                }
            } else {
                logout();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// --- Funções de Autenticação ---
export const register = async (nomeCompleto, email, password) => {
    const response = await api.post('auth/register/', { nome_completo: nomeCompleto, email, password });
    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('auth/login/', { email, password });
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('userData', JSON.stringify(response.data.user));
    return response.data;
};

export const isUserLoggedIn = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return false;

    try {
        const decodedToken = jwtDecode(accessToken);
        if (decodedToken.exp * 1000 < Date.now()) {
            console.warn("Access Token expirado na verificação de isUserLoggedIn.");
            return false;
        }
        return true;
    } catch (e) {
        console.error("Erro ao decodificar access token:", e);
        return false;
    }
};

export const getUserData = () => {
    const userDataString = localStorage.getItem('userData');
    return userDataString ? JSON.parse(userDataString) : null;
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
};

export const getCurrentUser = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

export default api; 