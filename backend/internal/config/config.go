package config

import(
	"os"
	"github.com/joho/godotenv"
)

type Config struct{
	AppPort string
	DBPath string
	FrontendOrigin string
	InvoiceDir string
	JWTSecret string
}

func Load()* Config{
	_ = godotenv.Load()
	return &Config{
		AppPort: getEnv("APP_PORT", "8080"),
		DBPath: getEnv("DATABASE_PATH", "./data/ecommerce.db"),
		FrontendOrigin: getEnv("FRONTEND_ORIGIN", "http://localhost:3000"),
		InvoiceDir: getEnv("INVOICE_DIR", "./storage/invoices"),
		JWTSecret: getEnv("JWT_SECRET", "default_secret"),
	}
}

func getEnv(key, fallback string) string{
	if value, exists := os.LookupEnv(key); exists{
		return value
	}
	return fallback
}