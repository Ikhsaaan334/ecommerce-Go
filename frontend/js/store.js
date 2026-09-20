/**
 * Client-side store for cart items and order history.
 * Cart is managed entirely in localStorage because the backend
 * has no server-side cart endpoints.
 */

const CART_KEY = 'cart_items';
const ORDERS_KEY = 'order_history';

let cartListeners = [];

/* ─────────────────────────────────────
   CART
   ───────────────────────────────────── */

export function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    notifyCart();
}

export function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.product_id === product.id);

    if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
        cart.push({
            product_id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: Math.min(quantity, product.stock),
            stock: product.stock,
        });
    }

    saveCart(cart);
}

export function removeFromCart(productId) {
    saveCart(getCart().filter(item => item.product_id !== productId));
}

export function updateCartQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(i => i.product_id === productId);
    if (!item) return;

    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    item.quantity = Math.min(quantity, item.stock);
    saveCart(cart);
}

export function clearCart() {
    localStorage.removeItem(CART_KEY);
    notifyCart();
}

export function getCartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/* ─────────────────────────────────────
   ORDER HISTORY (client-side cache)
   ───────────────────────────────────── */

export function getOrders() {
    try {
        return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    } catch {
        return [];
    }
}

export function saveOrder(order) {
    const orders = getOrders();
    // Avoid duplicates
    const idx = orders.findIndex(o => o.id === order.id);
    if (idx >= 0) {
        orders[idx] = order;
    } else {
        orders.unshift(order);
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getOrder(id) {
    return getOrders().find(o => o.id === Number(id)) || null;
}

export function updateOrderStatus(id, status) {
    const orders = getOrders();
    const order = orders.find(o => o.id === Number(id));
    if (order) {
        order.status = status;
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
}

/* ─────────────────────────────────────
   CART OBSERVER
   ───────────────────────────────────── */

export function onCartChange(callback) {
    cartListeners.push(callback);
    return () => {
        cartListeners = cartListeners.filter(l => l !== callback);
    };
}

function notifyCart() {
    const cart = getCart();
    const count = getCartCount();
    cartListeners.forEach(cb => {
        try { cb(cart, count); } catch (e) { console.error(e); }
    });
}
