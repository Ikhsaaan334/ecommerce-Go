import { getOrders } from '../store.js';
import { formatPrice } from '../api.js';
import { isLoggedIn } from '../auth.js';
import { navigateTo } from '../app.js';

export const OrdersPage = {
    render: () => {
        return `
            <section class="section section--parchment">
                <div class="container" id="orders-content"></div>
            </section>
        `;
    },
    afterRender: () => {
        if (!isLoggedIn()) {
            navigateTo('login?redirect=orders');
            return;
        }
        
        const container = document.getElementById('orders-content');
        const orders = getOrders();
        
        if (!orders || orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="64" height="64"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    </div>
                    <h2 class="empty-state__title">Belum ada pesanan</h2>
                    <p class="empty-state__message">Anda belum membuat pesanan apapun.</p>
                    <a href="#/products" class="btn-primary" style="margin-top:20px; display:inline-block;">Mulai Belanja</a>
                </div>
            `;
            return;
        }
        
        // Sort orders by ID descending
        const sortedOrders = [...orders].sort((a, b) => b.id - a.id);
        
        const getStatusBadge = (status) => {
            if (status === 'pending_payment') return '<span class="order-status order-status--pending" style="background:#fff8e1; color:#f57f17; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:600;">Menunggu Pembayaran</span>';
            if (status === 'paid') return '<span class="order-status order-status--paid" style="background:#e8f5e9; color:#2e7d32; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:600;">Lunas</span>';
            if (status === 'payment_skipped') return '<span class="order-status order-status--payment_skipped" style="background:#e3f2fd; color:#1565c0; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:600;">Pembayaran Dilewati</span>';
            if (status === 'cancelled') return '<span class="order-status order-status--cancelled" style="background:#ffebee; color:#c62828; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:600;">Dibatalkan</span>';
            return `<span class="order-status">${status}</span>`;
        };
        
        container.innerHTML = `
            <div class="page-header" style="margin-bottom:3rem;">
                <h1 class="page-header__title" style="font-size:2.5rem; font-weight:600;">Daftar Pesanan</h1>
            </div>
            
            <div class="orders-list" style="display:flex; flex-direction:column; gap:1.5rem;">
                ${sortedOrders.map(order => `
                    <div class="order-list-card" style="background:#fff; border-radius:12px; padding:1.5rem; box-shadow:0 2px 8px rgba(0,0,0,0.04); display:flex; flex-wrap:wrap; gap:1.5rem; align-items:center;">
                        <div style="flex:1; min-width:200px;">
                            <div style="font-size:12px; color:#86868b; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Order ID</div>
                            <div class="order-card__id" style="font-weight:600; font-size:1.1rem; margin-bottom:8px;">#${order.id}</div>
                            <div>${getStatusBadge(order.status)}</div>
                        </div>
                        
                        <div style="flex:2; min-width:250px;">
                            <div style="color:#86868b; font-size:14px; margin-bottom:4px;">Item (${order.items.length})</div>
                            <div style="display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; font-size:14px; font-weight:500;">
                                ${order.items.map(i => i.name).join(', ')}
                            </div>
                        </div>
                        
                        <div style="min-width:120px; text-align:right;">
                            <div style="font-size:12px; color:#86868b; margin-bottom:4px;">Total</div>
                            <div style="font-weight:600; font-size:1.1rem;">${formatPrice(order.total)}</div>
                        </div>
                        
                        <div style="margin-left:auto;">
                            <a href="#/order/${order.id}" class="btn-primary" style="padding:8px 16px; font-size:14px;">Detail</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};
