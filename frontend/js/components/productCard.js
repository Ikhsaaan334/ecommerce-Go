import { formatPrice, getImageUrl } from '../api.js';

export function renderProductCard(product) {
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const isOutOfStock = product.stock === 0;
    
    let stockStatusText = 'In Stock';
    let stockClass = 'product-card__stock';
    if (isOutOfStock) {
        stockStatusText = 'Out of Stock';
    } else if (isLowStock) {
        stockStatusText = 'Low Stock';
        stockClass += ' product-card__stock--low';
    }
    
    return `
        <a href="#/product/${product.id}" class="product-card" style="text-decoration:none;color:inherit;">
            <div class="product-card__image-wrap">
                <img src="${getImageUrl(product.image_url)}" alt="${product.name}" class="product-card__image" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                <div class="product-card__placeholder" style="display:none; justify-content:center; align-items:center; background:#f5f5f7; height:100%;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="48" height="48" style="color:#d2d2d7;"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                </div>
            </div>
            <div class="product-card__info">
                <h3 class="product-card__name">${product.name}</h3>
                <p class="product-card__description" style="display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${product.description}</p>
                <div class="product-card__price">${formatPrice(product.price)}</div>
                <div class="${stockClass}">${stockStatusText}</div>
                <button class="btn-primary btn--sm" style="margin-top:1rem; width:100%; pointer-events:none;">View Details</button>
            </div>
        </a>
    `;
}
