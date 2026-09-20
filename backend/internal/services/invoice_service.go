package services

import (
	"bytes"
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	"time"
)

type InvoiceService struct {
	InvoiceDir string
}

// Struct untuk melempar data dinamis ke dalam HTML
type InvoiceData struct {
	OrderID int64
	Date    string
}

func (s *InvoiceService) GenerateInvoiceHTML(orderID int64) (string, error) {
	// Pastikan direktori ada
	os.MkdirAll(s.InvoiceDir, os.ModePerm)

	fileName := fmt.Sprintf("invoice_%d.html", orderID)
	filePath := filepath.Join(s.InvoiceDir, fileName)

	// Idempotent: jika sudah ada, gunakan yang lama
	if _, err := os.Stat(filePath); err == nil {
		return filePath, nil
	}

	data := InvoiceData{
		OrderID: orderID,
		Date:    time.Now().Format("02 January 2006"),
	}

	// Template HTML Invoice yang proper
	const tpl = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{.OrderID}}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; margin: 0; padding: 40px; background-color: #f3f4f6; }
        .invoice-box { max-width: 800px; margin: auto; padding: 40px; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 30px; }
        .header-left h1 { margin: 0; color: #2563eb; font-size: 28px; }
        .header-left p { margin: 5px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5; }
        .header-right { text-align: right; }
        .header-right h2 { margin: 0; font-size: 24px; color: #111827; letter-spacing: 1px; }
        .header-right p { margin: 8px 0 16px 0; font-size: 14px; color: #6b7280; }
        .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; background: #dcfce7; color: #166534; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f9fafb; padding: 12px; text-align: left; font-size: 14px; color: #374151; border-bottom: 2px solid #e5e7eb; }
        td { padding: 16px 12px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 15px; }
        .text-right { text-align: right; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #f3f4f6; font-size: 14px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <div class="header-left">
                <h1>Productly.</h1>
                <p>Jl. Teknologi E-Commerce No. 99<br>Bandung, Jawa Barat 40123</p>
            </div>
            <div class="header-right">
                <h2>INVOICE</h2>
                <p>Order ID: <strong>#{{.OrderID}}</strong><br>Tanggal: {{.Date}}</p>
                <div class="badge">Payment Skipped</div>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Deskripsi</th>
                    <th class="text-right">Status</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Pembelian Produk (Order #{{.OrderID}})</td>
                    <td class="text-right">Selesai</td>
                    <td class="text-right">Lihat Dashboard</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            Terima kasih telah berbelanja di Productly!<br>
            Invoice ini sah dan diterbitkan otomatis oleh sistem.
        </div>
    </div>
</body>
</html>
`

	t, err := template.New("invoice").Parse(tpl)
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := t.Execute(&buf, data); err != nil {
		return "", err
	}

	err = os.WriteFile(filePath, buf.Bytes(), 0644)
	return filePath, err
}