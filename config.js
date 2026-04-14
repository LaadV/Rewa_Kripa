/**
 * ============================================================
 *  REWA KRIPA TRAVELS — WEBSITE CONFIGURATION FILE
 *  config.js
 * ============================================================
 *
 *  THIS IS THE ONLY FILE YOU NEED TO EDIT.
 *  All changes here automatically update across the entire website.
 *
 *  HOW TO EDIT:
 *  - Change any value between the quotes " " or numbers
 *  - Do NOT delete commas, brackets { } [ ] or quotes
 *  - Save the file and refresh the browser
 *
 *  SECTIONS IN THIS FILE:
 *  1. COMPANY INFO       — name, address, phone, email
 *  2. HERO / BANNER      — homepage headline, subtitle, images
 *  3. STATS              — the 4 numbers shown on homepage banner
 *  4. BUSES              — bus numbers, types, fares, amenities
 *  5. ROUTES             — route names, fares, timings, ratings
 *  6. TRIPS              — special trips, prices, itinerary, inclusions
 *  7. WHATSAPP NUMBER    — booking phone number
 *
 * ============================================================
 */

var CONFIG = {

  /* ============================================================
     1. COMPANY INFO
     ============================================================ */
  company: {
    name:        "REWA KRIPA",              // Brand name shown in header & footer
    fullName:    "Rewa Kripa Travels",      // Full legal name
    tagline:     "Your Journey, Our Pride", // Short tagline
    established: "2008",                    // Year founded
    whatsapp:    "919977855338",            // WhatsApp number (with country code, no +)
    phone:       "+91 99778 55338",         // Display phone number
    email:       "rewakripa@gmail.com",     // Support email
    emailBiz:    "business@rewakripa.com",  // Business email
    instagram:   "https://www.instagram.com/rewa_kripa_travels_/",
    address: {
      line1:   "Bus Station, Navalpura",
      city:    "Barwani",
      state:   "Madhya Pradesh",
      pin:     "451551",
      country: "India",
      mapLink: "https://maps.google.com/?q=Navalpura+Bus+Station+Barwani+MP"
    },
    hours: {
      weekdays: "Monday – Saturday: 6:00 AM – 9:00 PM",
      sunday:   "Sunday: 7:00 AM – 2:00 PM"
    }
  },

  /* ============================================================
     2. HERO / BANNER
     ============================================================ */
  hero: {
    eyebrow:   "🚌 Madhya Pradesh's Trusted Bus Service Since 2008",
    heading1:  "Travel Safe &",   // First line of big heading
    heading2:  "Comfortable",     // Second line (shown in teal color)
    subtext:   "Barwani · Pati · Bokrata · Indore · Anjad — Connecting MP daily",
    btnBook:   "Book Your Seat",
    btnRoutes: "View Routes",
    // Slider images — add or remove image paths here
    slides: [
      "images/bus1.jpeg",
      "images/bus2.jpeg",
      "images/bus3.jpeg",
      "images/bus4.jpeg",
      "images/bus5.jpeg"
    ]
  },

  /* ============================================================
     3. HOMEPAGE STATS BAR
     (The 4 numbers shown on the bottom of the hero banner)
     ============================================================ */
  stats: [
    { num: "15+",  label: "Years Running"      },
    { num: "4",    label: "Premium Buses"       },
    { num: "50K+", label: "Passengers Served"   },
    { num: "4.0★", label: "Avg Rating"          }
  ],

  /* ============================================================
     4. BUSES
     Each bus is one entry in this list.
     To add a new bus: copy one block from { to }, add a comma, paste it.
     To remove a bus: delete the entire block from { to }.
     ============================================================ */
  buses: [
    {
      id:       "bus1",                   // Internal ID — must be unique, no spaces
      plate:    "MP09CY8606",             // Bus number plate
      title:    "Luxury Seater",          // Bus type name
      image:    "images/bus1.jpeg",       // Photo path
      type:     "AC Seater",              // Short type shown on card
      layout:   "2×2",                   // Seat layout
      capacity: 40,                       // Total seats
      climate:  "Full AC",               // AC / Non-AC / Fans
      price:    230,                      // Price per seat in ₹
      route:    "Barwani → Pati → Bokrata", // Main route
      departure:"08:00 AM",              // Departure time
      tags:     ["❄️ AC", "📶 WiFi", "🔌 USB", "💺 Recliner"],
      features: [
        "❄️ Air Conditioning",
        "📶 Free WiFi",
        "🔌 USB Charging",
        "💺 Recliner Seats",
        "💡 Reading Light",
        "📹 CCTV Camera"
      ],
      description: "Our flagship Luxury Seater with premium 2×2 recliner seating, USB charging on every seat, free WiFi, and full AC. Ideal for the Barwani–Bokrata corridor.",
      bookedSeats: [3, 7, 12, 18, 24, 29]  // Seats already booked (shown in red on map)
    },
    {
      id:       "bus2",
      plate:    "MP09CY7782",
      title:    "AC Seater",
      image:    "images/bus2.jpeg",
      type:     "AC Pushback",
      layout:   "2×2",
      capacity: 44,
      climate:  "Full AC",
      price:    230,
      route:    "Barwani → Pati",
      departure:"09:00 AM",
      tags:     ["❄️ AC", "💡 Reading Light", "☕ Cup Holder"],
      features: [
        "❄️ Air Conditioning",
        "💡 Reading Light",
        "☕ Cup Holder",
        "🔌 USB Charging",
        "💺 Pushback Seats",
        "📹 CCTV Camera"
      ],
      description: "Comfortable AC Seater with pushback reclining, cup holders, and reading lights. Great for medium-distance daily travel.",
      bookedSeats: [2, 5, 11, 20, 31]
    },
    {
      id:       "bus3",
      plate:    "MP09CY9911",
      title:    "Premium Coach",
      image:    "images/bus3.jpeg",
      type:     "Premium AC",
      layout:   "2×1",
      capacity: 36,
      climate:  "Full AC",
      price:    350,
      route:    "Indore → Barwani",
      departure:"07:00 AM",
      tags:     ["🎬 Entertainment", "🍿 Snacks", "📺 LED"],
      features: [
        "🎬 Entertainment System",
        "🍿 Complimentary Snacks",
        "📺 LED Displays",
        "❄️ Full AC",
        "🔌 USB Charging",
        "📶 Free WiFi"
      ],
      description: "The ultimate travel experience on wheels. Entertainment system, complimentary snacks, LED displays, and spacious 2×1 premium seating.",
      bookedSeats: [1, 8, 15, 22]
    },
    {
      id:       "bus4",
      plate:    "MP09CY4455",
      title:    "Budget Seater",
      image:    "images/bus4.jpeg",
      type:     "Non-AC Seater",
      layout:   "2×3",
      capacity: 52,
      climate:  "Ceiling Fans",
      price:    170,
      route:    "Anjad → Indore",
      departure:"07:30 AM",
      tags:     ["💨 Fan", "💰 Budget", "🧳 Luggage"],
      features: [
        "💨 Ceiling Fans",
        "🧳 Luggage Racks",
        "💰 Budget Fares",
        "⏱️ On-time Service"
      ],
      description: "Reliable and economical. Clean, punctual, and ideal for budget-conscious travellers on shorter routes.",
      bookedSeats: [4, 9, 14, 19, 28, 35, 42]
    }
  ],

  /* ============================================================
     5. ROUTES
     Each route is one entry.
     ============================================================ */
  routes: [
    {
      id:        "barwani-bokrata",
      from:      "Barwani",
      to:        "Bokrata",
      via:       "Pati",                         // Leave blank "" if no via stop
      label:     "Barwani → Pati → Bokrata",
      image:     "images/bus1.jpeg",
      duration:  "4.5 hrs",
      type:      "MP State Highway · Daily",
      firstBus:  "08:30 AM",
      lastBus:   "05:00 PM",
      price:     230,                            // ₹ per seat
      rating:    4.9,
      reviews:   "1,060+",
      status:    "open",                         // "open" or "closed"
    },
    {
      id:        "indore-barwani",
      from:      "Indore",
      to:        "Barwani",
      via:       "",
      label:     "Indore → Barwani",
      image:     "images/bus4.jpeg",
      duration:  "3–4 hrs",
      type:      "Daily Highway Route",
      firstBus:  "06:50 AM",
      lastBus:   "08:30 PM",
      price:     230,
      rating:    4.8,
      reviews:   "980+",
      status:    "open"
    },
    {
      id:        "barwani-indore",
      from:      "Barwani",
      to:        "Indore",
      via:       "",
      label:     "Barwani → Indore",
      image:     "images/bus2.jpeg",
      duration:  "3–4 hrs",
      type:      "Express Route",
      firstBus:  "08:30 AM",
      lastBus:   "04:15 PM",
      price:     230,
      rating:    4.7,
      reviews:   "860+",
      status:    "open"
    },
    {
      id:        "anjad-indore",
      from:      "Anjad",
      to:        "Indore",
      via:       "",
      label:     "Anjad → Indore",
      image:     "images/bus3.jpeg",
      duration:  "2.5 hrs",
      type:      "Daily Morning Route",
      firstBus:  "07:30 AM",
      lastBus:   "12:00 PM",
      price:     170,
      rating:    4.6,
      reviews:   "540+",
      status:    "open"
    }
  ],

  /* ============================================================
     6. TRIPS
     Special group trips and packages.
     Each trip can have its own itinerary, inclusions, and pricing.

     badge options: "popular" | "trending" | "spiritual" | "daily"
     ============================================================ */
  trips: [
    {
      id:          "chardham",
      title:       "Barwani → Char Dham Yatra 2026",
      shortTitle:  "Char Dham Yatra",
      subtitle:    "Luxury 15-day pilgrimage — Yamunotri, Gangotri, Kedarnath & Badrinath",
      image:       "images/bus3.jpeg",
      badge:       "spiritual",
      badgeLabel:  "🙏 Spiritual",
      price:       21000,                        // ₹ per person
      departure:   "May 15, 2026",
      returnDate:  "May 29, 2026",
      duration:    "15 Days",
      seatsLeft:   6,
      meals:       "Breakfast + Dinner Included",
      busType:     "Luxury AC Coach",
      description: "Embark on the most sacred journey of your lifetime — the Char Dham Yatra, now with luxury stays and full-board meals. Visit all four holy abodes of the Himalayas: Yamunotri, Gangotri, Kedarnath, and Badrinath. Travel in our premium AC luxury coach with recliner seats. All hotels are 3-star properties with attached bathrooms. Breakfast and dinner included every day. This 15-day package from Barwani is priced at ₹21,000 per person.",
      itinerary: [
        { day: "Day 1",   title: "Departure from Barwani",          desc: "Depart from Navalpura Bus Stand at 06:00 AM. Overnight journey toward Haridwar." },
        { day: "Day 2",   title: "Haridwar & Rishikesh",            desc: "Arrive Haridwar. Check-in at hotel. Evening Ganga Aarti at Har Ki Pauri. Visit Rishikesh." },
        { day: "Day 3",   title: "Journey to Barkot",               desc: "Drive to Barkot — base camp for Yamunotri. Scenic mountain roads. Check-in and rest." },
        { day: "Day 4",   title: "Yamunotri Dham",                  desc: "Trek 6 km to Yamunotri temple. Holy dip in Yamuna. Return to Barkot." },
        { day: "Day 5",   title: "Journey to Uttarkashi",           desc: "Drive through Yamuna valley to Uttarkashi. 3-star hotel check-in." },
        { day: "Day 6",   title: "Gangotri Dham",                   desc: "Visit Gangotri temple — origin of the sacred Ganga. Morning aarti. Return to Uttarkashi." },
        { day: "Day 7",   title: "Journey to Guptkashi",            desc: "Scenic drive through Tehri and Augustmuni to Guptkashi. Rest and acclimatization." },
        { day: "Day 8",   title: "Gaurikund to Kedarnath",          desc: "Trek 16 km (or optional helicopter) to Kedarnath. Check-in at guest house." },
        { day: "Day 9",   title: "Kedarnath Dham Darshan",          desc: "Early morning Abhishek puja at Kedarnath — one of the 12 Jyotirlingas. Trek back to Gaurikund." },
        { day: "Day 10",  title: "Journey to Badrinath",            desc: "Drive through Joshimath to the holy town of Badrinath. 3-star hotel." },
        { day: "Day 11",  title: "Badrinath Dham Darshan",          desc: "Abhishek puja at Badrinath temple. Visit Mana Village, Vasudhara Falls, Brahma Kapal." },
        { day: "Day 12",  title: "Badrinath to Rishikesh",          desc: "Descend from Badrinath. Drive to Rishikesh. Optional river rafting." },
        { day: "Day 13",  title: "Haridwar Sightseeing & Shopping", desc: "Chandi Devi, Maya Devi temple, Har Ki Pauri market. Prasad shopping." },
        { day: "Day 14",  title: "Return Journey Begins",           desc: "Depart Haridwar for Barwani. Overnight journey in luxury AC coach." },
        { day: "Day 15",  title: "Arrival in Barwani",              desc: "Arrive Barwani by afternoon with divine blessings, prasad, and memories of a lifetime." }
      ],
      inclusions: [
        "🚌 Luxury AC Coach (Recliner Seats)",
        "🏨 13 Nights (3-Star Hotels)",
        "🍳 Breakfast Daily (All 15 Days)",
        "🍽️ Dinner Daily (All 15 Days)",
        "🙏 Puja Samagri & Prasad",
        "👨‍💼 Experienced Tour Guide",
        "🧳 Luggage Assistance",
        "🩺 First Aid & Medical Kit",
        "📿 Temple Entry Arrangements",
        "🎫 All Toll & Parking Charges"
      ],
      exclusions: [
        "✈️ Air/Train Tickets",
        "🚁 Helicopter to Kedarnath (Optional — ~₹5,000 extra)",
        "🥗 Lunch",
        "📸 Personal Expenses",
        "💊 Personal Medication"
      ],
      notes: [
        "Carry government-issued photo ID (Aadhaar/PAN/Passport).",
        "Warm woolens and rain gear are essential.",
        "Mobile network is limited at high-altitude areas.",
        "25% advance payment required to confirm booking.",
        "Cancellation: 50% refund if cancelled 15+ days before departure."
      ]
    },
    {
      id:          "goa",
      title:       "Barwani → Goa Weekend Trip",
      shortTitle:  "Goa Beach Trip",
      subtitle:    "Sun, sand & serenity — 3 days in Goa",
      image:       "images/bus1.jpeg",
      badge:       "popular",
      badgeLabel:  "🔥 Popular",
      price:       3200,
      departure:   "Apr 20, 2026",
      returnDate:  "Apr 23, 2026",
      duration:    "3 Days",
      seatsLeft:   8,
      meals:       "Breakfast Included",
      busType:     "Premium AC Coach",
      description: "Escape to the golden shores of Goa — India's beloved beach destination. Covers the best of North and South Goa, from vibrant Baga beach to historic Old Goa churches.",
      itinerary: [
        { day: "Day 1", title: "Departure from Barwani", desc: "Depart Navalpura Bus Stand at 6:00 PM. Comfortable overnight journey in AC coach." },
        { day: "Day 2", title: "North Goa Beaches",      desc: "Arrive Goa by morning. Check-in near Baga Beach. Explore Baga, Calangute, and Anjuna beaches." },
        { day: "Day 3", title: "South Goa & Old Goa",    desc: "Palolem Beach. Basilica of Bom Jesus (UNESCO), Se Cathedral, Goa Museum." },
        { day: "Day 4", title: "Return Journey",          desc: "Depart Goa at 6:00 PM. Arrive Barwani by next morning." }
      ],
      inclusions: [
        "🚌 AC Coach (Both Ways)",
        "🏨 2 Nights Hotel (Beachside)",
        "🍳 Breakfast Daily",
        "🗺️ Tour Guide",
        "📸 Sightseeing Stops",
        "💊 First Aid Kit"
      ],
      exclusions: ["🥗 Lunch & Dinner", "🏄 Water Sports", "📸 Personal Expenses"],
      notes: ["Carry valid photo ID.", "Sunscreen and beach-wear recommended.", "30% advance to confirm booking."]
    },
    {
      id:          "manali",
      title:       "Barwani → Manali Hill Trip",
      shortTitle:  "Manali Hill Trip",
      subtitle:    "Himalayan heights — 5 magical days in the mountains",
      image:       "images/bus2.jpeg",
      badge:       "trending",
      badgeLabel:  "❄️ Trending",
      price:       5500,
      departure:   "May 5, 2026",
      returnDate:  "May 10, 2026",
      duration:    "5 Days",
      seatsLeft:   15,
      meals:       "Breakfast + Dinner",
      busType:     "Luxury AC Coach",
      description: "Journey to Manali — the jewel of the Himalayas. Snow-capped peaks, roaring rivers, and the legendary charm of Kullu valley.",
      itinerary: [
        { day: "Day 1", title: "Departure from Barwani",      desc: "Overnight departure from Barwani in premium AC coach." },
        { day: "Day 2", title: "Arrival in Manali",           desc: "Check-in at hotel. Rest and acclimatization. Evening at Mall Road." },
        { day: "Day 3", title: "Solang Valley",               desc: "Full day at Solang Valley — snow activities, zorbing, paragliding (extra cost)." },
        { day: "Day 4", title: "Hadimba Temple & Vashisht",   desc: "Hadimba Devi Temple, Manu Temple, Vashisht Hot Springs, Tibetan market." },
        { day: "Day 5", title: "Kullu & Departure",           desc: "River rafting (optional). Kullu shawl market. Evening departure for Barwani." }
      ],
      inclusions: [
        "🚌 Luxury AC Coach",
        "🏨 4 Nights Hotel (Mountain View)",
        "🍳 Breakfast Daily",
        "🍽️ Dinner Daily",
        "🗺️ Expert Guide",
        "💊 First Aid Kit"
      ],
      exclusions: ["🥗 Lunch", "🏔️ Rohtang Permit (~₹500–1000 extra)", "🪂 Paragliding", "📸 Personal Expenses"],
      notes: ["Carry warm woolens — temps can drop to 5–10°C.", "25% advance required."]
    },
    {
      id:          "shirdi",
      title:       "Shirdi Sai Baba Yatra",
      shortTitle:  "Shirdi Yatra",
      subtitle:    "Seek blessings at Shirdi — 4 days of spiritual peace",
      image:       "images/bus1.jpeg",
      badge:       "spiritual",
      badgeLabel:  "🙏 Spiritual",
      price:       4500,
      departure:   "Jun 1, 2026",
      returnDate:  "Jun 4, 2026",
      duration:    "4 Days",
      seatsLeft:   12,
      meals:       "Breakfast + Dinner",
      busType:     "AC Bus",
      description: "A peaceful pilgrimage to Shirdi. Participate in the morning aarti at Sai Baba Samadhi Mandir, explore Chavadi, and visit Shani Shingnapur and Trimbakeshwar.",
      itinerary: [
        { day: "Day 1", title: "Departure from Barwani",      desc: "Evening departure. Overnight AC journey to Shirdi." },
        { day: "Day 2", title: "Shirdi Darshan",              desc: "Morning Aarti at Sai Baba Samadhi Mandir. Dwarkamai and Chavadi visit." },
        { day: "Day 3", title: "Shani Shingnapur & Nashik",   desc: "Shani Shingnapur temple. Trimbakeshwar Jyotirlinga at Nashik." },
        { day: "Day 4", title: "Final Darshan & Return",      desc: "Early morning final Darshan. Prasad distribution. Depart for Barwani." }
      ],
      inclusions: [
        "🚌 AC Bus (Both Ways)",
        "🏨 3 Nights Dharamshala/Hotel",
        "🍳 Breakfast Daily",
        "🍽️ Dinner Daily",
        "🙏 Puja Arrangements",
        "🎁 Sai Prasad"
      ],
      exclusions: ["🥗 Lunch", "📸 Personal Expenses", "🛒 Shopping"],
      notes: ["Modest clothing required at temple.", "Carry valid photo ID.", "20% advance to confirm."]
    }
  ],

  /* ============================================================
     7. FOOTER LINKS
     Control which links appear in footer columns.
     ============================================================ */
  footer: {
    helpLinks: [
      { label: "Get Help",                href: "help.html"           },
      { label: "Cancellations & Refunds", href: "cancellations.html"  },
      { label: "Terms of Sale",           href: "terms-of-sale.html"  },
      { label: "Cookie Policy",           href: "cookie-policy.html"  },
      { label: "Terms of Use",            href: "terms-of-use.html"   }
    ],
    companyLinks: [
      { label: "About Us",        href: "about.html"          },
      { label: "Blog",            href: "blog.html"           },
      { label: "Travel Stories",  href: "travel-stories.html" },
      { label: "Careers",         href: "careers.html"        }
    ]
  },

  /* ============================================================
     8. FINANCE CONFIG
     Settings for the Finance Manager (finance.html).
     Edit only values — do not remove commas or brackets.
     ============================================================ */
  finance: {

    // ── Password for Finance Manager login ──────────────────
    adminPassword: "Swift@8606",   // Change this to your preferred password

    // ── Income categories (shown in Add Entry form) ─────────
    incomeCategories: [
      "Daily Route",
      "Tour Package",
      "Marriage Booking",
      "Party Booking",
      "Charter / Private Hire",
      "Festival Special",
      "School Trip",
      "Corporate Booking",
      "Other Income"
    ],

    // ── Expense categories (shown in Add Entry form) ─────────
    expenseCategories: [
      "Fuel",
      "Driver Salary",
      "Conductor Salary",
      "Helper Salary",
      "Bus Repair",
      "Tyre Puncture",
      "Tyre Replacement",
      "Engine Repair",
      "Oil & Lubricants",
      "Bus Wash",
      "Toll Tax",
      "Parking",
      "Insurance",
      "Road Tax / Permit",
      "Fitness Certificate",
      "Spare Parts",
      "AC Repair",
      "Electrical Repair",
      "Driver Food / Allowance",
      "Other Expense"
    ],

    // ── Quick-amount chips in the entry form ─────────────────
    quickAmounts: [100, 200, 500, 1000, 2000, 5000, 10000, 15000, 20000, 50000]

  }

};

