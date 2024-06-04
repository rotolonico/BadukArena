import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:1234',
    withCredentials: true
});

export const register = (email, password) => API.post('/register', { email, password });
export const login = (email, password) => API.post('/login', { email, password });
export const logout = () => API.get('/logout');

export const getProtectedData = () => API.get('/protected');