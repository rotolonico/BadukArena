import React, { useState } from 'react';
import { register, login, logout, getProtectedData } from './api';

const AuthComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            await register(email, password);
            setMessage('Registration successful');
        } catch (error) {
            setMessage('Registration failed');
        }
    };

    const handleLogin = async () => {
        try {
            await login(email, password);
            setMessage('Login successful');
        } catch (error) {
            setMessage('Login failed');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setMessage('Logout successful');
        } catch (error) {
            setMessage('Logout failed');
        }
    };

    const handleGetProtectedData = async () => {
        try {
            const { data } = await getProtectedData();
            setMessage(`Protected data: ${data}`);
        } catch (error) {
            setMessage('Access denied');
        }
    };

    return (
        <div>
            <h2>Auth Component</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password}
                   onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleGetProtectedData}>Get Protected Data</button>
            <p>{message}</p>
        </div>
    );
};

export default AuthComponent;
