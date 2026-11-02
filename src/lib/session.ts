import { STORAGE_KEYS } from "./constants";

/**
 * Generates a standard UUID v4 string.
 */
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Retrieves the current guest session key from browser storage,
 * or generates and saves a new one if it does not exist yet.
 */
export function getOrCreateGuestSessionKey(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let sessionKey = localStorage.getItem(STORAGE_KEYS.GUEST_SESSION);

  if (!sessionKey || sessionKey.trim() === "") {
    sessionKey = generateUUID();
    localStorage.setItem(STORAGE_KEYS.GUEST_SESSION, sessionKey);

    // Also persist in cookie with 30-day expiration for SSR/middleware support
    const maxAge = 30 * 24 * 60 * 60; // 30 days
    document.cookie = `${STORAGE_KEYS.GUEST_SESSION}=${sessionKey}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }

  return sessionKey;
}

/**
 * Clears the guest session key after cart has been successfully merged into an authenticated account.
 */
export function clearGuestSessionKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.GUEST_SESSION);
  document.cookie = `${STORAGE_KEYS.GUEST_SESSION}=; path=/; max-age=0; SameSite=Lax`;
}
