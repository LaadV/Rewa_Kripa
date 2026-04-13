# Rewa Kripa Travels — v4

## 2 files changed + 1 new file
| File | Status |
|------|--------|
| `book-seat.html` | Rebuilt — multi-passenger, Firebase live seats |
| `admin.html` | NEW — full seat management dashboard |
| `config.js` | Updated — busId per route, driver info per bus |
| `style.css` | Updated — hero fix, gender seat colors, modal CSS |
| All other 14 HTML files | Unchanged |

---

## Firebase Setup (5 mins — mandatory for cross-device seat sync)

1. Go to https://console.firebase.google.com
2. Create Project → Add Web App → copy config values
3. Realtime Database → Create → Start in TEST MODE
4. Open BOTH `book-seat.html` AND `admin.html`
5. Find `FIREBASE_CONFIG` in each file → paste your values → save
6. Done — all seats now sync across all devices in real-time

---

## Admin Panel (admin.html)
- Open `admin.html` in browser
- Password: `Swift@8606` (change `ADMIN_PASSWORD` in admin.html)
- Features:
  - View all buses, select date, see live seat map
  - Click any booked seat to unblock it instantly
  - Click any free seat to select it → enter name/gender → Block Seats
  - Enter seat numbers manually with passenger name + gender
  - Clear all seats for today / Full reset (all buses, all dates)
  - Live bookings table with Unblock button per row
  - Stats: total booked, male, female, available

## Booking Page (book-seat.html)
- One route = one fixed bus (no bus dropdown)
- Click multiple seats for group travel
- Each seat gets its own name + gender field
  (e.g. Ramesh Male Seat 5, Sunita Female Seat 6)
- Blue = Male booked, Pink = Female booked
- Striped = blocked (male seat adjacent to female booking)
- WhatsApp message includes per-seat name and gender
- Seats blocked for ALL customers the moment you confirm
- Auto-reset 2hrs after bus departure

## Images needed
- images/driver1.jpeg → driver for MP09CY8606
- images/driver2.jpeg → driver for MP09CY7782
- images/driver3.jpeg → driver for MP09CY9911
- images/driver4.jpeg → driver for MP09CY4455
(Shows emoji placeholder if photo file is missing)

## Change admin password
Open `admin.html` → find `const ADMIN_PASSWORD = "Swift@8606"` → change → save
