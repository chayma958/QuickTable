const GUEST_SESSION_KEY = 'quicktable:guestSessionId';

export function useGuestSession() {
  function ensureGuestSession(): string {
    let id = localStorage.getItem(GUEST_SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(GUEST_SESSION_KEY, id);
    }
    return id;
  }

  function hasGuestSession(): boolean {
    return localStorage.getItem(GUEST_SESSION_KEY) !== null;
  }

  return { ensureGuestSession, hasGuestSession };
}
