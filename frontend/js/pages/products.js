import { api } from '../api.js';
import { renderProductCard } from '../components/productCard.js';

export const ProductsPage = {
    render: () => {
        return `
            <section class="section section--parchment">
                <div class="container container--wide">
                    <div class="page-header">
                        <h1 class="page-header__title">Semua Produk</h1>
                        <div class="search-input-wrap" style="position:relative; display:inline-block; width:100%; max-width:300px;">
                            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#86868b;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <input type="text" id="product-search" class="search-input" placeholder="Cari produk..." style="padding-left:40px; width:100%; height:40px; border-radius:20px; border:1px solid #d2d2d7; outline:none; font-family:var(--font);">
                        </div>
                    </div>
                    
                    <div id="products-count" style="margin-bottom:20px; color:#86868b; font-size:14px;"></div>
                    
                    <div id="products-container">
                        <div class="loading">
                            <div class="loading__spinner"></div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },
    afterRender: async () => {
        const container = document.getElementById('products-container');
        const countDisplay = document.getElementById('products-count');
        const searchInput = document.getElementById('product-search');
        let allProducts = [];
        
        const renderGrid = (products) => {
            countDisplay.textContent = `Menampilkan ${products.length} produk`;
            
            if (products.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state__icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="48" height="48"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </div>
                        <h3 class="empty-state__title">Tidak ada produk ditemukan</h3>
                        <p class="empty-state__message">Coba kata kunci lain.</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = `<div class="product-grid">${products.map(p => renderProductCard(p)).join('')}</div>`;
        };
        
        try {
            allProducts = await api.get('/products');
            renderGrid(allProducts);
            
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
                renderGrid(filtered);
            });
        } catch (error) {
            container.innerHTML = '<p class="text-center" style="color:red;">Gagal memuat produk.</p>';
        }
    }
};
