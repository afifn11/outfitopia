// /client/src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated || user.role !== 'admin') {
        return <Navigate to="/" replace />; // Redirect ke home jika bukan admin
    }

    return children;
};

export default AdminRoute;