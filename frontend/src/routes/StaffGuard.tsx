import { useAuth } from '@store/auth-context';
import type { Role } from '@models/index';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export function StaffGuard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { actor } = useAuth();

  if (!actor || actor.type !== 'staff') {
    return <Navigate to="/login" replace />;
  }
  if (!roles.includes(actor.role)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
