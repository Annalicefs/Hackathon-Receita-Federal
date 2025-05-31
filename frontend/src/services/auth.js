import axios from 'axios';

// Instancia pra url api
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
    // Armazena tokens e dados do usuário no localStorage
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('userData', JSON.stringify(response.data.user));
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    //api.post('auth/logout/', { refresh: refreshToken });
};

export const getCurrentUser = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

//Exporta configuraçao
export default api; 