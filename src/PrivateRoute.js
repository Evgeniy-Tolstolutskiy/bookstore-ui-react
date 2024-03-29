import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authenticationService } from './authenticationService';

export const PrivateRoute = ({ component: Component, context, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        return <Component context={context} {...props} />
    }} />
);

export default PrivateRoute;
