import Login from "./pages/Login";
import Register from "./pages/Register";
import Play from "./pages/Play";
import User from "./pages/User";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import {Container, AppBar, Toolbar, Typography, Button} from "@mui/material";
import {getUsername, isAuthenticated, logout} from "./utils/api";

const handleLogout = async () => {
    try {
        await logout();
        window.location.href = '/login';
    } catch (error) {
        console.error(error);
    }
};

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
    },[authStatus]);

    return (<Router>
            <div style={{backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Baduk Arena
                        </Typography>
                        {!authStatus && <Button color="inherit" href="/login">
                            Login
                        </Button>}
                        {authStatus && <div>
                            <Button color="inherit" href="/play">
                                Play
                            </Button>
                            <Button color="inherit" href="/user">
                                {username? username:'User'}
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>}
                    </Toolbar>
                </AppBar>
                <Container sx={{flexGrow: 1, marginTop: '64px'}}>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/play" element={<Play/>}/>
                        <Route path="/user" element={<User/>}/>
                        <Route path="*" element={<Navigate to='/play' replace />} />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

export default App;
