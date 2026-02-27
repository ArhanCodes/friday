import { useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

// Simple hash function using Web Crypto API
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'friday_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
  } catch {
    return null;
  }
}

function saveSession(session) {
  if (session) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}

export function useAuth() {
  const [user, setUser] = useState(getSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user;

  const signup = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const users = getUsers();
      const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setError('An account with this email already exists. Try logging in.');
        setLoading(false);
        return false;
      }

      const hashedPassword = await hashPassword(password);
      const newUser = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };

      saveUsers([...users, newUser]);
      const session = { id: newUser.id, name: newUser.name, email: newUser.email };
      saveSession(session);
      setUser(session);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return false;
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const users = getUsers();
      const hashedPassword = await hashPassword(password);
      const found = users.find(
        u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === hashedPassword
      );

      if (!found) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
        return false;
      }

      const session = { id: found.id, name: found.name, email: found.email };
      saveSession(session);
      setUser(session);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    signup,
    login,
    logout,
    clearError,
  };
}
