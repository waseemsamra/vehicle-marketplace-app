import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { createRole } from '../../models/Role';

// Polymorphic route guard. Authorisation is delegated to the role instance
// (BaseRole.canViewAdmin / canManageUsers), so adding a new role subclass
// automatically extends every guard without touching this component.
const RoleRoute = ({ children, adminOnly = false, staffOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Navigate to={location.pathname} replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = createRole(user);

  if (adminOnly && !role.canViewAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (staffOnly && !role.canManageUsers()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
