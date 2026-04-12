/**
 * ============================================================
 *  REWA KRIPA TRAVELS — config.js
 *  THE ONLY FILE YOU NEED TO EDIT for content changes.
 *
 *  NEW in this version:
 *  - Each ROUTE has a busId  → one route = one fixed bus
 *  - Each BUS has a driver{} → shown in Driver Info modal
 *  - bookedSeats now support gender: { num:3, gender:"M" }
 *    M = Male (blue)  |  F = Female (pink)
 *  - getBusForRoute() helper added below
 *
 *  FIREBASE (shared seat state — all customers see same map):
 *  Edit the FIREBASE section in book-seat.html
 * ============================================================
 */

var CONFIG = {

  /* ── 1. COMPANY ── */
  company: {
    name:        "REWA KRIPA",
    fullName:    "Rewa Kripa Travels",
    tagline:     "Your Journey, Our Pride",
    established: "2008",
    whatsapp:    "919977855338",
    phone:       "+91 99778 55338",
    email:       "rewakripa@gmail.com",
    emailBiz:    "business@rewakripa.com",
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
      weekdays: "Monday \u2013 Saturday: 6:00 AM \u2013 9:00 PM",
      sunday:   "Sunday: 7:00 AM \u2013 2:00 PM"
    }
  },

  /* ── 2. HERO BANNER ── */
  hero: {
    eyebrow:   "\uD83D\uDE8C Madhya Pradesh\u2019s Trusted Bus Service Since 2008",
    heading1:  "Travel Safe &",
    heading2:  "Comfortable",
    subtext:   "Barwani \u00B7 Pati \u00B7 Bokrata \u00B7 Indore \u00B7 Anjad \u2014 Connecting MP daily",
    btnBook:   "Book Your Seat",
    btnRoutes: "View Routes",
    slides: [
      "images/bus1.jpeg",
      "images/bus2.jpeg",
      "images/bus3.jpeg",
      "images/bus4.jpeg",
      "images/bus5.jpeg"
    ]
  },

  /* ── 3. STATS BAR ── */
  stats: [
    { num: "15+",  label: "Years Running"    },
    { num: "4",    label: "Premium Buses"    },
    { num: "50K+", label: "Passengers Served"},
    { num: "4.0\u2605", label: "Avg Rating"  }
  ],

  /* ── 4. BUSES
     bookedSeats: { num:3, gender:"M" } or { num:7, gender:"F" }
     driver: shown in Driver Info modal on book-seat page
  ── */
  buses: [
    {
      id:       "bus1",
      plate:    "MP09CY8606",
      title:    "Luxury Seater",
      image:    "images/bus1.jpeg",
      type:     "AC Seater",
      layout:   "2\u00D72",
      capacity: 40,
      climate:  "Full AC",
      price:    230,
      route:    "Barwani \u2192 Pati \u2192 Bokrata",
      departure:"08:00 AM",
      tags:     ["\u2744\uFE0F AC", "\uD83D\uDCF6 WiFi", "\uD83D\uDD0C USB", "\uD83D\uDCBA Recliner"],
      features: ["\u2744\uFE0F Air Conditioning","\uD83D\uDCF6 Free WiFi","\uD83D\uDD0C USB Charging","\uD83D\uDCBA Recliner Seats","\uD83D\uDCA1 Reading Light","\uD83D\uDCF9 CCTV Camera"],
      description: "Our flagship Luxury Seater with premium 2\u00D72 recliner seating, USB charging on every seat, free WiFi, and full AC. Ideal for the Barwani\u2013Bokrata corridor.",
      bookedSeats: [
        { num:3,  gender:"M" }, { num:7,  gender:"F" },
        { num:12, gender:"M" }, { num:18, gender:"F" },
        { num:24, gender:"M" }, { num:29, gender:"F" }
      ],
      driver: {
        name:    "Ramesh Kumar Patel",
        phone:   "+91 98765 43210",
        licence: "MP-09-20180045672",
        exp:     "12 Years Experience",
        photo:   "images/driver1.jpeg"
      }
    },
    {
      id:       "bus2",
      plate:    "MP09CY7782",
      title:    "AC Seater",
      image:    "images/bus2.jpeg",
      type:     "AC Pushback",
      layout:   "2\u00D72",
      capacity: 44,
      climate:  "Full AC",
      price:    230,
      route:    "Barwani \u2192 Pati",
      departure:"09:00 AM",
      tags:     ["\u2744\uFE0F AC", "\uD83D\uDCA1 Reading Light", "\u2615 Cup Holder"],
      features: ["\u2744\uFE0F Air Conditioning","\uD83D\uDCA1 Reading Light","\u2615 Cup Holder","\uD83D\uDD0C USB Charging","\uD83D\uDCBA Pushback Seats","\uD83D\uDCF9 CCTV Camera"],
      description: "Comfortable AC Seater with pushback reclining, cup holders, and reading lights. Great for medium-distance daily travel.",
      bookedSeats: [
        { num:2,  gender:"F" }, { num:5,  gender:"M" },
        { num:11, gender:"M" }, { num:20, gender:"F" },
        { num:31, gender:"M" }
      ],
      driver: {
        name:    "Suresh Yadav",
        phone:   "+91 97654 32109",
        licence: "MP-09-20150034521",
        exp:     "9 Years Experience",
        photo:   "images/driver2.jpeg"
      }
    },
    {
      id:       "bus3",
      plate:    "MP09CY9911",
      title:    "Premium Coach",
      image:    "images/bus3.jpeg",
      type:     "Premium AC",
      layout:   "2\u00D71",
      capacity: 36,
      climate:  "Full AC",
      price:    350,
      route:    "Indore \u2192 Barwani",
      departure:"07:00 AM",
      tags:     ["\uD83C\uDFAC Entertainment", "\uD83C\uDF7F Snacks", "\uD83D\uDCFA LED"],
      features: ["\uD83C\uDFAC Entertainment System","\uD83C\uDF7F Complimentary Snacks","\uD83D\uDCFA LED Displays","\u2744\uFE0F Full AC","\uD83D\uDD0C USB Charging","\uD83D\uDCF6 Free WiFi"],
      description: "The ultimate travel experience. Entertainment system, complimentary snacks, LED displays, and spacious 2\u00D71 premium seating.",
      bookedSeats: [
        { num:1,  gender:"M" }, { num:8,  gender:"F" },
        { num:15, gender:"M" }, { num:22, gender:"F" }
      ],
      driver: {
        name:    "Anil Kumar Sharma",
        phone:   "+91 94321 87650",
        licence: "MP-09-20120023456",
        exp:     "15 Years Experience",
        photo:   "images/driver3.jpeg"
      }
    },
    {
      id:       "bus4",
      plate:    "MP09CY4455",
      title:    "Budget Seater",
      image:    "images/bus4.jpeg",
      type:     "Non-AC Seater",
      layout:   "2\u00D73",
      capacity: 52,
      climate:  "Ceiling Fans",
      price:    170,
      route:    "Anjad \u2192 Indore",
      departure:"07:30 AM",
      tags:     ["\uD83D\uDCA8 Fan", "\uD83D\uDCB0 Budget", "\uD83E\uDDF3 Luggage"],
      features: ["\uD83D\uDCA8 Ceiling Fans","\uD83E\uDDF3 Luggage Racks","\uD83D\uDCB0 Budget Fares","\u23F1\uFE0F On-time Service"],
      description: "Reliable and economical. Clean, punctual, and ideal for budget-conscious travellers on shorter routes.",
      bookedSeats: [
        { num:4,  gender:"M" }, { num:9,  gender:"F" },
        { num:14, gender:"M" }, { num:19, gender:"F" },
        { num:28, gender:"M" }, { num:35, gender:"F" },
        { num:42, gender:"M" }
      ],
      driver: {
        name:    "Mohan Singh Rawat",
        phone:   "+91 93210 76543",
        licence: "MP-09-20170056789",
        exp:     "7 Years Experience",
        photo:   "images/driver4.jpeg"
      }
    }
  ],

  /* ── 5. ROUTES
     busId links each route to exactly one bus (no bus dropdown needed).
  ── */
  routes: [
    {
      id:       "barwani-bokrata",
      busId:    "bus1",
      from:     "Barwani", to: "Bokrata", via: "Pati",
      label:    "Barwani \u2192 Pati \u2192 Bokrata",
      image:    "images/bus1.jpeg",
      duration: "4.5 hrs",
      type:     "MP State Highway \u00B7 Daily",
      firstBus: "08:00 AM",
      lastBus:  "05:00 PM",
      price:    230, rating: 4.9, reviews: "1,060+", status: "open"
    },
    {
      id:       "indore-barwani",
      busId:    "bus3",
      from:     "Indore", to: "Barwani", via: "",
      label:    "Indore \u2192 Barwani",
      image:    "images/bus3.jpeg",
      duration: "3\u20134 hrs",
      type:     "Daily Highway Route",
      firstBus: "07:00 AM",
      lastBus:  "08:30 PM",
      price:    350, rating: 4.8, reviews: "980+", status: "open"
    },
    {
      id:       "barwani-indore",
      busId:    "bus2",
      from:     "Barwani", to: "Indore", via: "",
      label:    "Barwani \u2192 Indore",
      image:    "images/bus2.jpeg",
      duration: "3\u20134 hrs",
      type:     "Express Route",
      firstBus: "09:00 AM",
      lastBus:  "04:15 PM",
      price:    230, rating: 4.7, reviews: "860+", status: "open"
    },
    {
      id:       "anjad-indore",
      busId:    "bus4",
      from:     "Anjad", to: "Indore", via: "",
      label:    "Anjad \u2192 Indore",
      image:    "images/bus4.jpeg",
      duration: "2.5 hrs",
      type:     "Daily Morning Route",
      firstBus: "07:30 AM",
      lastBus:  "12:00 PM",
      price:    170, rating: 4.6, reviews: "540+", status: "open"
    }
  ],

  /* ── 6. TRIPS ── */
  trips: [
    {
      id:"chardham", title:"Barwani \u2192 Char Dham Yatra 2026",
      shortTitle:"Char Dham Yatra",
      subtitle:"Luxury 15-day pilgrimage \u2014 Yamunotri, Gangotri, Kedarnath & Badrinath",
      image:"images/bus3.jpeg", badge:"spiritual", badgeLabel:"\uD83D\uDE4F Spiritual",
      price:21000, departure:"May 15, 2026", returnDate:"May 29, 2026",
      duration:"15 Days", seatsLeft:6, meals:"Breakfast + Dinner Included", busType:"Luxury AC Coach",
      description:"Embark on the most sacred journey of your lifetime. Visit all four holy abodes of the Himalayas with luxury stays and full-board meals. All hotels are 3-star. \u20B921,000 per person.",
      itinerary:[
        {day:"Day 1",  title:"Departure from Barwani",          desc:"Depart Navalpura Bus Stand 06:00 AM. Overnight journey to Haridwar."},
        {day:"Day 2",  title:"Haridwar & Rishikesh",            desc:"Arrive Haridwar. Hotel check-in. Evening Ganga Aarti."},
        {day:"Day 3",  title:"Journey to Barkot",               desc:"Drive to Barkot \u2014 base camp for Yamunotri."},
        {day:"Day 4",  title:"Yamunotri Dham",                  desc:"Trek 6 km to Yamunotri. Holy dip in Yamuna."},
        {day:"Day 5",  title:"Journey to Uttarkashi",           desc:"Drive through Yamuna valley to Uttarkashi."},
        {day:"Day 6",  title:"Gangotri Dham",                   desc:"Visit Gangotri temple \u2014 origin of the sacred Ganga."},
        {day:"Day 7",  title:"Journey to Guptkashi",            desc:"Scenic drive to Guptkashi."},
        {day:"Day 8",  title:"Trek to Kedarnath",               desc:"Trek 16 km (or optional helicopter) to Kedarnath."},
        {day:"Day 9",  title:"Kedarnath Darshan",               desc:"Early morning Abhishek puja. Trek back."},
        {day:"Day 10", title:"Journey to Badrinath",            desc:"Drive through Joshimath to Badrinath."},
        {day:"Day 11", title:"Badrinath Darshan",               desc:"Puja at Badrinath. Mana Village. Vasudhara Falls."},
        {day:"Day 12", title:"Badrinath to Rishikesh",          desc:"Descend. Optional river rafting."},
        {day:"Day 13", title:"Haridwar Sightseeing & Shopping", desc:"Temples and Har Ki Pauri market."},
        {day:"Day 14", title:"Return Journey",                  desc:"Depart Haridwar for Barwani overnight."},
        {day:"Day 15", title:"Arrival in Barwani",              desc:"Arrive by afternoon with blessings and prasad."}
      ],
      inclusions:["\uD83D\uDE8C Luxury AC Coach","\uD83C\uDFE8 13 Nights (3-Star)","\uD83C\uDF73 Breakfast Daily","\uD83C\uDF7D\uFE0F Dinner Daily","\uD83D\uDE4F Puja Samagri & Prasad","\uD83E\uDDBA Expert Guide","\uD83E\uDDF3 Luggage Assistance","\uD83E\uDE7A First Aid Kit","\uD83D\uDCFF Temple Entry","\uD83C\uDFAB All Toll & Parking"],
      exclusions:["\u2708\uFE0F Air/Train Tickets","\uD83D\uDE81 Helicopter (~\u20B95,000 extra)","\uD83E\uDD57 Lunch","\uD83D\uDCF8 Personal Expenses","\uD83D\uDC8A Personal Medication"],
      notes:["Carry photo ID (Aadhaar/PAN/Passport).","Warm woolens and rain gear essential.","25% advance required.","Cancellation: 50% refund 15+ days before."]
    },
    {
      id:"goa", title:"Barwani \u2192 Goa Weekend Trip",
      shortTitle:"Goa Beach Trip",
      subtitle:"Sun, sand & serenity \u2014 3 days in Goa",
      image:"images/bus1.jpeg", badge:"popular", badgeLabel:"\uD83D\uDD25 Popular",
      price:3200, departure:"Apr 20, 2026", returnDate:"Apr 23, 2026",
      duration:"3 Days", seatsLeft:8, meals:"Breakfast Included", busType:"Premium AC Coach",
      description:"Escape to the golden shores of Goa. North and South Goa, Baga Beach to Old Goa churches.",
      itinerary:[
        {day:"Day 1",title:"Departure",desc:"Depart Navalpura 6:00 PM. Overnight AC journey."},
        {day:"Day 2",title:"North Goa Beaches",desc:"Arrive Goa. Check-in. Baga, Calangute, Anjuna."},
        {day:"Day 3",title:"South Goa & Old Goa",desc:"Palolem Beach. Basilica of Bom Jesus. Goa Museum."},
        {day:"Day 4",title:"Return Journey",desc:"Depart Goa 6:00 PM. Arrive Barwani next morning."}
      ],
      inclusions:["\uD83D\uDE8C AC Coach (Both Ways)","\uD83C\uDFE8 2 Nights Hotel (Beachside)","\uD83C\uDF73 Breakfast Daily","\uD83D\uDDFA\uFE0F Tour Guide","\uD83D\uDCF8 Sightseeing Stops","\uD83E\uDE7A First Aid Kit"],
      exclusions:["\uD83E\uDD57 Lunch & Dinner","\uD83C\uDFC4 Water Sports","\uD83D\uDCF8 Personal Expenses"],
      notes:["Carry valid photo ID.","Sunscreen and beach-wear recommended.","30% advance to confirm."]
    },
    {
      id:"manali", title:"Barwani \u2192 Manali Hill Trip",
      shortTitle:"Manali Hill Trip",
      subtitle:"Himalayan heights \u2014 5 magical days in the mountains",
      image:"images/bus2.jpeg", badge:"trending", badgeLabel:"\u2744\uFE0F Trending",
      price:5500, departure:"May 5, 2026", returnDate:"May 10, 2026",
      duration:"5 Days", seatsLeft:15, meals:"Breakfast + Dinner", busType:"Luxury AC Coach",
      description:"Journey to Manali \u2014 the jewel of the Himalayas. Snow-capped peaks, roaring rivers, the legendary charm of Kullu valley.",
      itinerary:[
        {day:"Day 1",title:"Departure from Barwani",desc:"Overnight departure in premium AC coach."},
        {day:"Day 2",title:"Arrival in Manali",desc:"Check-in. Rest. Evening at Mall Road."},
        {day:"Day 3",title:"Solang Valley",desc:"Snow activities, zorbing, paragliding (extra cost)."},
        {day:"Day 4",title:"Hadimba Temple & Vashisht",desc:"Hadimba Devi Temple, Hot Springs, Tibetan market."},
        {day:"Day 5",title:"Kullu & Departure",desc:"Optional rafting. Kullu shawl market. Evening departure."}
      ],
      inclusions:["\uD83D\uDE8C Luxury AC Coach","\uD83C\uDFE8 4 Nights Hotel (Mountain View)","\uD83C\uDF73 Breakfast Daily","\uD83C\uDF7D\uFE0F Dinner Daily","\uD83D\uDDFA\uFE0F Expert Guide","\uD83E\uDE7A First Aid Kit"],
      exclusions:["\uD83E\uDD57 Lunch","\uD83C\uDFD4\uFE0F Rohtang Permit (~\u20B9500\u20131000 extra)","\uD83E\uDE82 Paragliding","\uD83D\uDCF8 Personal Expenses"],
      notes:["Carry warm woolens \u2014 temps drop to 5\u201310\u00B0C.","25% advance required."]
    },
    {
      id:"shirdi", title:"Shirdi Sai Baba Yatra",
      shortTitle:"Shirdi Yatra",
      subtitle:"Seek blessings at Shirdi \u2014 4 days of spiritual peace",
      image:"images/bus1.jpeg", badge:"spiritual", badgeLabel:"\uD83D\uDE4F Spiritual",
      price:4500, departure:"Jun 1, 2026", returnDate:"Jun 4, 2026",
      duration:"4 Days", seatsLeft:12, meals:"Breakfast + Dinner", busType:"AC Bus",
      description:"A peaceful pilgrimage to Shirdi. Morning aarti at Sai Baba Samadhi Mandir, Shani Shingnapur and Trimbakeshwar.",
      itinerary:[
        {day:"Day 1",title:"Departure from Barwani",desc:"Evening departure. Overnight AC journey to Shirdi."},
        {day:"Day 2",title:"Shirdi Darshan",desc:"Morning Aarti at Sai Baba Samadhi Mandir. Dwarkamai and Chavadi."},
        {day:"Day 3",title:"Shani Shingnapur & Nashik",desc:"Shani Shingnapur. Trimbakeshwar Jyotirlinga."},
        {day:"Day 4",title:"Final Darshan & Return",desc:"Final Darshan. Prasad. Depart for Barwani."}
      ],
      inclusions:["\uD83D\uDE8C AC Bus (Both Ways)","\uD83C\uDFE8 3 Nights Hotel","\uD83C\uDF73 Breakfast Daily","\uD83C\uDF7D\uFE0F Dinner Daily","\uD83D\uDE4F Puja Arrangements","\uD83C\uDF81 Sai Prasad"],
      exclusions:["\uD83E\uDD57 Lunch","\uD83D\uDCF8 Personal Expenses","\uD83D\uDED2 Shopping"],
      notes:["Modest clothing required at temple.","Carry valid photo ID.","20% advance to confirm."]
    }
  ],

  /* ── 7. FOOTER LINKS ── */
  footer: {
    helpLinks: [
      { label:"Get Help",                href:"help.html"          },
      { label:"Cancellations & Refunds", href:"cancellations.html" },
      { label:"Terms of Sale",           href:"terms-of-sale.html" },
      { label:"Cookie Policy",           href:"cookie-policy.html" },
      { label:"Terms of Use",            href:"terms-of-use.html"  }
    ],
    companyLinks: [
      { label:"About Us",       href:"about.html"          },
      { label:"Blog",           href:"blog.html"           },
      { label:"Travel Stories", href:"travel-stories.html" },
      { label:"Careers",        href:"careers.html"        }
    ]
  }

};

