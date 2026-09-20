/* ─────────────────────────────────────
   APP — Router & Initialization
   ───────────────────────────────────── */

import { renderNavbar, initNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { onAuthChange } from './auth.js';
import { onCartChange } from './store.js';

// Page modules (statically imported for simplicity)
import { HomePage } from './pages/home.js';
import { ProductsPage } from './pages/products.js';
import { ProductDetailPage } from './pages/productDetail.js';
import { CartPage } from './pages/cart.js';
import { CheckoutPage } from './pages/checkout.js';
import { OrderConfirmationPage } from './pages/orderConfirmation.js';
import { LoginPage } from './pages/login.js';
import { RegisterPage } from './pages/register.js';
import { OrdersPage } from './pages/orders.js';

/* ── Route Definitions ── */

const routes = [
    { path: '',                 page: HomePage },
    { path: 'products',         page: ProductsPage },
    { path: 'product/:id',      page: ProductDetailPage },
    { path: 'cart',             page: CartPage },
    { path: 'checkout',         page: CheckoutPage },
    { path: 'order/:id',        page: OrderConfirmationPage },
    { path: 'orders',           page: OrdersPage },
    { path: 'login',            page: LoginPage },
    { path: 'register',         page: RegisterPage },
];

/* ── Route Matching ── */

function matchRoute(hash) {
    // Strip "#/" prefix and split off query string
    const raw = (hash || '#/').replace(/^#\/?/, '');
    const [pathPart] = raw.split('?');
    const segments = pathPart.split('/').filter(Boolean);

    for (const route of routes) {
        const routeSegments = route.path.split('/').filter(Boolean);

        // Empty path matches empty segments
        if (routeSegments.length === 0 && segments.length === 0) {
            return { page: route.page, params: {} };
        }

        if (routeSegments.length !== segments.length) continue;

        const params = {};
        let match = true;

        for (let i = 0; i < routeSegments.length; i++) {
            if (routeSegments[i].startsWith(':')) {
                params[routeSegments[i].slice(1)] = decodeURIComponent(segments[i]);
            } else if (routeSegments[i] !== segments[i]) {
                match = false;
                break;
            }
        }

        if (match) return { page: route.page, params };
    }

    // Fallback → home
    return { page: HomePage, params: {} };
}

/* ── Query Params Helper ── */

export function getQueryParam(key) {
    const hash = window.location.hash || '';
    const qIdx = hash.indexOf('?');
    if (qIdx < 0) return null;
    return new URLSearchParams(hash.slice(qIdx)).get(key);
}

/* ── Router ── */

let currentPage = null;

async function router() {
    const { page, params } = matchRoute(window.location.hash);

    const main = document.getElementById('main-content');
    if (!main) return;

    // Fade out
    main.style.opacity = '0';

    await new Promise(r => setTimeout(r, 120));

    // Render
    try {
        main.innerHTML = await page.render(params);
        if (page.afterRender) await page.afterRender(params);
    } catch (err) {
        console.error('Page render error:', err);
        main.innerHTML = `
            <div class="empty-state">
                <div class="empty-state__title">Oops!</div>
                <p class="empty-state__message">${err.message}</p>
                <a href="#/" class="btn-primary">Back to Home</a>
            </div>`;
    }

    currentPage = page;

    // Fade in
    main.style.opacity = '1';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update nav
    refreshNav();
}

/* ── Nav & Footer ── */

function refreshNav() {
    const nav = document.getElementById('global-nav');
    if (nav) {
        nav.innerHTML = renderNavbar();
        initNavbar();
    }
}

function renderFoot() {
    const footer = document.getElementById('site-footer');
    if (footer) footer.innerHTML = renderFooter();
}

/* ── Navigation ── */

export function navigateTo(path) {
    window.location.hash = `#/${path}`;
}

/* ── Toast Notifications ── */

export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('toast--visible'));
    });

    // Auto-dismiss
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ── Bootstrap ── */

document.addEventListener('DOMContentLoaded', () => {
    // Set default hash
    if (!window.location.hash || window.location.hash === '#') {
        window.location.hash = '#/';
    }

    // Style the main content for transitions
    const main = document.getElementById('main-content');
    if (main) {
        main.style.transition = 'opacity 0.12s ease';
    }

    // Initial render
    refreshNav();
    renderFoot();
    router();

    // Listen for hash changes
    window.addEventListener('hashchange', router);

    // Re-render nav on auth/cart state changes
    onAuthChange(() => refreshNav());
    onCartChange(() => refreshNav());
});
