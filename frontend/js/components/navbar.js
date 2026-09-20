import { isLoggedIn, getUser, logout } from '../auth.js';
import { getCartCount } from '../store.js';
import { navigateTo, showToast } from '../app.js';

const BAG_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`;

export function renderNavbar() {
    const loggedIn = isLoggedIn();
    const user = getUser();
    const cartCount = getCartCount();

    return `
        <div class="global-nav__inner">
            <a href="#/" class="global-nav__logo">TechStore</a>

            <div class="global-nav__links">
                <a href="#/" class="global-nav__link">Home</a>
                <a href="#/products" class="global-nav__link">Products</a>
                ${loggedIn ? `<a href="#/orders" class="global-nav__link">Orders</a>` : ''}
            </div>

            <div class="global-nav__actions">
                <a href="#/cart" class="global-nav__cart-btn">
                    ${BAG_ICON}
                    ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
                </a>

                ${loggedIn ? `
                    <span class="global-nav__user-name">${user?.name || ''}</span>
                    <button class="btn-dark-utility" id="logout-btn">Logout</button>
                ` : `
                    <a href="#/login" class="btn-dark-utility">Login</a>
                `}

                <button class="global-nav__hamburger" id="mobile-menu-btn" aria-label="Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>

        <div class="mobile-menu" id="mobile-menu">
            <a href="#/" class="mobile-menu__link">Home</a>
            <a href="#/products" class="mobile-menu__link">Products</a>
            <a href="#/cart" class="mobile-menu__link">Cart ${cartCount > 0 ? `(${cartCount})` : ''}</a>
            <div class="mobile-menu__divider"></div>
            ${loggedIn ? `
                <a href="#/orders" class="mobile-menu__link">My Orders</a>
                <div class="mobile-menu__divider"></div>
                <button class="mobile-menu__link" id="mobile-logout-btn" style="text-align:left;width:100%;cursor:pointer;">Logout</button>
            ` : `
                <a href="#/login" class="mobile-menu__link">Login</a>
                <a href="#/register" class="mobile-menu__link">Register</a>
            `}
        </div>
    `;
}

export function initNavbar() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('global-nav__hamburger--open');
            menu.classList.toggle('mobile-menu--open');
        });

        menu.querySelectorAll('a.mobile-menu__link').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('global-nav__hamburger--open');
                menu.classList.remove('mobile-menu--open');
            });
        });
    }

    const handleLogout = () => {
        logout();
        navigateTo('');
        showToast('Berhasil logout', 'info');
    };

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
}
