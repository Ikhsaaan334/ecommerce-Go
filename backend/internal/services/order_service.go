package services

import(
	"ecommerce/internal/models"
	"ecommerce/internal/repositories"
	"context"
	"errors"
)

type OrderService struct{
	Repo *repositories.OrderRepository
}

func (s *OrderService) Checkout(ctx context.Context, userID int64, req models.CheckoutRequest) (*models.Order, error){
	if len(req.Items) == 0{
		return nil, errors.New("Cart is empty")
	}

	for _, item := range req.Items{
		if item.Quantity <= 0{
			return nil, errors.New("Quantity must be more than 0")
		}
	}

	order := &models.Order{
		UserID: userID,
		ShippingCost: req.ShippingCost,
		Notes: req.Notes,
		Items: req.Items,
	}

	err := s.Repo.CreateTransaction(ctx, order)
	if err != nil{
		return nil, err
	}
	return order, nil
}

func (s *OrderService) SkipPayment(ctx context.Context, orderID, userID int64) error{
	return s.Repo.UpdateStatus(ctx, orderID, userID, "payment_skipped")
}