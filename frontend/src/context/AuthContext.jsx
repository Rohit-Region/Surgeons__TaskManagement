import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * Decode a JWT payload using atob (no external library needed).
 * Returns the parsed payload object, or null if decoding fails.
 */
function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Base64url → Base64 → JSON
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Build a user object from a decoded JWT payload.
 * JWT payload shape: { sub: userId, role, username?, iat, exp }
 */
function buildUser(payload) {
  if (!payload) return null;
  return {
    userId: payload.sub,
    role: payload.role,
    username: payload.username || null,
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // On mount: restore token from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('auth_token');
    if (stored) {
      const payload = decodeToken(stored);
      // Check expiry
      if (payload && payload.exp * 1000 > Date.now()) {
        setToken(stored);
        setUser(buildUser(payload));
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }, []);

  function login(newToken) {
    const payload = decodeToken(newToken);
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
    setUser(buildUser(payload));
  }

  function logout() {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
