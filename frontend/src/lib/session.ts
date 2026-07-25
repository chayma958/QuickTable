import type { StaffUser } from '@models/index';
import { readJSON, remove, writeJSON } from './storage';

export interface Session {
  accessToken: string;
  refreshToken: string;
  actor: StaffUser;
}

const SESSION_KEY = 'session';

export function getSession(): Session | null {
  return readJSON<Session>(SESSION_KEY);
}

export function setSession(session: Session): void {
  writeJSON(SESSION_KEY, session);
}

export function clearSession(): void {
  remove(SESSION_KEY);
}
