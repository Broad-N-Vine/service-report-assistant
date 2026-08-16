# Day 42 — Sitewide Link and Sitemap Check

## Goal

Confirm the live HVAC AI Helper site has clean navigation, working internal links, and a sitemap that reflects the current public pages.

This check comes after updating the homepage and tools page to feature the six live AI tools.

---

## Current Live AI Tools

1. HVAC Service Report Generator
2. HVAC Invoice Description Generator
3. HVAC Customer Follow-Up Text Generator
4. HVAC Maintenance Plan Pitch Generator
5. HVAC Estimate Description Generator
6. Commercial Refrigeration Service Report Generator

---

## Files to Check

Primary files:

- public/index.html
- public/tools.html
- public/blog.html
- public/sitemap.xml
- public/robots.txt

Important:

- Do not add API endpoints to sitemap.xml
- Do not add thank-you.html to sitemap.xml
- Keep thank-you.html noindex
- Keep /api/ routes out of public navigation and sitemap

---

## Public Pages That Should Be Easy to Find

### Main Pages

- index.html
- tools.html
- blog.html
- contact.html
- privacy.html
- affiliate-disclosure.html

### Live AI Tool Pages

- hvac-service-report-generator.html
- hvac-invoice-description-generator.html
- hvac-customer-follow-up-text-generator.html
- hvac-maintenance-plan-pitch-generator.html
- hvac-estimate-description-generator.html
- commercial-refrigeration-service-report-generator.html

### Important Guide and Template Pages

- hvac-technician-notes-examples.html
- what-should-an-hvac-service-report-include.html
- hvac-invoice-wording-examples.html
- ac-capacitor-replacement-invoice-description-examples.html
- hvac-service-report-checklist.html
- hvac-tune-up-report-template.html
- ac-repair-service-report-template.html
- furnace-repair-service-report-template.html
- walk-in-cooler-service-report-example.html

---

## Homepage Link Check

Open:

https://service-report-assistant.pages.dev/

Confirm:

- [ ] Header Home link works
- [ ] Header Tools link works
- [ ] Header Guides link works
- [ ] Header Contact link works
- [ ] Main service report generator button works
- [ ] View all tools button works
- [ ] All six live AI tool cards are visible
- [ ] All six live AI tool buttons work
- [ ] Technician notes guide link works
- [ ] Footer Privacy Policy link works
- [ ] Footer Affiliate Disclosure link works
- [ ] Footer Contact link works
- [ ] No live AI tool is labeled coming soon
- [ ] No visible button points to an API endpoint
- [ ] No broken layout on desktop
- [ ] No broken layout on mobile

---

## Tools Page Link Check

Open:

https://service-report-assistant.pages.dev/tools.html

Confirm:

- [ ] Header Home link works
- [ ] Header Tools link works
- [ ] Header Guides link works
- [ ] Header Contact link works
- [ ] Recommended starting point button opens HVAC Service Report Generator
- [ ] HVAC Service Report Generator button works
- [ ] HVAC Invoice Description Generator button works
- [ ] HVAC Customer Follow-Up Text Generator button works
- [ ] HVAC Maintenance Plan Pitch Generator button works
- [ ] HVAC Estimate Description Generator button works
- [ ] Commercial Refrigeration Service Report Generator button works
- [ ] HVAC Tune-Up Report Template button works
- [ ] AC Repair Service Report Template button works
- [ ] Furnace Repair Service Report Template button works
- [ ] HVAC Technician Notes Examples button works
- [ ] Walk-In Cooler Service Report Example button works
- [ ] HVAC Service Report Checklist button works
- [ ] Footer Privacy Policy link works
- [ ] Footer Affiliate Disclosure link works
- [ ] Footer Contact link works
- [ ] No live AI tool is labeled coming soon
- [ ] Live AI tools are separate from templates and guides
- [ ] No visible button points to an API endpoint
- [ ] No broken layout on desktop
- [ ] No broken layout on mobile

---

## Guides Page Link Check

Open:

https://service-report-assistant.pages.dev/blog.html

Confirm:

- [ ] Header navigation works
- [ ] Featured guide opens correctly
- [ ] Main guide cards open correctly
- [ ] Template cards open correctly
- [ ] Related tools links work
- [ ] Footer links work
- [ ] No outdated coming soon language appears for the six live AI tools
- [ ] No broken layout on desktop
- [ ] No broken layout on mobile

---

## Sitemap Check

Open:

https://service-report-assistant.pages.dev/sitemap.xml

Confirm:

- [ ] sitemap.xml loads
- [ ] Homepage is included
- [ ] tools.html is included
- [ ] blog.html is included
- [ ] contact.html is included
- [ ] privacy.html is included
- [ ] affiliate-disclosure.html is included
- [ ] All six live AI tool pages are included
- [ ] Important guide and template pages are included
- [ ] thank-you.html is not included
- [ ] No /api/ endpoints are included
- [ ] No duplicate accidental API-style URLs are included
- [ ] URLs use the live domain
- [ ] XML is valid enough to load in the browser without error

---

## Robots Check

Open:

https://service-report-assistant.pages.dev/robots.txt

Confirm:

- [ ] robots.txt loads
- [ ] sitemap location is listed
- [ ] robots.txt does not block important public pages
- [ ] robots.txt does not accidentally expose API endpoints as sitemap entries

---

## Generator Page Spot Checks

Open each live AI tool page:

1. https://service-report-assistant.pages.dev/hvac-service-report-generator.html
2. https://service-report-assistant.pages.dev/hvac-invoice-description-generator.html
3. https://service-report-assistant.pages.dev/hvac-customer-follow-up-text-generator.html
4. https://service-report-assistant.pages.dev/hvac-maintenance-plan-pitch-generator.html
5. https://service-report-assistant.pages.dev/hvac-estimate-description-generator.html
6. https://service-report-assistant.pages.dev/commercial-refrigeration-service-report-generator.html

Confirm for each page:

- [ ] Page loads
- [ ] Header navigation works
- [ ] Form is visible
- [ ] Required fields are clear
- [ ] Review warning is present
- [ ] MailerLite signup section appears after generation
- [ ] Recommended resources section appears where applicable
- [ ] Footer links work
- [ ] Related links do not point to missing pages
- [ ] Page does not show outdated demo-only language
- [ ] Page does not show old coming soon language
- [ ] Page does not expose backend implementation details to normal visitors

---

## Redirect Check

Confirm this old accidental URL redirects correctly:

https://service-report-assistant.pages.dev/api/hvac-service-report-generator.html

Expected:

- [ ] Redirects to /hvac-service-report-generator.html
- [ ] Does not show an API page
- [ ] Does not create a duplicate public tool URL

---

## Issues Found

Write issues here:

- 

---

## Fixes Completed

Write fixes here:

- 

---

## Day 42 Outcome

By the end of Day 42:

- Homepage links are checked
- Tools page links are checked
- Guides page links are checked
- Six live AI tool pages are spot checked
- Sitemap is checked
- Robots file is checked
- API endpoints are confirmed absent from sitemap
- thank-you.html is confirmed absent from sitemap
- Any broken or outdated links are documented

Recommended next step:

Day 43 — Update sitemap.xml if needed, then create a fresh site index/status checkpoint
