package handlers

import(
	"ecommerce/internal/middleware"
	"ecommerce/internal/models"
	"ecommerce/internal/services"
	"encoding/json"
	"net/http"
	"strconv"
)

type OrderHandler struct{
	OrderService *services.OrderService
}

func (h *OrderHandler) Checkout(w http.ResponseWriter, r *http.Request){

	userID := r.Context().Value(middleware.UserIDKey).(int64)

	var req models.CheckoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err!= nil{
		http.Error(w, `{"error":"invalid payload"}`, http.StatusBadRequest)
		return
	}

	order, err := h.OrderService.Checkout(r.Context(), userID, req)
	if err!= nil{
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(order)
}

func (h *OrderHandler) SkipPayment(w http.ResponseWriter, r *http.Request){
	userID := r.Context().Value(middleware.UserIDKey).(int64)
	orderID, _ := strconv.ParseInt(r.PathValue("id"), 10, 64)

	err := h.OrderService.SkipPayment(r.Context(), orderID, userID)
	if err != nil{
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message":"Payment skipped successfully", "status":"payment_skipped"}`))
}