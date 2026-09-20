# TechStore E-commerce

Personal project e-commerce sederhana dengan frontend vanilla JavaScript dan backend Go modular monolith. Project ini menggunakan SQLite sehingga mudah dijalankan secara lokal tanpa database server tambahan.

Project ini juga digunakan sebagai sarana belajar Go.

## Fitur

- Menampilkan daftar produk dan detail produk
- Keranjang belanja
- Register dan login user
- Autentikasi menggunakan JWT
- Checkout
- Status pembayaran `Skip Payment`
- Pembuatan dan download invoice HTML
- SQLite sebagai database
- Struktur backend yang siap dikembangkan untuk integrasi Midtrans

## Tujuan mode `Skip Payment`

Mode `Skip Payment` memang disediakan agar seluruh alur aplikasi dapat diuji
tanpa melakukan pembayaran sungguhan. Dengan mode ini, kamu dapat menguji:

```text
register/login
    → memilih produk
    → memasukkan produk ke keranjang
    → checkout
    → membuat order
    → Skip Payment
    → membuat invoice
    → download invoice
```

Mode ini bukan simulasi gateway pembayaran dan tidak menandai transaksi sebagai
pembayaran Midtrans. Order akan menggunakan status `payment_skipped`, sehingga
status tersebut dapat dibedakan dari order yang benar-benar berstatus `paid`.

## Struktur project

```text
e-commerce/
├── frontend/
│   ├── index.html
│   ├── css/
│   └── js/
│       ├── app.js
│       ├── api.js
│       ├── auth.js
│       ├── store.js
│       ├── components/
│       └── pages/
├── backend/
│   ├── cmd/server/main.go
│   ├── internal/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── database/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── router/
│   │   └── services/
│   ├── migrations/
│   ├── data/
│   ├── storage/invoices/
│   ├── .env.example
│   ├── go.mod
│   └── go.sum
└── README.MD
```

Backend menggunakan pendekatan **modular monolith**: semua fitur berjalan dalam
satu aplikasi Go, tetapi dipisahkan menjadi handler, service, repository,
model, dan middleware.

## Tujuan belajar Go

Project ini dapat digunakan untuk mempelajari konsep-konsep berikut:

- Struktur project dan package Go
- `struct`, method, interface, dan pointer
- Error handling dengan pola `if err != nil`
- HTTP server dan REST API menggunakan `net/http`
- JSON request dan response
- Middleware dan request context
- Register/login dan autentikasi JWT
- Hash password menggunakan bcrypt
- Database/sql dan query parameterized
- Transaksi database SQLite
- Relasi data user, product, order, dan invoice
- Validasi input dan ownership data
- Goroutine dan graceful shutdown server
- Unit test dan integration test
- `gofmt`, `go vet`, dependency management, dan build binary

Urutan belajar yang disarankan:

```text
1. Menjalankan HTTP server sederhana
2. Membaca konfigurasi dari environment
3. Membuka koneksi SQLite
4. Membuat endpoint health check
5. Membuat endpoint products
6. Memahami repository dan query database
7. Membuat register dan login
8. Memahami bcrypt, JWT, dan middleware
9. Membuat checkout dengan transaksi database
10. Menerapkan Skip Payment
11. Membuat invoice
12. Menulis test dan memperbaiki error
13. Menambahkan integrasi Midtrans secara opsional
```

Saat belajar, implementasikan satu bagian kecil terlebih dahulu dan jalankan
aplikasi setelah setiap perubahan. Hindari langsung menyalin seluruh project
tanpa memahami alur request dari handler ke service, repository, dan database.

## Prasyarat

Pastikan sudah ter-install:

- Go 1.22 atau lebih baru
- Browser modern
- Git, jika project dikelola menggunakan Git

SQLite tidak perlu di-install secara terpisah karena backend menggunakan driver
SQLite dari Go.

## Menjalankan backend

Buka terminal pertama:

```powershell
cd C:\Users\pbsep\Downloads\e-commerce\backend
go mod tidy
```

Jika file `.env` belum ada:

```powershell
copy .env.example .env
```

Pastikan konfigurasi minimal di `.env` tersedia:

```env
APP_ENV=development
APP_PORT=8080
DATABASE_PATH=./data/ecommerce.db
FRONTEND_ORIGIN=http://localhost:3000
INVOICE_DIR=./storage/invoices
JWT_SECRET=ganti-dengan-secret-yang-panjang-dan-acak
```

