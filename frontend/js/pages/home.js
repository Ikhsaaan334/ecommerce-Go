import { api } from '../api.js';
import { renderProductCard } from '../components/productCard.js';

export const HomePage = {
    render: () => {
        return `
            <section class="hero section section--dark" style="background-image: url('images/hero-bg.jpg'); background-size: cover; background-position: center; min-height: 80vh; display: flex; align-items: center; position: relative;">
                <div class="container hero__content" style="position: relative; z-index: 1;">
                    <div class="hero__eyebrow">TECHSTORE</div>
                    <h1 class="hero__title">Temukan Teknologi Premium.</h1>
                    <p class="hero__tagline">Produk terbaik untuk gaya hidup digital Anda.</p>
                    <div class="hero__ctas">
                        <a href="#/products" class="btn-primary">Jelajahi Produk</a>
                        <a href="#/products" class="btn-secondary-pill btn-secondary-pill--on-dark">Mulai Belanja</a>
                    </div>
                </div>
            </section>
            
            <section class="section section--parchment">
                <div class="container container--wide">
                    <h2 class="section__title text-center">Produk Kami</h2>
                    <p class="section__subtitle text-center">Pilihan terbaik untuk kebutuhan teknologi Anda</p>
                    
                    <div id="home-products-container">
                        <div class="loading">
                            <div class="loading__spinner"></div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },
    afterRender: async () => {
        const container = document.getElementById('home-products-container');
        if (!container) return;
        
        try {
            const products = await api.get('/products');
            
            if (!products || products.length === 0) {
                container.innerHTML = '<p class="text-center">Belum ada produk.</p>';
                return;
            }
            
            const productsHtml = products.slice(0, 8).map(p => renderProductCard(p)).join('');
            container.innerHTML = `<div class="product-grid">${productsHtml}</div>`;
        } catch (error) {
            container.innerHTML = '<p class="text-center" style="color:red;">Gagal memuat produk.</p>';
            console.error('Error fetching home products:', error);
        }
    }
};
