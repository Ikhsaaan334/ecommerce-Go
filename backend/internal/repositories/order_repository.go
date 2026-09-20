package repositories

import (
	"context"
	"database/sql"
	"ecommerce/internal/models"
	"errors"
	"fmt"
	"time"
)

type OrderRepository struct{
	DB *sql.DB
}

func (r *OrderRepository) CreateTransaction(ctx context.Context, order *models.Order) error{
	tx, err := r.DB.BeginTx(ctx, nil)
	if err != nil{
		return err
	}
	defer tx.Rollback() // rollback jika tidak di-commit

	// validasi stok dan ambil harga terbaru dari database
	var subtotal int64
	for i, item := range order.Items{
		var dbPrice int64
		var dbStock int
		var dbName string
		err := tx.QueryRowContext(ctx, "SELECT price, stock, name FROM products WHERE id = ?", item.ProductID).Scan(&dbPrice, &dbStock, &dbName)
		if err != nil{
			return errors.New("Produk tidak ditemukan")
		}
		if dbStock < item.Quantity{
			return errors.New("Stok produk tidak mencukupi" + dbName)
		}

		order.Items[i].Price = dbPrice
		order.Items[i].Name = dbName
		subtotal += dbPrice * int64(item.Quantity)
	}

	order.Subtotal = subtotal
	order.Total = subtotal + order.ShippingCost
	order.Status = "pending_payment"

	// create a dummy customer if it doesn't exist to satisfy FK
	tx.ExecContext(ctx, `INSERT OR IGNORE INTO customers (id, name, email) VALUES (?, ?, ?)`, order.UserID, "Customer", "customer@example.com")

	orderNumber := fmt.Sprintf("ORD-%d", time.Now().UnixNano())
	
	// Insert Order
	res, err := tx.ExecContext(ctx, `INSERT INTO orders (user_id, customer_id, order_number, status, subtotal, shipping_cost, total, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		order.UserID, order.UserID, orderNumber, order.Status, order.Subtotal, order.ShippingCost, order.Total, order.Notes)

	if err != nil{
		return err
	}

	orderID, _ := res.LastInsertId()
	order.ID = orderID

	// Insert item dan kurangi stok
	for _, item := range order.Items{
		lineTotal := item.Price * int64(item.Quantity)
		_, err = tx.ExecContext(ctx, `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total) VALUES (?, ?, ?, ?, ?, ?)`,
			orderID, item.ProductID, item.Name, item.Price, item.Quantity, lineTotal)
		
		if err != nil{
			return err
		}

		_, err = tx.ExecContext(ctx, `UPDATE products SET stock = stock - ? WHERE id = ?`, item.Quantity, item.ProductID)
		if err != nil{
			return err
		}
	}
	return tx.Commit()
}

func (r *OrderRepository) UpdateStatus(ctx context.Context, orderID, userID int64, status string) error{
	res, err := r.DB.ExecContext(ctx, "UPDATE orders SET status = ? WHERE id = ? AND user_id = ?", status, orderID, userID)

	if err != nil{
		return err
	}
	affected, _ := res.RowsAffected()
	if affected == 0{
		return errors.New("Order tidak ditemukan atau bukan milik anda")
	}
	return nil
}