Jalankan server:

```powershell
go run .\cmd\server
```

Backend tersedia di:

```text
http://localhost:8080
```

Pengecekan health:

```powershell
curl http://localhost:8080/api/health
```

## Menjalankan frontend

Frontend saat ini berupa aplikasi static HTML, CSS, dan JavaScript. Jalankan
static server dari folder `frontend`, bukan dari root project:

```powershell
cd C:\Users\pbsep\Downloads\e-commerce\frontend
py -m http.server 3000
```

Buka:

```text
http://localhost:3000
```

Frontend menggunakan hash routing, misalnya:

```text
http://localhost:3000/#/
http://localhost:3000/#/products
http://localhost:3000/#/login
http://localhost:3000/#/register
```

Konfigurasi URL API frontend berada di:

```text
frontend/js/api.js
```

Default API:

```text
http://localhost:8080/api
```

Jalankan backend sebelum membuka halaman products, login, register, atau
checkout.

## Database dan migration

File database lokal berada di:

```text
backend/data/ecommerce.db
```

Migration yang tersedia:

```text
backend/migrations/001_init.sql
backend/migrations/002_seed.sql
backend/migrations/003_auth.sql
```

Migration membuat tabel utama:

- `categories`
- `products`
- `users`
- `customers`
- `orders`
- `order_items`
- `invoices`

Data produk contoh berasal dari `002_seed.sql`. Jangan memasukkan file database
lokal yang berisi data pribadi ke repository publik.

## API endpoint

### Public

```text
GET  /api/health
POST /api/auth/register
POST /api/auth/login
GET  /api/products
GET  /api/products/{id}
```

### Membutuhkan JWT

Request harus memiliki header:

```http
Authorization: Bearer <token>
```

Endpoint protected:

```text
POST /api/orders
POST /api/orders/{id}/skip-payment
GET  /api/orders/{id}/invoice
```

## Contoh register

```powershell
curl -Method POST `
  -Uri http://localhost:8080/api/auth/register `
  -ContentType "application/json" `
  -Body '{"name":"Budi","email":"budi@example.com","password":"password123"}'
```

## Contoh login

```powershell
curl -Method POST `
  -Uri http://localhost:8080/api/auth/login `
  -ContentType "application/json" `
  -Body '{"email":"budi@example.com","password":"password123"}'
```

Simpan nilai `token` dari response login untuk request yang membutuhkan
autentikasi.

## Alur checkout dan testing invoice

```text
1. User login atau register
2. User memilih produk
3. Produk dimasukkan ke keranjang
4. Frontend mengirim checkout ke backend
5. Backend membaca harga dan stok dari database
6. Backend membuat order dengan status pending_payment
7. User menekan Skip Payment
8. Backend mengubah status menjadi payment_skipped
9. Backend membuat invoice
10. User mengunduh invoice
```

Harga, nama produk, total, dan stok harus selalu dihitung atau diverifikasi oleh
backend. Data tersebut tidak boleh dipercaya dari browser.

Dengan demikian, payment gateway tidak diperlukan untuk testing fitur sampai
invoice. Midtrans cukup diaktifkan pada tahap berikutnya ketika ingin menguji
alur pembayaran nyata.

## Payment gateway Midtrans

Payment gateway belum wajib digunakan. Untuk sekarang, tombol `Skip Payment`
digunakan agar alur order dan invoice dapat diuji tanpa transaksi sungguhan.

Jika Midtrans diaktifkan nanti:

1. Backend membuat transaksi menggunakan server key.
2. Frontend membuka Snap menggunakan client key.
3. Midtrans mengirim webhook ke backend.
4. Backend memverifikasi signature dan status transaksi.
5. Hanya backend yang mengubah order menjadi `paid`.
6. Invoice diterbitkan setelah pembayaran terverifikasi.

Server key tidak boleh dikirim ke frontend atau disimpan di repository.
Dokumentasi tambahan berada di `backend/docs/midtrans.md`.

## Pengembangan

Untuk mengubah endpoint atau business logic backend, gunakan pembagian berikut:

```text
handlers      HTTP request dan response
services      business logic
repositories  query database
models        struktur data
middleware    auth dan CORS
```
