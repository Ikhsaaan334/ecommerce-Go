package router

import (
	"ecommerce/internal/config"
	"ecommerce/internal/handlers"
	"ecommerce/internal/middleware"
	"net/http"
)

// Wrapper CORS sederhana
func WithCORS(origin string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Gunakan langsung pointer dari handlers, bukan http.Handler
func Setup(cfg *config.Config, authH *handlers.AuthHandler, productH *handlers.ProductHandler, orderH *handlers.OrderHandler, invoiceH *handlers.InvoiceHandler) http.Handler {
	mux := http.NewServeMux()

	// Public Routes
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"status":"OK"}`))
	})
	
	// Auth Routes
	mux.HandleFunc("POST /api/auth/register", authH.Register)
	mux.HandleFunc("POST /api/auth/login", authH.Login)

	// Product Routes
	mux.HandleFunc("GET /api/products", productH.GetAll)
	mux.HandleFunc("GET /api/products/{id}", productH.GetByID)

	// Protected Routes (Butuh Login)
	protectedMux := http.NewServeMux()
	protectedMux.HandleFunc("POST /api/orders", orderH.Checkout)
	protectedMux.HandleFunc("POST /api/orders/{id}/skip-payment", orderH.SkipPayment)
	protectedMux.HandleFunc("GET /api/orders/{id}/invoice", invoiceH.Download)

	// Mount protected routes ke main mux dengan middleware auth
	authMid := middleware.AuthMiddleware(cfg.JWTSecret)
	mux.Handle("/api/orders", authMid(protectedMux))
	mux.Handle("/api/orders/", authMid(protectedMux))

	return WithCORS(cfg.FrontendOrigin, mux)
}