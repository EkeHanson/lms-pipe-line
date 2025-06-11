// src/components/ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from '../services/auth';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const currentUser = auth.getCurrentUser();
  
  return (
    <Route
      {...rest}
      // render={(props) =>
      //   currentUser ? (
      //     <Component {...props} />
      //   ) : (
      //     <Redirect to="/login" />
      //   )
      // }
    />
  );
};

export default ProtectedRoute;