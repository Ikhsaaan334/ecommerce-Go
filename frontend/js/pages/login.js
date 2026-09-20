import { login } from '../auth.js';
import { navigateTo, showToast, getQueryParam } from '../app.js';

export const LoginPage = {
    render: () => {
        return `
            <section class="section section--parchment auth-page" style="min-height:80vh; display:flex; align-items:center; justify-content:center;">
                <div class="auth-card" style="background:#fff; padding:3rem; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.06); width:100%; max-width:400px;">
                    <h1 class="auth-card__title text-center" style="font-size:2rem; font-weight:600; margin-bottom:2rem;">Masuk</h1>
                    
                    <div id="login-error" class="form-error" style="color:#ff3b30; font-size:14px; margin-bottom:1rem; display:none; text-align:center;"></div>
                    
                    <form id="login-form" class="auth-card__form">
                        <div class="form-group" style="margin-bottom:1.5rem;">
                            <label class="form-label" style="display:block; margin-bottom:8px; font-weight:500;">Email</label>
                            <input type="email" id="email" class="form-input" required style="width:100%; padding:12px; border:1px solid #d2d2d7; border-radius:8px; font-size:16px; box-sizing:border-box;">
                        </div>
                        
                        <div class="form-group" style="margin-bottom:2rem;">
                            <label class="form-label" style="display:block; margin-bottom:8px; font-weight:500;">Password</label>
                            <input type="password" id="password" class="form-input" required style="width:100%; padding:12px; border:1px solid #d2d2d7; border-radius:8px; font-size:16px; box-sizing:border-box;">
                        </div>
                        
                        <button type="submit" class="btn-primary btn--full" style="width:100%; margin-bottom:1.5rem;">Masuk</button>
                    </form>
                    
                    <div class="auth-card__footer text-center" style="font-size:14px; color:#86868b;">
                        Belum punya akun? <a href="#/register" class="text-link">Daftar sekarang</a>
                    </div>
                </div>
            </section>
        `;
    },
    afterRender: () => {
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('login-error');
            
            try {
                await login(email, password);
                showToast('Login berhasil', 'success');
                
                const redirect = getQueryParam('redirect');
                if (redirect) {
                    navigateTo(redirect);
                } else {
                    navigateTo('');
                }
            } catch (error) {
                errorDiv.textContent = error.message || 'Login gagal. Periksa kembali email dan password Anda.';
                errorDiv.style.display = 'block';
            }
        });
    }
};
