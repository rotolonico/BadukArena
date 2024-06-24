import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Play from "./pages/Play";
import User from "./pages/User";
import Footer from "./components/Footer";
import { Container } from "@mui/material";
import { getUsername, isAuthenticated } from "./utils/api";

function App() {
    const [authStatus, setAuthStatus] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        isAuthenticated().then(isAuth => {
            setAuthStatus(isAuth);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    useEffect(() => {
        if (authStatus) {
            getUsername().then((response) => {
                setUsername(response.data);
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [authStatus]);

    return (
        <HashRouter>
            <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar authStatus={authStatus} username={username} setUsername={setUsername} setAuthStatus={setAuthStatus} />
                <Container sx={{ flexGrow: 1, marginTop: '64px'}}>
                    <Routes>
                        <Route path="login" element={<Login setAuthStatus={setAuthStatus} />} />
                        <Route path="register" element={<Register />} />
                        <Route path="play" element={<Play />} />
                        <Route path="user" element={<User currentUsername={username}/>} />
                        <Route path="*" element={<Navigate to='play' replace />} />
                    </Routes>
                </Container>
                <Footer />
            </div>
        </HashRouter>
    );
}

export default App;
