package handlers

import (
	"ecommerce/internal/models"
	"ecommerce/internal/repositories"
	"encoding/json"
	"net/http"
	"strconv"
)

type ProductHandler struct {
	Repo *repositories.ProductRepository
}

func (h *ProductHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	products, err := h.Repo.GetAll(r.Context())
	if err != nil {
		http.Error(w, `{"error":"internal server error"}`, http.StatusInternalServerError)
		return
	}

	// Pastikan array kosong [] dikembalikan sebagai JSON array, bukan null
	if products == nil {
		products = []models.Product{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func (h *ProductHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	// Ambil ID dari URL (fitur Go 1.22+)
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, `{"error":"invalid product id"}`, http.StatusBadRequest)
		return
	}

	product, err := h.Repo.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, `{"error":"product not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
}