import React from 'react';
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import logo from '../static/images/logo.png';
import { Link } from 'react-router-dom';

const Navbar = ({ authStatus, username, handleLogout }) => {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <img src={logo} alt="Logo" style={{ marginRight: '10px', width: '50px', height: '50px' }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Baduk Arena
                </Typography>
                {!authStatus && <Button color="inherit" href="/login">
                    Login
                </Button>}
                {authStatus && <>
                    <Button color="inherit" href="/play">
                        Play
                    </Button>
                    <Button color="inherit" href="/user">
                        {"Your profile (" + (username ? username : 'User') + ")"}
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </>}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