/* ============================================================
   HELPERS — used by all pages
   ============================================================ */

function getBus(id)   { return CONFIG.buses.find(function(b){return b.id===id;})||CONFIG.buses[0]; }
function getRoute(id) { return CONFIG.routes.find(function(r){return r.id===id;})||CONFIG.routes[0]; }
function getTrip(id)  { return CONFIG.trips.find(function(t){return t.id===id;})||CONFIG.trips[0]; }

/** Returns the single bus assigned to a route via busId */
function getBusForRoute(routeId) {
  var r = getRoute(routeId);
  return r.busId ? getBus(r.busId) : CONFIG.buses[0];
}

function formatINR(n) { return '\u20B9'+Number(n).toLocaleString('en-IN'); }

function badgeClass(badge) {
  return {popular:'badge-popular',trending:'badge-trending',spiritual:'badge-spiritual',daily:'badge-daily'}[badge]||'badge-daily';
}

function buildHeader(activePage) {
  var c = CONFIG.company;
  var links = [
    {label:'Home',      href:'index.html'       },
    {label:'Our Buses', href:'index.html#buses'  },
    {label:'Routes',    href:'index.html#routes' },
    {label:'Trips',     href:'upcoming-trip.html'},
    {label:'About',     href:'about.html'        },
    {label:'Contact',   href:'contact.html'      }
  ];
  var nav = links.map(function(l){
    return '<a href="'+l.href+'"'+(activePage===l.href?' class="active"':'')+'>'+l.label+'</a>';
  }).join('')+'<a href="book-seat.html" class="btn-book">Book Now</a>';
  document.getElementById('site-header').innerHTML =
    '<header><div class="container header-inner">'+
    '<div class="logo"><a href="index.html">'+c.name+'</a></div>'+
    '<nav>'+nav+'</nav></div></header>';
}

