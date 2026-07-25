import { logout as apiLogout, staffLogin } from '@api/auth.api';
import { clearSession, getSession, setSession } from '@lib/session';
import { queryClient } from '@lib/query-client';
import type { StaffUser } from '@models/index';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface AuthContextValue {
  actor: StaffUser | null;
  isStaff: boolean;
  loginStaff: (email: string, password: string) => Promise<StaffUser>;
  logout: () => Promise<void>;
  updateActor: (patch: Partial<StaffUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [actor, setActor] = useState<StaffUser | null>(() => getSession()?.actor ?? null);

  const loginStaff = useCallback(async (email: string, password: string) => {
    const { accessToken, refreshToken, actor } = await staffLogin(email, password);
    setSession({ accessToken, refreshToken, actor });
    queryClient.clear();
    setActor(actor);
    return actor;
  }, []);

  const updateActor = useCallback((patch: Partial<StaffUser>) => {
    setActor((current) => {
      if (!current) return current;
      const updated = { ...current, ...patch };
      const session = getSession();
      if (session) setSession({ ...session, actor: updated });
      return updated;
    });
  }, []);

  const logout = useCallback(async () => {
    const session = getSession();
    if (session) {
      try {
        await apiLogout(session.refreshToken);
      } catch {
      }
    }
    clearSession();
    queryClient.clear();
    setActor(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      actor,
      isStaff: actor !== null,
      loginStaff,
      logout,
      updateActor,
    }),
    [actor, loginStaff, logout, updateActor],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
