# Opsional: Integrasi Midtrans

Integrasi Midtrans sebaiknya ditambahkan setelah checkout lokal dan invoice
dengan status `payment_skipped` sudah berjalan.

Alur:

1. Backend membuat order dengan status `pending_payment`.
2. Backend meminta Snap token ke Midtrans menggunakan server key.
3. Frontend membuka Snap popup menggunakan client key.
4. Midtrans mengirim webhook ke backend.
5. Backend memverifikasi signature dan status transaksi.
6. Backend mengubah status order menjadi `paid` atau `cancelled`.
7. Invoice diterbitkan hanya setelah status pembayaran valid.

Server key hanya boleh berada di environment backend. Jangan kirim server key
ke frontend dan jangan mempercayai status pembayaran dari browser.
