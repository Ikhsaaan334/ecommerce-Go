import { getCart, removeFromCart, updateCartQuantity, getCartTotal } from '../store.js';
import { formatPrice } from '../api.js';
import { renderCartItem } from '../components/cartItem.js';
import { navigateTo } from '../app.js';
import { isLoggedIn } from '../auth.js';

const SHIPPING_COST = 15000;

function renderCartContent() {
    const cart = getCart();

    if (cart.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                </div>
                <h2 class="empty-state__title">Keranjang Kosong</h2>
                <p class="empty-state__message">Anda belum menambahkan produk apapun ke keranjang.</p>
                <a href="#/products" class="btn-primary">Mulai Belanja</a>
            </div>`;
    }

    const subtotal = getCartTotal();
    const total = subtotal + SHIPPING_COST;

    return `
        <h1 class="cart-page__title">Keranjang Belanja</h1>
        <div class="cart-page">
            <div class="cart-items" id="cart-items-list">
                ${cart.map(item => renderCartItem(item)).join('')}
            </div>
            <div>
                <div class="cart-summary">
                    <h2 class="cart-summary__title">Ringkasan Belanja</h2>
                    <div class="cart-summary__row">
                        <span>Subtotal (${cart.reduce((s, i) => s + i.quantity, 0)} item)</span>
                        <span>${formatPrice(subtotal)}</span>
                    </div>
                    <div class="cart-summary__row">
                        <span>Biaya Pengiriman</span>
                        <span>${formatPrice(SHIPPING_COST)}</span>
                    </div>
                    <div class="cart-summary__divider"></div>
                    <div class="cart-summary__total">
                        <span>Total</span>
                        <span>${formatPrice(total)}</span>
                    </div>
                    <div class="cart-summary__actions">
                        <button id="checkout-btn" class="btn-primary btn--full">Checkout</button>
                        <a href="#/products" class="btn-secondary-pill btn--full" style="text-align:center;">Lanjut Belanja</a>
                    </div>
                </div>
            </div>
        </div>`;
}

export const CartPage = {
    render: () => {
        return `
            <section class="section section--parchment">
                <div class="container">
                    <div id="cart-root">${renderCartContent()}</div>
                </div>
            </section>`;
    },

    afterRender: () => {
        attachCartEvents();
    }
};

function reRenderCart() {
    const root = document.getElementById('cart-root');
    if (root) {
        root.innerHTML = renderCartContent();
        attachCartEvents();
    }
}

function attachCartEvents() {
    const list = document.getElementById('cart-items-list');
    if (list) {
        list.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;

            const productId = parseInt(btn.dataset.productId, 10);
            const action = btn.dataset.action;
            const cart = getCart();
            const item = cart.find(i => i.product_id === productId);
            if (!item) return;

            if (action === 'minus' && item.quantity > 1) {
                updateCartQuantity(productId, item.quantity - 1);
            } else if (action === 'plus') {
                updateCartQuantity(productId, item.quantity + 1);
            } else if (action === 'remove') {
                removeFromCart(productId);
            }

            reRenderCart();
        });
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (isLoggedIn()) {
                navigateTo('checkout');
            } else {
                navigateTo('login?redirect=checkout');
            }
        });
    }
}
