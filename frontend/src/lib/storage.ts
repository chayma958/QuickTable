const PREFIX = 'quicktable';

function key(name: string): string {
  return `${PREFIX}:${name}`;
}

export function readJSON<T>(name: string): T | null {
  const raw = localStorage.getItem(key(name));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJSON<T>(name: string, value: T): void {
  localStorage.setItem(key(name), JSON.stringify(value));
}

export function remove(name: string): void {
  localStorage.removeItem(key(name));
}
