package models

type Order struct{
	ID int64 `json:"id"`
	UserID int64 `json:"user_id"`
	Status string `json:"status"` // e.g., "pending", "completed", "canceled", "paid"
	Subtotal int64 `json:"subtotal"`
	ShippingCost int64 `json:"shipping_cost"`
	Total int64 `json:"total"`
	Notes string `json:"notes"`
	Items []OrderItem `json:"items"`
}

type OrderItem struct{
	ID int64 `json:"id"`
	OrderID int64 `json:"order_id,omitempty"`
	ProductID int64 `json:"product_id"`
	Name string `json:"name"`
	Price int64 `json:"price"`
	Quantity int `json:"quantity"`
}

type CheckoutRequest struct{
	Items []OrderItem `json:"items"`
	ShippingCost int64 `json:"shipping_cost"`
	Notes string `json:"notes"`
}