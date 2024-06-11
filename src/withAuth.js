import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {isAuthenticated} from './utils/api';


const withAuth = (Component) => {
    return (props) => {
        const navigate = useNavigate();

        useEffect(() => {

            async function fetchAuth() {
                let isAuth = await isAuthenticated();
                if (!isAuth) {
                    navigate('/login');
                }
            }

            fetchAuth();
        },);

        return <Component {...props} />;
    };
};

export default withAuth;
