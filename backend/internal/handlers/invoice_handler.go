package handlers

import(
	"ecommerce/internal/middleware"
	"ecommerce/internal/services"
	"net/http"
	"strconv"
)

type InvoiceHandler struct{
	InvoiceService *services.InvoiceService
	// Tambahkan pengecekan database disini jika ingin strict rules, misalnya jika invoice sudah dibayar tidak bisa diubah

}

func (h *InvoiceHandler) Download(w http.ResponseWriter, r *http.Request){
	_ = r.Context().Value(middleware.UserIDKey).(int64)
	orderID, _ := strconv.ParseInt(r.PathValue("id"), 10, 64)

	filePath, err := h.InvoiceService.GenerateInvoiceHTML(orderID)
	if err != nil{
		http.Error(w, `{"error":"Gagal membuat invoice"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Disposition", "attachment; filename=invoice-"+strconv.FormatInt(orderID, 10)+".html")
	w.Header().Set("Content-Type", "text/html")
	http.ServeFile(w, r, filePath)
}