# Rewa Kripa Travels v4 — Deploy Ready

## Files in this folder
| File | Purpose |
|------|---------|
| `index.html` | Homepage |
| `book-seat.html` | **Rebuilt** — multi-passenger, per-seat gender, Supabase live |
| `admin.html` | **NEW** — Full admin portal (password protected) |
| `config.js` | **Updated** — busId per route, driver per bus, gender seats, Admin link |
| `style.css` | **Updated** — hero banner fix, gender seat colors |
| `supabase.js` | **NEW** — Shared database client (Supabase + localStorage fallback) |
| `README_SUPABASE.sql` | **NEW** — Run once in Supabase SQL editor |
| All other .html | Unchanged from previous version |

## Quick Deploy Checklist
- [ ] Upload all files to your hosting
- [ ] Set up Supabase (5 min, free) — see below
- [ ] Add driver photos: `images/driver1.jpeg` through `driver4.jpeg`
- [ ] Visit `/admin.html` and log in with password `Swift@8606`

## Supabase Setup (free, no credit card)
1. Go to https://supabase.com → New Project
2. SQL Editor → paste `README_SUPABASE.sql` → Run
3. Settings → API → copy Project URL and anon key
4. Open `supabase.js` → paste into `SUPABASE_URL` and `SUPABASE_ANON`
5. Deploy and test

Without Supabase, bookings save to localStorage only (same device). 
With Supabase, every customer on every phone sees the same live seat map.

## Admin Portal (`/admin.html`)
Default password: `Swift@8606`

| Section | What you can do |
|---------|----------------|
| Dashboard | Today's bookings, stats |
| Seat Manager | Block/unblock per bus/date, paste WhatsApp message to auto-block |
| Company Info | Edit name, phone, address, hours |
| Buses & Drivers | Edit every bus — fare, capacity, driver name/photo/licence |
| Routes | Edit routes, assign bus, change fares, enable/disable |
| Trips | Edit packages, prices, itineraries, seats left |
| Hero Banner | Edit homepage text, slider images, stats |
| Settings | Configure Supabase, change admin password |

## Booking Flow
1. Customer selects route → bus auto-assigns
2. Customer clicks seats on map
3. Each seat gets its own passenger name + phone + gender
4. Family (husband + wife) books 2 seats with different genders in one booking
5. Tap Confirm → seats blocked in Supabase → WhatsApp opens with full details
6. All customers see blocked seats immediately via real-time sync
7. Seats auto-release 2 hrs after bus departure

## Change Admin Password
Open `supabase.js` → find `ADMIN_PASSWORD` → change it → save and redeploy.
