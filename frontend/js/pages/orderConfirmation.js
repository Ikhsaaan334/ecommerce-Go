import { getOrder, updateOrderStatus } from '../store.js';
import { api, formatPrice } from '../api.js';
import { navigateTo, showToast } from '../app.js';

export const OrderConfirmationPage = {
    render: (params) => {
        return `
            <section class="section section--parchment">
                <div class="container" id="order-confirm-content">
                    <div class="loading"><div class="loading__spinner"></div></div>
                </div>
            </section>
        `;
    },
    afterRender: async (params) => {
        const container = document.getElementById('order-confirm-content');
        const order = getOrder(parseInt(params.id, 10));
        
        if (!order) {
            container.innerHTML = `
                <div class="text-center">
                    <h2 style="margin-bottom:1rem;">Pesanan tidak ditemukan</h2>
                    <a href="#/orders" class="text-link">Kembali ke Daftar Pesanan</a>
                </div>
            `;
            return;
        }
        
        const renderOrderDetails = () => {
            let statusBadge = '';
            if (order.status === 'pending_payment') statusBadge = '<span class="order-status order-status--pending" style="background:#fff8e1; color:#f57f17; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:600;">Menunggu Pembayaran</span>';
            else if (order.status === 'paid') statusBadge = '<span class="order-status order-status--paid" style="background:#e8f5e9; color:#2e7d32; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:600;">Lunas</span>';
            else if (order.status === 'payment_skipped') statusBadge = '<span class="order-status order-status--payment_skipped" style="background:#e3f2fd; color:#1565c0; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:600;">Pembayaran Dilewati</span>';
            else statusBadge = `<span class="order-status">${order.status}</span>`;

            container.innerHTML = `
                <div class="order-page" style="max-width:800px; margin:0 auto;">
                    <div class="text-center" style="margin-bottom:3rem;">
                        <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; background:#34c759; color:white; border-radius:50%; margin-bottom:1rem;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h1 class="order-page__title" style="font-size:2.5rem; font-weight:600; margin-bottom:0.5rem;">Pesanan Berhasil!</h1>
                        <p class="order-page__subtitle" style="color:#86868b; font-size:1.1rem;">Terima kasih atas pesanan Anda.</p>
                    </div>
                    
                    <div class="order-card" style="background:#fff; border-radius:16px; box-shadow:0 4px 12px rgba(0,0,0,0.05); overflow:hidden;">
                        <div class="order-card__header" style="background:#f5f5f7; padding:1.5rem 2rem; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <div style="font-size:12px; color:#86868b; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Order ID</div>
                                <div class="order-card__id" style="font-weight:600; font-size:1.1rem;">#${order.id}</div>
                            </div>
                            <div>${statusBadge}</div>
                        </div>
                        
                        <div class="order-card__items" style="padding:2rem;">
                            <h3 style="font-size:1.1rem; font-weight:600; margin-bottom:1rem;">Item Pesanan</h3>
                            ${order.items.map(item => `
                                <div class="order-card__item" style="display:flex; justify-content:space-between; margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid #f5f5f7;">
                                    <div style="flex:1;">
                                        <div style="font-weight:500;">${item.name}</div>
                                        <div style="color:#86868b; font-size:14px;">Qty: ${item.quantity} &times; ${formatPrice(item.price)}</div>
                                    </div>
                                    <div style="font-weight:600;">${formatPrice(item.price * item.quantity)}</div>
                                </div>
                            `).join('')}
                            
                            <div class="order-card__totals" style="margin-top:2rem; width:100%; max-width:300px; margin-left:auto;">
                                <div class="order-card__total-row" style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px;">
                                    <span style="color:#86868b;">Subtotal</span>
                                    <span>${formatPrice(order.subtotal)}</span>
                                </div>
                                <div class="order-card__total-row" style="display:flex; justify-content:space-between; margin-bottom:16px; font-size:14px;">
                                    <span style="color:#86868b;">Biaya Pengiriman</span>
                                    <span>${formatPrice(order.shipping_cost)}</span>
                                </div>
                                <div class="order-card__total-row order-card__total-row--grand" style="display:flex; justify-content:space-between; font-weight:600; font-size:1.2rem; border-top:1px solid #e5e5ea; padding-top:16px;">
                                    <span>Total</span>
                                    <span>${formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-page__actions" style="margin-top:3rem; display:flex; flex-direction:column; gap:1rem; align-items:center;">
                        ${order.status === 'pending_payment' ? 
                            `<button id="skip-payment-btn" class="btn-primary" style="width:100%; max-width:300px;">Skip Payment</button>` : 
                            `<button id="download-invoice-btn" class="btn-primary" style="width:100%; max-width:300px;">Download Invoice</button>`
                        }
                        
                        <div style="display:flex; gap:1.5rem; margin-top:1rem;">
                            <a href="#/orders" class="text-link">View All Orders</a>
                            <a href="#/products" class="text-link">Continue Shopping</a>
                        </div>
                    </div>
                </div>
            `;
            
            const skipBtn = document.getElementById('skip-payment-btn');
            if (skipBtn) {
                skipBtn.addEventListener('click', async () => {
                    try {
                        await api.post(`/orders/${order.id}/skip-payment`);
                        updateOrderStatus(order.id, 'payment_skipped');
                        order.status = 'payment_skipped';
                        showToast('Status pembayaran diperbarui', 'success');
                        renderOrderDetails();
                    } catch (err) {
                        showToast('Gagal melewati pembayaran', 'error');
                    }
                });
            }
            
            const dlBtn = document.getElementById('download-invoice-btn');
            if (dlBtn) {
                dlBtn.addEventListener('click', async () => {
                    try {
                        const data = await api.get(`/orders/${order.id}/invoice`);
                        const blob = new Blob([data._html], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `invoice-${order.id}.html`;
                        a.click();
                        URL.revokeObjectURL(url);
                    } catch (err) {
                        showToast('Gagal mengunduh invoice', 'error');
                    }
                });
            }
        };
        
        renderOrderDetails();
    }
};
