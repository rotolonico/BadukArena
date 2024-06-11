import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatComponent from "./components/ChatComponent";
import Play from "./pages/Play";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import {Container, AppBar, Toolbar, Typography, Button} from "@mui/material";
import GameComponent from "./components/GameComponent";
import {isAuthenticated, logout} from "./utils/api";

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

    useEffect( () => {
        async function fetchAuth(){
            let isAuth = await isAuthenticated();
            setAuthStatus(isAuth);
        }
        fetchAuth();
        
    }, []);

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
                            <Button color="inherit" href="/chat">
                                Chat
                            </Button>
                            <Button color="inherit" href="/game">
                                Game
                            </Button>
                            <Button color="inherit" href="/play">
                                Play
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
                        <Route path="/chat" element={<ChatComponent/>}/>
                        <Route path="/game" element={<GameComponent/>}/>
                        <Route path="/play" element={<Play/>}/>
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

export default App;
