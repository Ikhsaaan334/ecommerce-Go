package handlers

import (
	"database/sql"
	"ecommerce/internal/auth"
	"ecommerce/internal/models"
	"encoding/json"
	"net/http"
	"strings"
)

type AuthHandler struct {
	DB        *sql.DB
	JWTSecret string
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req models.AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid payload"}`, http.StatusBadRequest)
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	hash, err := auth.HashPassword(req.Password)
	if err != nil {
		http.Error(w, `{"error":"internal server error"}`, http.StatusInternalServerError)
		return
	}

	res, err := h.DB.Exec("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", req.Name, req.Email, hash)
	if err != nil {
		http.Error(w, `{"error":"email sudah terdaftar"}`, http.StatusConflict)
		return
	}

	id, _ := res.LastInsertId()
	token, _ := auth.GenerateToken(id, req.Email, "customer", h.JWTSecret)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.AuthResponse{
		Token: token,
		User:  models.User{ID: id, Name: req.Name, Email: req.Email, Role: "customer"},
	})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid payload"}`, http.StatusBadRequest)
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	var user models.User
	var hash string
	err := h.DB.QueryRow("SELECT id, name, email, role, password_hash FROM users WHERE email = ?", req.Email).
		Scan(&user.ID, &user.Name, &user.Email, &user.Role, &hash)

	if err != nil || !auth.CheckPasswordHash(req.Password, hash) {
		http.Error(w, `{"error":"email atau password salah"}`, http.StatusUnauthorized)
		return
	}

	token, _ := auth.GenerateToken(user.ID, user.Email, user.Role, h.JWTSecret)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.AuthResponse{Token: token, User: user})
}