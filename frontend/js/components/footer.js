export function renderFooter() {
    return `
        <div class="footer__inner container">
            <div class="footer__columns">
                <div class="footer__column">
                    <h4 class="footer__heading">Shop</h4>
                    <a href="#/products" class="footer__link">All Products</a>
                    <a href="#/products" class="footer__link">Featured</a>
                </div>
                <div class="footer__column">
                    <h4 class="footer__heading">Account</h4>
                    <a href="#/login" class="footer__link">Sign In</a>
                    <a href="#/register" class="footer__link">Register</a>
                    <a href="#/orders" class="footer__link">My Orders</a>
                </div>
                <div class="footer__column">
                    <h4 class="footer__heading">Support</h4>
                    <a href="#" class="footer__link">Contact Us</a>
                    <a href="#" class="footer__link">FAQ</a>
                    <a href="#" class="footer__link">Shipping Info</a>
                </div>
                <div class="footer__column">
                    <h4 class="footer__heading">Company</h4>
                    <a href="#" class="footer__link">About Us</a>
                    <a href="#" class="footer__link">Privacy Policy</a>
                    <a href="#" class="footer__link">Terms of Service</a>
                </div>
            </div>
            <div class="footer__divider"></div>
            <div class="footer__legal">
                Copyright &copy; 2024 TechStore. All rights reserved.
            </div>
        </div>
    `;
}