/* ============================================================
   DO NOT EDIT BELOW THIS LINE
   Helper functions used by all pages
   ============================================================ */

// Get a bus by ID
function getBus(id) {
  return CONFIG.buses.find(function(b){ return b.id === id; }) || CONFIG.buses[0];
}

// Get a route by ID
function getRoute(id) {
  return CONFIG.routes.find(function(r){ return r.id === id; }) || CONFIG.routes[0];
}

// Get a trip by ID
function getTrip(id) {
  return CONFIG.trips.find(function(t){ return t.id === id; }) || CONFIG.trips[0];
}

// Format Indian Rupees
function formatINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

// Badge class map
function badgeClass(badge) {
  var map = { popular:'badge-popular', trending:'badge-trending', spiritual:'badge-spiritual', daily:'badge-daily' };
  return map[badge] || 'badge-daily';
}

// Build footer HTML and inject it wherever <div id="site-footer"></div> exists
function buildFooter(activePage) {
  var c = CONFIG.company;
  var f = CONFIG.footer;
  var helpLinks = f.helpLinks.map(function(l){
    return '<a href="'+l.href+'">'+l.label+'</a>';
  }).join('');
  var compLinks = f.companyLinks.map(function(l){
    return '<a href="'+l.href+'">'+l.label+'</a>';
  }).join('');

  document.getElementById('site-footer').innerHTML =
    '<footer>'+
    '<div class="container">'+
    '<div class="footer-grid">'+
      '<div class="footer-brand">'+
        '<span class="footer-logo">'+c.name+'</span>'+
        '<p>'+c.address.line1+', '+c.address.city+' — '+c.address.pin+', '+c.address.state+'. Serving MP since '+c.established+'.</p>'+
        '<div class="footer-social">'+
          '<a href="'+c.instagram+'" target="_blank">📸</a>'+
          '<a href="#">✖</a><a href="#">💼</a><a href="#">📘</a>'+
        '</div>'+
      '</div>'+
      '<div class="footer-col"><h4>Help</h4>'+helpLinks+'</div>'+
      '<div class="footer-col"><h4>Company</h4>'+compLinks+'</div>'+
      '<div class="footer-col">'+
        '<h4>Contact</h4>'+
        '<div class="contact-row">📱 <span>'+c.phone+'</span></div>'+
        '<div class="contact-row">📧 <span>'+c.email+'</span></div>'+
        '<div class="contact-row">📍 <span>'+c.address.line1+', '+c.address.city+' '+c.address.pin+'</span></div>'+
        '<div class="contact-row">🕐 <span>'+c.hours.weekdays+'</span></div>'+
      '</div>'+
    '</div>'+
    '<div class="footer-bottom">'+
      '<span>© '+new Date().getFullYear()+' '+c.fullName+', '+c.address.city+'. All rights reserved.</span>'+
      '<div class="footer-payments">'+
        '<span class="pay-badge">VISA</span>'+
        '<span class="pay-badge">Mastercard</span>'+
        '<span class="pay-badge">UPI</span>'+
        '<span class="pay-badge">RuPay</span>'+
      '</div>'+
    '</div>'+
    '</div>'+
    '</footer>';
}

// Build header HTML
function buildHeader(activePage) {
  var c = CONFIG.company;
  var links = [
    { label:'Home',      href:'index.html'       },
    { label:'Our Buses', href:'index.html#buses'  },
    { label:'Routes',    href:'index.html#routes' },
    { label:'Trips',     href:'upcoming-trip.html'},
    { label:'About',     href:'about.html'        },
    { label:'Contact',   href:'contact.html'      }
  ];
  var navHTML = links.map(function(l){
    var cls = (activePage === l.href) ? ' class="active"' : '';
    return '<a href="'+l.href+'"'+cls+'>'+l.label+'</a>';
  }).join('');
  navHTML += '<a href="book-seat.html" class="btn-book">Book Now</a>';
  navHTML += '<a href="admin.html" style="margin-left:4px;padding:7px 12px;background:rgba(255,255,255,.08);border-radius:6px;font-size:13px;color:rgba(255,255,255,.65);font-weight:500;transition:.2s;">⚙️ Admin</a>';

  document.getElementById('site-header').innerHTML =
    '<header>'+
    '<div class="container header-inner">'+
      '<div class="logo"><a href="index.html">'+c.name+'</a></div>'+
      '<nav>'+navHTML+'</nav>'+
    '</div>'+
    '</header>';
}