function buildFooter() {
  var c=CONFIG.company, f=CONFIG.footer;
  document.getElementById('site-footer').innerHTML =
    '<footer><div class="container"><div class="footer-grid">'+
    '<div class="footer-brand"><span class="footer-logo">'+c.name+'</span>'+
    '<p>'+c.address.line1+', '+c.address.city+' \u2014 '+c.address.pin+', '+c.address.state+'. Serving MP since '+c.established+'.</p>'+
    '<div class="footer-social"><a href="'+c.instagram+'" target="_blank">\uD83D\uDCF8</a><a href="#">\u2716</a><a href="#">\uD83D\uDCBC</a><a href="#">\uD83D\uDCD8</a></div></div>'+
    '<div class="footer-col"><h4>Help</h4>'+f.helpLinks.map(function(l){return '<a href="'+l.href+'">'+l.label+'</a>';}).join('')+'</div>'+
    '<div class="footer-col"><h4>Company</h4>'+f.companyLinks.map(function(l){return '<a href="'+l.href+'">'+l.label+'</a>';}).join('')+'</div>'+
    '<div class="footer-col"><h4>Contact</h4>'+
    '<div class="contact-row">\uD83D\uDCF1 <span>'+c.phone+'</span></div>'+
    '<div class="contact-row">\uD83D\uDCE7 <span>'+c.email+'</span></div>'+
    '<div class="contact-row">\uD83D\uDCCD <span>'+c.address.line1+', '+c.address.city+' '+c.address.pin+'</span></div>'+
    '<div class="contact-row">\uD83D\uDD50 <span>'+c.hours.weekdays+'</span></div></div>'+
    '</div><div class="footer-bottom">'+
    '<span>\u00A9 '+new Date().getFullYear()+' '+c.fullName+', '+c.address.city+'. All rights reserved.</span>'+
    '<div class="footer-payments"><span class="pay-badge">VISA</span><span class="pay-badge">Mastercard</span><span class="pay-badge">UPI</span><span class="pay-badge">RuPay</span></div>'+
    '</div></div></footer>';
}
