# Design Guidelines: Warung Seblak Bageur POS System

## Design Approach

**Selected Approach**: Material Design System with Indonesian F&B Branding
**Justification**: As a utility-focused POS application requiring efficiency, mobile optimization, and strong visual feedback, Material Design provides the ideal foundation. Customized with vibrant orange branding to reflect Indonesian street food culture while maintaining professional functionality.

**Key Design Principles**:
- Touch-first optimization for mobile POS operations
- Clear visual hierarchy for quick task completion
- Immediate feedback for all user actions
- Indonesian culinary aesthetic with modern professionalism

---

## Core Design Elements

### A. Color Palette

**Primary Colors**:
- **Orange (Brand)**: 25 85% 55% - Main brand color for headers, primary CTAs, active states
- **Deep Orange**: 18 90% 48% - Hover states, emphasis elements
- **Warm Orange Light**: 30 95% 95% - Subtle backgrounds, cards in light mode

**Functional Colors**:
- **Success Green**: 142 71% 45% - Completed orders, success messages
- **Warning Amber**: 45 100% 51% - In-progress status, warnings
- **Error Red**: 0 84% 60% - Alerts, delete actions, critical states
- **Info Blue**: 207 90% 54% - Information badges, secondary actions

**Neutral Palette**:
- **Dark Mode Backgrounds**: 220 13% 9% (primary), 220 13% 13% (elevated cards)
- **Dark Mode Text**: 0 0% 98% (primary), 0 0% 70% (secondary)
- **Light Mode Backgrounds**: 0 0% 100% (primary), 0 0% 96% (elevated cards)
- **Light Mode Text**: 220 13% 13% (primary), 220 9% 46% (secondary)

### B. Typography

**Font Family**: 
- Primary: 'Inter' from Google Fonts - exceptional legibility for numeric data and Indonesian text
- Monospace: 'JetBrains Mono' - for order numbers, prices, receipts

**Type Scale**:
- **Display** (Page Headers): text-3xl font-bold (30px)
- **H1** (Section Headers): text-2xl font-semibold (24px)
- **H2** (Card Titles): text-xl font-medium (20px)
- **Body Large** (Primary Content): text-base font-normal (16px)
- **Body** (Secondary Content): text-sm font-normal (14px)
- **Caption** (Labels, Metadata): text-xs font-medium (12px)
- **Prices/Numbers**: text-lg font-semibold tabular-nums (18px)

### C. Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 8, 12, 16** consistently
- Micro spacing: p-2, gap-2 (8px)
- Standard spacing: p-4, gap-4 (16px)
- Section spacing: p-8, gap-8 (32px)
- Large spacing: p-12, gap-12 (48px)
- Page margins: p-16 (64px - desktop only)

**Grid System**:
- Mobile (base): Single column, full-width cards with p-4
- Tablet (md:): 2-column grids for topping selection, order items
- Desktop (lg:): 3-column layout (sidebar navigation + main content + quick actions panel)

**Container Widths**:
- Mobile POS view: Full width (w-full)
- Kitchen display: max-w-7xl centered
- Reports dashboard: max-w-6xl
- Receipt preview: max-w-sm (384px)

### D. Component Library

**Navigation**:
- **Bottom Navigation Bar** (Mobile): Fixed bottom bar with 4 primary routes (Kasir, Dapur, Laporan, Topping), orange active indicator, icon + label
- **Sidebar Navigation** (Desktop): Left sidebar 280px wide, orange accent for active item, collapsible sections
- **Top App Bar**: Orange background, warung name + location in white, logout button, current date/time display

**Buttons**:
- **Primary**: Solid orange background (25 85% 55%), white text, rounded-lg, shadow-md, h-12 minimum touch target
- **Secondary**: Outline style with orange border, orange text, rounded-lg
- **Danger**: Solid red background for delete/cancel actions
- **Icon Buttons**: 44px × 44px minimum (touch-optimized), subtle gray background on hover

**Cards**:
- **Order Card**: White/dark elevated card, rounded-xl, p-4, shadow-sm, border-l-4 with status color (orange=pending, amber=in-progress, green=done)
- **Topping Card**: Grid item with image placeholder, name, price, checkbox/quantity controls
- **Summary Card**: Highlighted with orange subtle background, larger text for totals

**Forms**:
- **Input Fields**: h-12 minimum, rounded-lg, border-2, focus:border-orange-500, focus:ring-2 focus:ring-orange-200
- **Checkboxes**: Large 24px × 24px, orange checked state with white checkmark
- **Number Inputs**: Stepper controls with +/- buttons, centered large numbers
- **Labels**: Text-sm font-medium above inputs, text-xs helper text below

**Status Indicators**:
- **Chips/Badges**: Rounded-full px-3 py-1, colored backgrounds matching status (pending=orange, in-progress=amber, done=green)
- **Queue Numbers**: Large circular badges with orange background, white bold numbers (text-2xl)

**Data Display**:
- **Tables**: Striped rows, sticky header, mobile-responsive card view transformation
- **Lists**: Dividers between items, swipe actions for mobile (edit/delete)
- **Stats Cards**: Large numbers (text-4xl), descriptive labels, trend indicators

**Modals/Dialogs**:
- **Full-Screen Modal** (Mobile): Slide up from bottom, orange header bar
- **Centered Dialog** (Desktop): max-w-md, rounded-xl, overlay with backdrop-blur
- **Bottom Sheet** (Mobile): For quick actions, rounded-t-2xl

**Overlays**:
- **Loading**: Spinner with orange accent, translucent backdrop
- **Toast Notifications**: Slide from top-right, auto-dismiss after 3s, success=green, error=red, info=blue

### E. Page-Specific Layouts

**Kasir (Cashier) Page**:
- Split view: Left side = topping selection grid (2-3 columns), Right side = order summary card (sticky)
- Customer name input at top
- Large "Proses Order" button at bottom (w-full on mobile)
- Quick access to recent toppings

**Dapur (Kitchen) Page**:
- Kanban-style columns: Pending | In Progress | Done
- Auto-refresh every 10 seconds
- Order cards sorted by queue number
- Large, touch-friendly status update buttons
- Sound notification for new orders

**Laporan (Reports) Page**:
- Date range picker at top
- 4-stat summary cards: Total Orders, Total Revenue, Best Topping, Orders Today
- Bar chart for topping sales
- Transaction list table below

**Topping Management Page**:
- Add new topping FAB (Floating Action Button) in orange, bottom-right
- Grid/List toggle view
- Search/filter bar
- Inline edit with confirmation

**Receipt Print Preview**:
- Thermal printer width (58mm simulation)
- Monospace font for alignment
- "Warung Seblak Bageur" in ASCII art style header
- Location, queue number, items list, total, thank you message
- Bluetooth print button (orange, w-full)

### F. PWA Elements

**App Icon**: Orange circular icon with white "SB" (Seblak Bageur) monogram
**Splash Screen**: Orange gradient background, white logo, "Memuat..." text
**Install Prompt**: Dismissible banner with orange CTA, appears after 3 visits

---

## Images

**No hero images required** - this is a utility POS application focused on efficiency over marketing appeal. Use orange-themed iconography from Heroicons for navigation and feature illustrations.

**Icon Usage**:
- Shopping bag for orders
- Fire for kitchen/dapur
- Chart bar for reports
- Cog for topping management
- Printer for receipt functions
All icons should use stroke-2 for consistency.