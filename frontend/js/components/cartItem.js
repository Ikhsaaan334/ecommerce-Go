import { formatPrice, getImageUrl } from '../api.js';

export function renderCartItem(item) {
    return `
        <div class="cart-item">
            <div style="display:flex; align-items:center; gap:1rem;">
                <img src="${getImageUrl(item.image_url)}" alt="${item.name}" class="cart-item__image" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                <div class="cart-item__image-placeholder" style="display:none; justify-content:center; align-items:center; background:#f5f5f7; width:80px; height:80px; border-radius:8px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" style="color:#d2d2d7;"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                </div>
                
                <div class="cart-item__info">
                    <div class="cart-item__name">${item.name}</div>
                    <div class="cart-item__price">${formatPrice(item.price)}</div>
                    
                    <div class="cart-item__controls">
                        <div class="quantity-control">
                            <button class="quantity-control__btn" data-action="minus" data-product-id="${item.product_id}">-</button>
                            <span class="quantity-control__value">${item.quantity}</span>
                            <button class="quantity-control__btn" data-action="plus" data-product-id="${item.product_id}">+</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="cart-item__right">
                <div class="cart-item__subtotal">${formatPrice(item.price * item.quantity)}</div>
                <button class="cart-item__remove" data-action="remove" data-product-id="${item.product_id}">Remove</button>
            </div>
        </div>
    `;
}
