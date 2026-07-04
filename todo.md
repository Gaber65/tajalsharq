# Taj Al Sharq United — Multilingual Refactor Plan

## Phase 1: Project Structure & Foundation [x]
- [x] Create directory structure (assets/data, assets/lang/en, assets/lang/ar, assets/js modules)
- [x] Download Bootstrap RTL CSS locally
- [x] Create language.js (i18n engine with localStorage, RTL/LTR switching)
- [x] Create api.js (JSON data loader)
- [x] Create loader.js (page loader)
- [x] Create utils.js (reusable helpers, counters, AOS init)
- [x] Create app.js (main orchestrator, navbar, back-to-top, footer year)
- [x] Create faq.js, equipment.js, gallery.js, contact.js
- [x] Add language switcher CSS to style.css

## Phase 2: Common Translations & Reusable Components [x]
- [x] Create en/common.json and ar/common.json
- [x] Reusable components kept inline with consistent markup across pages (no build tool for partials)

## Phase 3: Home Page (index.html) [x]
- [x] Create en/home.json and ar/home.json
- [x] Create assets/data/home.json
- [x] Create home-init.js
- [x] Refactor index.html (data-i18n, SEO meta, Schema.org, scripts)

## Phase 4: About Page (about.html) [x]
- [x] Create en/about.json and ar/about.json
- [x] Create data/about.json
- [x] Create about-init.js
- [x] Refactor about.html (data-i18n, SEO, Schema.org, scripts)

## Phase 5: Services Page (services.html) [x]
- [x] Create en/services.json + ar/services.json
- [x] Create data/services.json + services-init.js
- [x] Refactor services.html

## Phase 6: Equipment Page (equipment.html) [x]
- [x] Create en/equipment.json + ar/equipment.json
- [x] Create data/equipment.json + equipment-init.js
- [x] Refactor equipment.html

## Phase 7: Gallery Page (gallery.html) [x]
- [x] Create en/gallery.json + ar/gallery.json
- [x] Create data/gallery.json
- [x] Create gallery-init.js
- [x] Refactor gallery.html

## Phase 8: Contact Page (contact.html) [x]
- [x] Create en/contact.json + ar/contact.json
- [x] Create data/contact.json
- [x] Create contact-init.js
- [x] Refactor contact.html

## Phase 9: SEO & Performance [x]
- [x] Create robots.txt + sitemap.xml
- [x] Add Schema.org to all pages
- [x] Performance optimizations (lazy loading, deferred JS, font preloading in HTML)

## Phase 10: Final Testing & Push
- [x] Verify PAGE_NAME_MAP fix works (index → home mapping)
- [x] Test all pages EN/AR rendering — all 6 pages verified working
- [x] Fix deep merge bug in language.js (gallery.filters keys lost with shallow merge)
- [ ] Push to GitHub
