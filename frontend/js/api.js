const API_BASE = 'http://localhost:8080/api';

async function request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('auth_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${path}`, options);

    // Handle invoice download (returns HTML)
    const contentType = response.headers.get('Content-Type') || '';
    if (response.ok && contentType.includes('text/html')) {
        return { _html: await response.text() };
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data.error || `Request failed (${response.status})`;
        throw new Error(message);
    }

    return data;
}

export const api = {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    delete: (path) => request('DELETE', path),
};

/**
 * Format an integer price (Rupiah) to a localized string.
 * e.g. 100000 → "Rp 100.000"
 */
export function formatPrice(price) {
    return 'Rp ' + Number(price).toLocaleString('id-ID');
}

/**
 * Resolve a product image URL.
 * If the URL is relative (from the backend seed), prepend the backend origin.
 * Returns empty string if no URL provided.
 */
export function getImageUrl(url) {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
}
