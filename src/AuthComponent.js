import React, { useState} from 'react';
import { register, login, logout, getProtectedData } from './api';
import theme from './theme';
import {TextField, Button, Typography, Box, Container, ThemeProvider} from "@mui/material";
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSpring, animated } from 'react-spring';
const AuthComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const springProps = useSpring({
        from: { opacity: 0, transform: "translateY(100%)" },
        to: { opacity: 1, transform: "translateY(0)" },
        config: { duration: 900 },
    });


    const handleRegister = async () => {
        try {
            await register(username, email, password);
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
            <ThemeProvider theme={theme}>
            <animated.div style={springProps}>
            <Container maxWidth="sm">
                <Box mt={5} display="flex" flexDirection="column" alignItems="center" p={3} bgcolor="#262424" boxShadow={3} border={`3px solid #ccc`} borderRadius={10}>
                    <Typography variant="h4" component="h2" gutterBottom color="secondary">Login</Typography>
                    <TextField
                        label="Username"
                        value={username}
                        fullWidth
                        onChange={(e) => setUsername(e.target.value)}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                        InputProps={{
                            style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                            classes: {
                                root: 'textfield-root',
                                focused: 'textfield-focused',
                            },
                            className: 'chat-textfield',
                        }}
                    />
                    <TextField
                        label="Email"
                        value={email}
                        fullWidth
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                        InputProps={{
                            style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                            classes: {
                                root: 'textfield-root',
                                focused: 'textfield-focused',
                            },
                            className: 'chat-textfield',
                        }}
                    />
                    <TextField
                        label="Password"
                        value={password}
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                        InputProps={{
                            style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                            classes: {
                                root: 'textfield-root',
                                focused: 'textfield-focused',
                            },
                            className: 'chat-textfield',
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box mt={2} style={{ paddingRight: '10px' }}>
                        <Button variant="contained" color="secondary" onClick={handleRegister}>Registrazione</Button>
                        <Button variant="contained" color="secondary" onClick={handleLogin} style={{ marginLeft: '5px' }}>Login</Button>
                        <Button variant="contained" onClick={handleLogout} style={{ marginLeft: '5px' }} color="secondary">Logout</Button>
                        <Button variant="contained" onClick={handleGetProtectedData} style={{ marginLeft: '5px' }} color="secondary">Il tuo account</Button>
                    </Box>

                    {message && <Typography variant="body1" mt={2}>{message}</Typography>}
                </Box>
            </Container>
            </animated.div>
            </ThemeProvider>
        );
};

export default AuthComponent;
