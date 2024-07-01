import React from 'react';
import {AppBar, Toolbar, Typography, Button} from "@mui/material";
import logo from '../static/images/logo.png';
import {Link} from 'react-router-dom';
import '../static/styles.css';
import {logout} from "../utils/api";

const Navbar = ({authStatus, username, setAuthStatus, setUsername}) => {

    const handleLogout = async () => {
        try {
            await logout();
            setAuthStatus(false);
            setUsername('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{alignItems: 'center', gap: '2px'}}>
                <Link to="/play">
                    <img src={logo} alt="Logo" style={{marginRight: '10px', width: '50px', height: '50px'}}/>
                </Link>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    Baduk Arena
                </Typography>
                {!authStatus &&
                    <Button color="inherit" component={Link} to="/login" className="nav-link">
                        Login
                    </Button>}
                {authStatus && username !== '' && <>
                    <Button color="inherit" component={Link} to="/play" className="nav-link">
                        Play
                    </Button>
                    <Button color="inherit" component={Link} to="/user" className="nav-link">
                        {username}
                    </Button>
                    <Button color="inherit" onClick={handleLogout} component={Link} to="/login" className="nav-link">
                        Logout
                    </Button>
                </>}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
