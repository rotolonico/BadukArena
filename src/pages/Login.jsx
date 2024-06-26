import React, { useState } from 'react';
import { login } from '../utils/api';
import theme from '../utils/theme';
import { TextField, Button, Typography, Box, Container, ThemeProvider } from "@mui/material";
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff, Lock, LockOpen, PersonAdd } from '@mui/icons-material';
import { useSpring, animated } from 'react-spring';

const Login = ({setAuthStatus}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [hover, setHover] = useState(false);

    const springProps = useSpring({
        from: { opacity: 0, transform: "translateY(100%)" },
        to: { opacity: 1, transform: "translateY(0)" },
        config: { duration: 900 },
    });

    const handleLogin = async () => {
        if (!email || !password) {
            setMessage('Email and password are required');
            return;
        }
        const loginResponse = await login(email, password);
        if (loginResponse.success) {
            setAuthStatus(true);
            window.location.href = '#play';
        } else if (loginResponse.status === 401) {
            setMessage('Wrong email or password');
        } else {
            setMessage('Server error');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <animated.div style={springProps}>
                <Container maxWidth="sm">
                    <Box
                        mt={5}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        p={3}
                        bgcolor="#262424"
                        boxShadow="3px 3px 15px rgba(255, 255, 255, 0.1)"
                        borderRadius={8}
                    >
                        <Typography variant="h4" component="h2" gutterBottom color="white">
                            Login
                        </Typography>
                        <Box mt={2} style={{ alignContent: 'center' }}>
                            <Button
                                variant="text"
                                color="secondary"
                                href="#register"
                                startIcon={<PersonAdd />}
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        color: 'gold',
                                    },
                                }}
                            >
                                Create an account
                            </Button>
                        </Box>
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
                                style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' },
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
                                style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' },
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
                            <Button
                                variant="contained"
                                color="secondary"
                                endIcon={hover ? <LockOpen /> : <Lock />}
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                                onClick={handleLogin}
                                sx={{ mt: 2, transition: 'all 0.3s', backgroundColor: '#757575', '&:hover': { backgroundColor: '#9e9e9e' } }}
                                style={{ marginLeft: '5px', color: 'white' }}
                            >
                                Login
                            </Button>
                        </Box>
                        {message && <Typography variant="body1" mt={2} color="white">{message}</Typography>}
                    </Box>
                </Container>
            </animated.div>
        </ThemeProvider>
    );
};

export default Login;
