import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:1234',
    withCredentials: true
});

let isAuth = document.cookie.includes('auth=true');

const handleRequest = async (apiCall) => {
    try {
        const response = await apiCall();
        return {
            data: response.data,
            status: response.status,
            success: true,
        };
    } catch (error) {
        if (error.response) {
            return {
                data: error.response.data,
                status: error.response.status,
                success: false,
            };
        } else if (error.request) {
            return {
                data: null,
                status: null,
                success: false,
                message: 'No response received from server',
            };
        } else {
            return {
                data: null,
                status: null,
                success: false,
                message: error.message,
            };
        }
    }
};

export const register = (username, email, password) => handleRequest(() => API.post('/api/users/register', { username, email, password }));
export const login = async (email, password) => {
    let loginResponse = await handleRequest(() => API.post('/api/users/login', {email, password}));
    isAuth = loginResponse.success;
    return loginResponse;
};
export const logout = async () => {
    let logoutResponse = await handleRequest(() => API.get('/api/users/logout'));
    if (logoutResponse.success) {
        isAuth = false;
    }
    
    return logoutResponse;
};

export const isAuthenticated = async () => {
    let isAuth = await handleRequest(() => API.get('/api/users/auth'));
    return isAuth.success;
};

export const getGames = () => handleRequest(() => API.get('/api/users/games'));
export const getUsername = () => handleRequest(() => API.get('/api/users/username'));

export const joinRoom = (roomNumber) => handleRequest(() => API.post('/api/rooms/joinRoom', { roomNumber }));
export const createRoom = () => handleRequest(() => API.post('/api/rooms/createRoom'));
export const getRooms = () => handleRequest(() => API.get('/api/rooms/getRooms'));
export const deleteRoom = (roomNumber) => handleRequest(() => API.delete('/api/rooms/deleteRoom', { data: { roomNumber } }));
