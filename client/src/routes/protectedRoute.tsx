// src/components/ProtectedRoute.tsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const ProtectedRoute: React.FC = () => {
  const { authToken } = useContext(AuthContext);

  return authToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
