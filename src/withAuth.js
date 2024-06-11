import React, {useEffect} from 'react';
import {isAuthenticated} from './utils/api';


const withAuth = (Component) => {
    return (props) => {
        useEffect(() => {

            async function fetchAuth() {
                let isAuth = await isAuthenticated();
                if (!isAuth) {
                    window.location.href = '/login';
                }
            }

            fetchAuth();
        },);

        return <Component {...props} />;
    };
};

export default withAuth;
