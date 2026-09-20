package repositories

import(
	"context"
	"database/sql"
	"ecommerce/internal/models"
)

type ProductRepository struct{
	DB *sql.DB
}

func (r *ProductRepository) GetAll(ctx context.Context) ([]models.Product, error){
	rows, err := r.DB.QueryContext(ctx, "SELECT id, category_id, name, description, price, stock, image_url FROM products")

	if err != nil{
		return nil, err
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next(){
		var p models.Product
		if err := rows.Scan(&p.ID, &p.CategoryID, &p.Name, &p.Description, &p.Price, &p.Stock, &p.ImageURL); err != nil{
			return nil, err
		}
		products = append(products, p)
	}
	return products, nil
}

func(r *ProductRepository) GetByID(ctx context.Context, id int64) (*models.Product, error){
	var p models.Product

	err := r.DB.QueryRowContext(ctx, "SELECT id, category_id, name, description, price, stock, image_url FROM products WHERE id = ?", id).
			Scan(&p.ID, &p.CategoryID, &p.Name, &p.Description, &p.Price, &p.Stock, &p.ImageURL)

	if err != nil{
		return nil, err
	}
	return &p, nil
}