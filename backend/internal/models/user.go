package models

type User struct{
	ID int64 `json:"id"`
	Name string `json:"name"`
	Email string `json:"email"`
	PasswordHash string `json:"-"` // Exclude password hash from JSON responses
	Role string `json:"role"`
}

type AuthRequest struct{
	Name string `json:"name,omitempty"` // Used for registration
	Email string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct{
	Token string `json:"token"`
	User User `json:"user"`
}