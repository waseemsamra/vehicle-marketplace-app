import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { createRole } from '../models/Role';

// Returns the current user's role instance. Because `createRole` returns a
// subclass polymorphic on the BaseRole interface, consumers get role-correct
// behaviour for free: `role.canViewAdmin()`, `role.permissions`, etc.
export const useRole = () => {
  const { user } = useAuth();
  return useMemo(() => createRole(user), [user]);
};

export default useRole;
