# Rewa Kripa Travels — Website

## Files changed in this version
| File | What changed |
|------|-------------|
| `config.js` | Added `busId` per route, `driver{}` per bus, gender in `bookedSeats` |
| `style.css` | Fixed hero banner images (overlay bug), added gender seat colors, driver modal CSS |
| `book-seat.html` | Full rebuild — Firebase shared seats, gender colors, driver modal, admin unblock |

## All other HTML files — UNCHANGED
`index.html`, `about.html`, `blog.html`, `bus.html`, `cancellations.html`, `careers.html`,
`contact.html`, `cookie-policy.html`, `help.html`, `terms-of-sale.html`, `terms-of-use.html`,
`travel-stories.html`, `trip-detail.html`, `upcoming-trip.html`, `script.js`

---

## Firebase Setup (5 minutes — one time)

> Without this step, bookings are only visible on the same device.
> With Firebase, every customer on every device sees the same seat map live.

1. Go to **https://console.firebase.google.com**
2. Click **"Create a project"** → name it (e.g. `rewa-kripa`) → Continue
3. Left sidebar → **Realtime Database** → **Create Database** → any region → **Start in TEST MODE**
4. Left sidebar → **Project Settings** (⚙️) → **Your apps** → click `</>` (Web) → Register app
5. Copy the config block shown:
   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     databaseURL: "...",
     ...
   };
   ```
6. Open `book-seat.html` → find `FIREBASE_CONFIG` near the top → paste your values → save

That's it. Push the file and bookings are now shared across all devices.

---

## Images needed in `images/` folder
| File | What it is |
|------|-----------|
| `bus1.jpeg` to `bus5.jpeg` | Bus photos (already in your folder) |
| `driver1.jpeg` | Driver photo for bus MP09CY8606 |
| `driver2.jpeg` | Driver photo for bus MP09CY7782 |
| `driver3.jpeg` | Driver photo for bus MP09CY9911 |
| `driver4.jpeg` | Driver photo for bus MP09CY4455 |

Driver photos are optional — shows a 👨‍✈️ emoji if the file is missing.

---

## Seat booking features

### For passengers
- Select route → bus auto-assigns (no bus dropdown)
- Choose Male ♂ or Female ♀ before picking seats
- Booked seats show: Blue = Male, Pink = Female
- Adjacent seat to a female is blocked (striped) for male passengers
- Tap "Confirm on WhatsApp" → seats blocked instantly for ALL customers

### Auto-reset
Seat data is automatically deleted 2 hours after the bus departure time for that date.

### Admin unblock (password: `Swift@8606`)
- Click "🔐 Admin — Manage / Unblock Seats" button
- Enter password
- Click any blue/pink seat to unblock it
- Or use "Clear All Today" / "Full Reset" buttons

### Change admin password
Open `book-seat.html` → find `const ADMIN_PASSWORD = "Swift@8606"` → change it → save

---

## config.js quick reference

```js
// Route → Bus link (one route = one bus)
{ id:"barwani-bokrata", busId:"bus1", ... }

// Booked seats with gender
bookedSeats: [
  { num:3, gender:"M" },   // Blue
  { num:7, gender:"F" },   // Pink
]

// Driver info
driver: {
  name:    "Ramesh Kumar Patel",
  phone:   "+91 98765 43210",
  licence: "MP-09-20180045672",
  exp:     "12 Years Experience",
  photo:   "images/driver1.jpeg"
}
```
