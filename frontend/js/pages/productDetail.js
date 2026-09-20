import { api, formatPrice, getImageUrl } from '../api.js';
import { addToCart } from '../store.js';
import { navigateTo, showToast } from '../app.js';

export const ProductDetailPage = {
    render: (params) => {
        return `
            <section class="section section--light">
                <div class="container">
                    <div style="margin-bottom:20px;">
                        <a href="#/products" class="text-link">← Kembali ke Produk</a>
                    </div>
                    
                    <div id="product-detail-container">
                        <div class="loading">
                            <div class="loading__spinner"></div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },
    afterRender: async (params) => {
        const container = document.getElementById('product-detail-container');
        try {
            const product = await api.get(`/products/${params.id}`);
            
            const isOutOfStock = product.stock === 0;
            const isLowStock = product.stock > 0 && product.stock <= 5;
            
            let stockDotClass = 'product-detail__stock-dot';
            let stockText = 'In Stock';
            if (isOutOfStock) {
                stockDotClass += ' product-detail__stock-dot--out';
                stockText = 'Out of Stock';
            } else if (isLowStock) {
                stockDotClass += ' product-detail__stock-dot--low';
                stockText = 'Low Stock';
            }
            
            container.innerHTML = `
                <div class="product-detail">
                    <div class="product-detail__image-wrap">
                        <img src="${getImageUrl(product.image_url)}" alt="${product.name}" class="product-detail__image" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                        <div class="product-detail__placeholder" style="display:none; justify-content:center; align-items:center; background:#f5f5f7; width:100%; height:100%; min-height:400px; border-radius:16px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="80" height="80" style="color:#d2d2d7;"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                        </div>
                    </div>
                    
                    <div class="product-detail__info">
                        <div class="product-detail__category">Category ${product.category_id}</div>
                        <h1 class="product-detail__name" style="font-size:2.5rem; font-weight:600; margin-bottom:1rem;">${product.name}</h1>
                        <div class="product-detail__price">${formatPrice(product.price)}</div>
                        
                        <p class="product-detail__description">${product.description}</p>
                        
                        <div class="product-detail__stock" style="display:flex; align-items:center; gap:8px; margin-bottom:2rem;">
                            <span class="${stockDotClass}" style="width:10px; height:10px; border-radius:50%; display:inline-block; background:${isOutOfStock ? '#ff3b30' : (isLowStock ? '#ff9500' : '#34c759')};"></span>
                            ${stockText} (${product.stock} available)
                        </div>
                        
                        <div class="product-detail__actions">
                            <div class="product-detail__quantity" style="margin-bottom:1.5rem;">
                                <label style="display:block; margin-bottom:8px; font-weight:500;">Quantity</label>
                                <div class="quantity-control" style="display:inline-flex;">
                                    <button type="button" class="quantity-control__btn" id="qty-minus" ${isOutOfStock ? 'disabled' : ''}>-</button>
                                    <span class="quantity-control__value" id="qty-val">1</span>
                                    <button type="button" class="quantity-control__btn" id="qty-plus" ${isOutOfStock ? 'disabled' : ''}>+</button>
                                </div>
                            </div>
                            
                            <div class="product-detail__btn-row" style="display:flex; gap:1rem;">
                                <button id="add-to-cart-btn" class="btn-primary" style="flex:1;" ${isOutOfStock ? 'disabled' : ''}>Add to Cart</button>
                                <button id="buy-now-btn" class="btn-secondary-pill" style="flex:1;" ${isOutOfStock ? 'disabled' : ''}>Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            if (!isOutOfStock) {
                let qty = 1;
                const qtyVal = document.getElementById('qty-val');
                
                document.getElementById('qty-minus').addEventListener('click', () => {
                    if (qty > 1) {
                        qty--;
                        qtyVal.textContent = qty;
                    }
                });
                
                document.getElementById('qty-plus').addEventListener('click', () => {
                    if (qty < product.stock) {
                        qty++;
                        qtyVal.textContent = qty;
                    }
                });
                
                document.getElementById('add-to-cart-btn').addEventListener('click', () => {
                    addToCart(product, qty);
                    showToast('Ditambahkan ke keranjang', 'success');
                });
                
                document.getElementById('buy-now-btn').addEventListener('click', () => {
                    addToCart(product, qty);
                    navigateTo('cart');
                });
            }
            
        } catch (error) {
            container.innerHTML = '<p style="color:red;">Produk tidak ditemukan.</p>';
        }
    }
};
