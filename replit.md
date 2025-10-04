# Seblak Bageur - Aplikasi Kasir

Aplikasi web kasir untuk Warung Seblak Bageur yang berlokasi di Desa Metesih, Kecamatan Jiwan, Kabupaten Madiun.

## Informasi Warung
- **Nama**: Seblak Bageur
- **Lokasi**: Desa Metesih, Kecamatan Jiwan, Kabupaten Madiun
- **Warna Brand**: Orange (#ea580c)

## Teknologi
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: Supabase (PostgreSQL) - akan diintegrasikan
- **Styling**: Tailwind CSS + Shadcn UI
- **Autentikasi**: Supabase Auth - akan diintegrasikan
- **PWA**: Manifest.json + Service Worker

## Fitur yang Sudah Dibuat

### 1. Halaman Kasir (/)
- Form input order dengan pilihan topping custom
- Nama pelanggan (opsional)
- Kalkulasi total otomatis
- Tab riwayat order dengan akses ke cetak struk
- Responsive untuk mobile dan desktop

### 2. Halaman Dapur (/dapur)
- Tampilan antrian berdasarkan nomor urut
- Filter berdasarkan status: Semua, Menunggu, Diproses, Selesai
- Update status order: pending → in_progress → done
- Edit order dengan dialog modal untuk menambah/ubah topping
- Visual border warna berdasarkan status

### 3. Halaman Laporan (/laporan)
- Stats card: Total Order, Pendapatan, Topping Favorit
- Penjualan per topping dengan jumlah dan revenue
- Data harian (akan diintegrasikan dengan filter tanggal)

### 4. Halaman Topping Management (/topping)
- CRUD topping: Create, Read, Update, Delete
- Dialog form untuk tambah/edit topping
- Grid view dengan nama dan harga

### 5. Halaman Login (/login)
- Form autentikasi untuk kasir
- Siap untuk integrasi Supabase Auth

### 6. Halaman Print Receipt (/print/:id)
- Preview struk thermal dengan format ESC/POS
- Tombol print via Bluetooth (Web Bluetooth API)
- Informasi: Nama warung, lokasi, nomor antrian, topping, total

### 7. Fitur Tambahan
- **Dark Mode**: Toggle tema light/dark
- **Responsive Design**: Sidebar untuk desktop, bottom navigation untuk mobile
- **PWA Ready**: Manifest.json dan service worker untuk offline support
- **Component Library**: Reusable components dengan Shadcn UI

## Struktur Komponen

### Core Components
- `AppSidebar` - Navigasi sidebar untuk desktop
- `BottomNav` - Bottom navigation untuk mobile
- `ThemeToggle` - Toggle dark/light mode
- `StatusBadge` - Badge status order
- `QueueNumber` - Nomor antrian circular
- `ToppingSelector` - Grid selector topping dengan checkbox
- `OrderCard` - Card order dengan status dan actions
- `StatsCard` - Card statistik untuk dashboard
- `ReceiptPreview` - Preview struk thermal
- `EditOrderDialog` - Dialog untuk edit order
- `OrderHistory` - List riwayat order

## Yang Perlu Diintegrasikan Selanjutnya

### Backend Integration (TODO)
1. **Supabase Setup**
   - Setup Supabase project
   - Configure authentication
   - Create database tables: toppings, orders, order_items

2. **API Endpoints**
   - POST /api/toppings - Create topping
   - GET /api/toppings - List toppings
   - PUT /api/toppings/:id - Update topping
   - DELETE /api/toppings/:id - Delete topping
   - POST /api/orders - Create order
   - GET /api/orders - List orders
   - PATCH /api/orders/:id - Update order status/items
   - GET /api/reports/daily - Daily report

3. **Real-time Features**
   - Supabase Realtime untuk update order di layar dapur
   - Auto-refresh order list

4. **Web Bluetooth Printing**
   - Implementasi ESC/POS command generation
   - Pair dengan thermal printer
   - Send print data via Bluetooth

5. **PWA Enhancement**
   - Generate app icons (192x192, 512x512)
   - Register service worker
   - Offline data caching

## Mock Data Locations
Semua mock data ditandai dengan komentar `// TODO: Remove mock data` pada file:
- `/client/src/pages/kasir.tsx` - Mock toppings & order history
- `/client/src/pages/dapur.tsx` - Mock orders & toppings
- `/client/src/pages/laporan.tsx` - Mock stats & topping sales
- `/client/src/pages/topping-management.tsx` - Mock toppings list
- `/client/src/pages/print-receipt.tsx` - Mock order data

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access application
http://localhost:5000
```

## Database Schema (Untuk Implementasi)

```sql
-- Toppings
CREATE TABLE toppings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_number INTEGER NOT NULL,
  customer_name TEXT,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'done')),
  total INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  topping_id UUID REFERENCES toppings(id),
  qty INTEGER DEFAULT 1,
  price INTEGER NOT NULL
);
```

## Design Guidelines
Lihat `design_guidelines.md` untuk detail lengkap tentang:
- Color palette (Orange primary theme)
- Typography (Inter + JetBrains Mono)
- Component styling
- Layout system
- Spacing dan grid
