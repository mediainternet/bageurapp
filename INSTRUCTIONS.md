# Seblak Bageur - Aplikasi Kasir

## Fitur Yang Sudah Ditambahkan ✅

### 1. Database Schema Lengkap
- ✅ Tabel `packages` untuk paket seblak
- ✅ Tabel `package_toppings` untuk relasi paket-topping
- ✅ Field `type` dan `packageId` di tabel `orders`
- ✅ Schema sudah di-push ke Supabase

### 2. API Endpoints Baru
- ✅ `GET /api/packages` - Get semua paket
- ✅ `GET /api/packages/:id` - Get detail paket dengan topping
- ✅ `POST /api/packages` - Create paket baru
- ✅ `PUT /api/packages/:id` - Update paket
- ✅ `DELETE /api/packages/:id` - Delete paket
- ✅ `PUT /api/orders/:id` - Update order (edit topping)

### 3. Fitur Edit Order di Halaman Dapur
- ✅ Tombol edit di setiap order card
- ✅ Dialog untuk edit nama pelanggan & topping
- ✅ Update total harga otomatis
- ✅ Menyimpan perubahan ke database

### 4. Fitur Paket Seblak di Halaman Kasir
- ✅ Radio button untuk pilih Custom/Paket
- ✅ Tampilan card paket yang bisa diklik
- ✅ Hitung total otomatis untuk paket
- ✅ Validasi input sebelum submit

### 5. Bluetooth Printing (ESC/POS)
- ✅ Web Bluetooth API untuk pairing printer
- ✅ Generate ESC/POS commands untuk thermal printer
- ✅ Format struk: Nama warung, nomor antrian, item, total
- ✅ Support untuk printer ESC/POS via Bluetooth
- ✅ Error handling & toast notifications

### 6. PWA Enhancement
- ✅ Manifest.json dengan info Seblak Bageur
- ✅ Service worker dengan offline caching
- ✅ Cache strategy untuk API & static files
- ✅ Installable sebagai PWA

### 7. Grafik Laporan
- ✅ Bar chart penjualan per topping
- ✅ Responsive chart dengan Recharts
- ✅ Warna berbeda per bar
- ✅ Tooltip dengan format yang jelas

## Cara Menambahkan Data Paket

Karena belum ada halaman management paket di UI, Anda bisa menambahkan paket dengan 2 cara:

### Cara 1: Via API Endpoint (Gunakan Postman/cURL)

```bash
# Tambah paket baru
curl -X POST http://localhost:5000/api/packages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paket Komplit",
    "price": 15000,
    "toppingIds": ["topping-id-1", "topping-id-2", "topping-id-3"]
  }'
```

### Cara 2: Via Halaman Topping Management

Anda bisa membuat halaman baru untuk management paket seperti halaman topping management yang sudah ada.

## Cara Menggunakan Bluetooth Printing

1. Buka aplikasi di browser yang support Web Bluetooth (Chrome/Edge di Android)
2. Pergi ke halaman print struk
3. Klik tombol "Print via Bluetooth"
4. Pilih printer thermal dari daftar
5. Struk akan dicetak otomatis

**Note:** Web Bluetooth hanya work di:
- Chrome/Edge di Android
- Chrome di Desktop dengan flag enabled
- HTTPS (production) atau localhost (development)

## Testing

1. Tambahkan topping di halaman "Topping Management"
2. Buat paket via API atau tunggu fitur UI management paket
3. Test order dengan custom topping
4. Test order dengan paket
5. Test edit order di halaman dapur
6. Test print struk via Bluetooth
7. Lihat laporan dan grafik di halaman laporan

## Database Supabase

Database sudah terkoneksi ke:
- Host: `db.yfhyzwldutjmemsxxpaw.supabase.co`
- Database: `postgres`
- Schema sudah di-push dengan `npm run db:push`

## Yang Masih Bisa Ditambahkan (Opsional)

1. Halaman management paket (CRUD paket di UI)
2. Halaman management user/kasir
3. Export laporan ke PDF/Excel
4. Filter laporan by date range
5. Notifikasi real-time untuk dapur
6. Print preview sebelum print ke thermal

## Build & Deploy

```bash
# Development
npm run dev

# Build production
npm run build

# Start production
npm start
```

Build sudah berhasil tanpa error! ✅
