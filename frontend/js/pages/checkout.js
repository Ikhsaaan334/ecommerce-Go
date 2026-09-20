import { getCart, getCartTotal, clearCart, saveOrder } from '../store.js';
import { api, formatPrice } from '../api.js';
import { isLoggedIn } from '../auth.js';
import { navigateTo, showToast } from '../app.js';

const SHIPPING_COST = 15000;

export const CheckoutPage = {
    render: () => {
        return `
            <section class="section section--parchment">
                <div class="container">
                    <div id="checkout-root"></div>
                </div>
            </section>`;
    },

    afterRender: () => {
        // Guards
        if (!isLoggedIn()) { navigateTo('login?redirect=checkout'); return; }
        const cart = getCart();
        if (cart.length === 0) { navigateTo('cart'); return; }

        const subtotal = getCartTotal();
        const total = subtotal + SHIPPING_COST;
        const root = document.getElementById('checkout-root');

        root.innerHTML = `
            <h1 class="checkout-page__title">Checkout</h1>
            <div class="checkout-page">
                <div>
                    <div class="order-summary" style="position:static;">
                        <h2 class="order-summary__title">Informasi Pengiriman</h2>
                        <form id="checkout-form">
                            <div class="form-group">
                                <label class="form-label" for="address">Alamat Pengiriman *</label>
                                <textarea id="address" class="form-textarea" required placeholder="Masukkan alamat lengkap pengiriman"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="notes">Catatan (Opsional)</label>
                                <textarea id="notes" class="form-textarea" placeholder="Catatan tambahan untuk pesanan"></textarea>
                            </div>
                            <div id="checkout-error" class="form-error" style="display:none;margin-bottom:16px;"></div>
                            <button type="submit" id="submit-btn" class="btn-primary btn--full">Buat Pesanan</button>
                        </form>
                    </div>
                </div>
                <div>
                    <div class="order-summary">
                        <h2 class="order-summary__title">Ringkasan Pesanan</h2>
                        ${cart.map(item => `
                            <div class="order-summary__item">
                                <span class="order-summary__item-qty">${item.quantity}×</span>
                                <span class="order-summary__item-name">${item.name}</span>
                                <span class="order-summary__item-price">${formatPrice(item.price * item.quantity)}</span>
                            </div>
                        `).join('')}
                        <div class="cart-summary__divider"></div>
                        <div class="cart-summary__row">
                            <span>Subtotal</span>
                            <span>${formatPrice(subtotal)}</span>
                        </div>
                        <div class="cart-summary__row">
                            <span>Pengiriman</span>
                            <span>${formatPrice(SHIPPING_COST)}</span>
                        </div>
                        <div class="cart-summary__divider"></div>
                        <div class="cart-summary__total">
                            <span>Total</span>
                            <span>${formatPrice(total)}</span>
                        </div>
                    </div>
                </div>
            </div>`;

        // Form submission
        document.getElementById('checkout-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const address = document.getElementById('address').value.trim();
            const notes = document.getElementById('notes').value.trim();
            const errorEl = document.getElementById('checkout-error');
            const submitBtn = document.getElementById('submit-btn');

            if (!address) {
                errorEl.textContent = 'Alamat pengiriman wajib diisi.';
                errorEl.style.display = 'block';
                return;
            }

            errorEl.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Memproses...';

            try {
                const payload = {
                    items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
                    shipping_cost: SHIPPING_COST,
                    notes: `${notes}\nAlamat: ${address}`,
                };
                const order = await api.post('/orders', payload);
                saveOrder(order);
                clearCart();
                showToast('Pesanan berhasil dibuat!', 'success');
                navigateTo('order/' + order.id);
            } catch (err) {
                errorEl.textContent = err.message || 'Gagal membuat pesanan.';
                errorEl.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Buat Pesanan';
                showToast(err.message || 'Gagal membuat pesanan.', 'error');
            }
        });
    }
};
