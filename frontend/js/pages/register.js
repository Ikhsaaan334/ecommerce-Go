import { register } from '../auth.js';
import { navigateTo, showToast } from '../app.js';

export const RegisterPage = {
    render: () => {
        return `
            <section class="section section--parchment auth-page" style="min-height:80vh; display:flex; align-items:center; justify-content:center; padding:2rem 0;">
                <div class="auth-card" style="background:#fff; padding:3rem; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.06); width:100%; max-width:400px;">
                    <h1 class="auth-card__title text-center" style="font-size:2rem; font-weight:600; margin-bottom:2rem;">Daftar</h1>
                    
                    <div id="register-error" class="form-error" style="color:#ff3b30; font-size:14px; margin-bottom:1rem; display:none; text-align:center;"></div>
                    
                    <form id="register-form" class="auth-card__form">
                        <div class="form-group" style="margin-bottom:1.5rem;">
                            <label class="form-label" style="display:block; margin-bottom:8px; font-weight:500;">Nama Lengkap</label>
                            <input type="text" id="name" class="form-input" required style="width:100%; padding:12px; border:1px solid #d2d2d7; border-radius:8px; font-size:16px; box-sizing:border-box;">
                        </div>
                        
                        <div class="form-group" style="margin-bottom:1.5rem;">
                            <label class="form-label" style="display:block; margin-bottom:8px; font-weight:500;">Email</label>
                            <input type="email" id="email" class="form-input" required style="width:100%; padding:12px; border:1px solid #d2d2d7; border-radius:8px; font-size:16px; box-sizing:border-box;">
                        </div>
                        
                        <div class="form-group" style="margin-bottom:1.5rem;">
                            <label class="form-label" style="display:block; margin-bottom:8px; font-weight:500;">Password</label>
                            <input type="password" id="password" class="form-input" required minlength="6" style="width:100%; padding:12px; border:1px solid #d2d2d7; border-radius:8px; font-size:16px; box-sizing:border-box;">
                        </div>
                        
                        <div class="form-group" style="margin-bottom:2rem;">
                            <label class="form-label" style="display:block; margin-bottom:8px; font-weight:500;">Konfirmasi Password</label>
                            <input type="password" id="confirm-password" class="form-input" required style="width:100%; padding:12px; border:1px solid #d2d2d7; border-radius:8px; font-size:16px; box-sizing:border-box;">
                        </div>
                        
                        <button type="submit" class="btn-primary btn--full" style="width:100%; margin-bottom:1.5rem;">Daftar</button>
                    </form>
                    
                    <div class="auth-card__footer text-center" style="font-size:14px; color:#86868b;">
                        Sudah punya akun? <a href="#/login" class="text-link">Masuk di sini</a>
                    </div>
                </div>
            </section>
        `;
    },
    afterRender: () => {
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorDiv = document.getElementById('register-error');
            
            if (password !== confirmPassword) {
                errorDiv.textContent = 'Password tidak cocok.';
                errorDiv.style.display = 'block';
                return;
            }
            
            try {
                await register(name, email, password);
                showToast('Pendaftaran berhasil! Selamat datang.', 'success');
                navigateTo('');
            } catch (error) {
                errorDiv.textContent = error.message || 'Pendaftaran gagal. Silakan coba lagi.';
                errorDiv.style.display = 'block';
            }
        });
    }
};
