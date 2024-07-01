import React, {useEffect, useState} from 'react';
import {isAuthenticated} from './utils/api';
import {Box, CircularProgress} from "@mui/material";

const withAuth = (Component) => {

    return (props) => {

        const [isAuth, setIsAuth] = useState(false);

        useEffect(() => {
            isAuthenticated()
                .then(isAuthResponse => {
                    if (!isAuthResponse) {
                        window.location.href = '#login';
                    }
                    setIsAuth(isAuthResponse);
                })
                .catch(err => {
                    console.error(err);
                    window.location.href = '#login';
                });
        },);

        return isAuth ? <Component {...props} /> : <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <CircularProgress style={{ color: '#FFFFFF' }}/>
        </Box>;
    };
};

export default withAuth;
