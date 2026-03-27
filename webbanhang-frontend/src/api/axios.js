import axios from 'axios';

/**
 * Dev: dùng VITE_API_URL=/api + proxy Vite → http://localhost:5000/api (tránh CORS).
 * Build / deploy: đặt VITE_API_URL=https://domain-cua-ban.com/api
 */
const baseURL = import.meta.env.VITE_API_URL || '/api';

const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const data = error.response?.data;
        const err = data && typeof data === 'object' && 'message' in data ? data : { message: error.message || 'Lỗi mạng' };
        return Promise.reject(err);
    }
);

export default axiosClient;
