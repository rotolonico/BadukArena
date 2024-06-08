import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:1234',
    withCredentials: true
});

export const register = (username, email, password) => API.post('/api/users/register', { username, email, password });
export const login = (email, password) => API.post('/api/users/login', {email, password });
export const logout = () => API.get('/api/users/logout');

export const getProtectedData = () => API.get('/api/users/protected');

export const joinRoom = (roomNumber) => API.post('/api/rooms/joinRoom', {roomNumber});