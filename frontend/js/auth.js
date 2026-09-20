import { api } from './api.js';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

let listeners = [];

/* ── Read ── */

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
        return null;
    }
}

export function isLoggedIn() {
    return !!getToken();
}

/* ── Write ── */

export function setAuth(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    notify();
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    notify();
}

/* ── API actions ── */

export async function login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    setAuth(data.token, data.user);
    return data;
}

export async function register(name, email, password) {
    const data = await api.post('/auth/register', { name, email, password });
    setAuth(data.token, data.user);
    return data;
}

export function logout() {
    clearAuth();
}

/* ── Observer ── */

export function onAuthChange(callback) {
    listeners.push(callback);
    return () => {
        listeners = listeners.filter(l => l !== callback);
    };
}

function notify() {
    const loggedIn = isLoggedIn();
    const user = getUser();
    listeners.forEach(cb => {
        try { cb(loggedIn, user); } catch (e) { console.error(e); }
    });
}
