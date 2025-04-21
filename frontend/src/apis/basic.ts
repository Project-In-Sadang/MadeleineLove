import axios from 'axios';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

const api = axios.create({
    baseURL: serverUrl + '/api/v1',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Accept: 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('access_token');
        config.headers.set('Authorization', `Bearer ${token}`);
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
