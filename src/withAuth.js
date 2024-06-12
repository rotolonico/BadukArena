import React, {useEffect} from 'react';
import {isAuthenticated} from './utils/api';


const withAuth = (Component) => {
    return (props) => {
        useEffect(() => {
            isAuthenticated()
                .then(isAuth => {
                    if (!isAuth) {
                        window.location.href = '/login';
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        },);

        return <Component {...props} />;
    };
};

export default withAuth;
