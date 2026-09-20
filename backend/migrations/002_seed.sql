PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO categories (name, slug)
VALUES
    ('General', 'general'),
    ('Featured', 'featured');

INSERT OR IGNORE INTO products
    (category_id, name, slug, description, image_url, price, stock)
VALUES
    (
        (SELECT id FROM categories WHERE slug = 'featured'),
        'Starter Product',
        'starter-product',
        'Contoh produk untuk pengembangan checkout.',
        '/assets/img/dest/dest1.jpg',
        100000,
        20
    ),
    (
        (SELECT id FROM categories WHERE slug = 'general'),
        'Basic Product',
        'basic-product',
        'Contoh produk kedua untuk pengujian keranjang.',
        '/assets/img/dest/dest2.jpg',
        75000,
        15
    );
