package main

import (
	"context"
	"ecommerce/internal/config"
	"ecommerce/internal/database"
	"ecommerce/internal/handlers"
	"ecommerce/internal/repositories"
	"ecommerce/internal/router"
	"ecommerce/internal/services"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

func main() {
	cfg := config.Load()

	db, err := database.InitDB(cfg.DBPath)
	if err != nil {
		log.Fatalf("Gagal inisialisasi database: %v", err)
	}
	defer db.Close()

	// Repositories
	orderRepo := &repositories.OrderRepository{DB: db}
	productRepo := &repositories.ProductRepository{DB: db} // TAMBAHKAN INI

	// Services
	orderSvc := &services.OrderService{Repo: orderRepo}
	invoiceSvc := &services.InvoiceService{InvoiceDir: cfg.InvoiceDir}

	// Handlers
	authH := &handlers.AuthHandler{DB: db, JWTSecret: cfg.JWTSecret}
	orderH := &handlers.OrderHandler{OrderService: orderSvc}
	invoiceH := &handlers.InvoiceHandler{InvoiceService: invoiceSvc}
	productH := &handlers.ProductHandler{Repo: productRepo} // TAMBAHKAN INI

	// Masukkan productH ke dalam parameter Setup
	r := router.Setup(cfg, authH, productH, orderH, invoiceH)

	srv := &http.Server{
		Addr:    ":" + cfg.AppPort,
		Handler: r,
	}

	go func() {
		log.Printf("Server berjalan di http://localhost:%s", cfg.AppPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("Mematikan server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	log.Println("Server dihentikan dengan aman.")
}