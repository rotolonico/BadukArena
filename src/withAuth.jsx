import React, {useEffect, useState} from 'react';
import {isAuthenticated} from './utils/api';

const withAuth = (Component) => {

    return (props) => {

        const [isAuth, setIsAuth] = useState(false);

        useEffect(() => {
            isAuthenticated()
                .then(isAuthResponse => {
                    if (!isAuthResponse) {
                        window.location.href = '/login';
                    }
                    setIsAuth(isAuthResponse);
                })
                .catch(err => {
                    console.error(err);
                    window.location.href = '/login';
                });
        },);

        return isAuth ? <Component {...props} /> : null;
    };
};

export default withAuth;
