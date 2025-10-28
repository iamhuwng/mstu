import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

  return isAdmin ? children : <Navigate to="/" />;
};

export default PrivateRoute;