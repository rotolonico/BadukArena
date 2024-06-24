import React, { useState} from 'react';
import { register } from '../utils/api';
import theme from '../utils/theme';
import {TextField, Button, Typography, Box, Container, ThemeProvider} from "@mui/material";
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSpring, animated } from 'react-spring';
const Register = () => {
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
        if (!username || !email || !password) {
            setMessage('Username, email and password are required');
            return;
        }
        
        let registerResponse = await register(username, email, password);
        if (registerResponse.success) {
            window.location.href = '#login';
        } else {
            setMessage(registerResponse.data || 'Server error');
        }
    };
    
        return (
            <ThemeProvider theme={theme}>
            <animated.div style={springProps}>
            <Container maxWidth="sm">
                <Box mt={5} display="flex" flexDirection="column" alignItems="center" p={3} bgcolor="#262424" boxShadow={3} borderRadius={10}>
                    <Typography variant="h4" component="h2" gutterBottom color="white">Register</Typography>
                    <Box mt={2} style={{ alignContent: 'center' }}>
                        <Button variant="text" color="secondary" href="#login">Already have an account?</Button>
                    </Box>
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
                    <Box mt={2}>
                        <Button variant="contained" color="secondary" onClick={handleRegister} style={{ marginLeft: '5px' }}>Register</Button>
                    </Box>

                    {message && <Typography variant="body1" mt={2} color="white">{message}</Typography>}
                </Box>
            </Container>
            </animated.div>
            </ThemeProvider>
        );
};

export default Register;
