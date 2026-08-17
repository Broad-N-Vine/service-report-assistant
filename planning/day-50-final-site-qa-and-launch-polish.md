# Day 50 — Final Site QA and Launch Polish

## Goal

Run a final sitewide QA pass before treating HVAC AI Helper as a public MVP.

This day is not for rewriting every page again. The goal is to confirm that the site loads, navigation works, live AI tools submit correctly, email capture appears, affiliate disclosures are present, and no bad links or outdated paths remain.

## Current site

Live site:

https://service-report-assistant.pages.dev/

## Pages to check

### Core pages

- /
- /index.html
- /tools.html
- /blog.html
- /contact.html
- /privacy.html
- /affiliate-disclosure.html

### Live AI tool pages

- /hvac-service-report-generator.html
- /hvac-invoice-description-generator.html
- /hvac-customer-follow-up-text-generator.html
- /hvac-maintenance-plan-pitch-generator.html
- /hvac-estimate-description-generator.html
- /commercial-refrigeration-service-report-generator.html

### High-priority guide/template pages

- /hvac-technician-notes-examples.html
- /what-should-an-hvac-service-report-include.html
- /hvac-service-report-checklist.html
- /hvac-service-report-before-and-after-examples.html
- /hvac-office-admin-paperwork-checklist.html
- /hvac-invoice-wording-examples.html
- /hvac-tune-up-report-template.html
- /ac-repair-service-report-template.html
- /furnace-repair-service-report-template.html
- /walk-in-cooler-service-report-example.html

### Utility files

- /sitemap.xml
- /robots.txt
- /_redirects

## QA checklist

### 1. Page loading

Confirm each public page loads without a 404, blank screen, duplicated HTML, or broken layout.

Pass criteria:

- Page loads.
- Title and main heading match the page topic.
- Header appears.
- Footer appears.
- Mobile layout remains readable.

### 2. Header navigation

Confirm every major page header includes working links to:

- Home
- Tools
- Guides
- Contact

Pass criteria:

- Home opens index.html or the root homepage.
- Tools opens tools.html.
- Guides opens blog.html.
- Contact opens contact.html.

### 3. Footer navigation

Confirm footer links work:

- privacy.html
- affiliate-disclosure.html
- contact.html

Pass criteria:

- Each footer link opens the correct page.
- Footer says AI outputs should be reviewed before sending to customers.

### 4. Live AI tool functionality

Test each live AI tool with safe sample notes.

Tools to test:

- HVAC Service Report Generator
- HVAC Invoice Description Generator
- HVAC Customer Follow-Up Text Generator
- HVAC Maintenance Plan Pitch Generator
- HVAC Estimate Description Generator
- Commercial Refrigeration Service Report Generator

Pass criteria:

- Required-field validation works.
- Character counter works where present.
- Honeypot field remains hidden.
- Submit button changes to loading text.
- Backend request succeeds.
- Result section appears.
- Expected output sections appear.
- Copy buttons work.
- MailerLite signup section appears after generation.
- Error message appears if the backend is unavailable.

### 5. AI output review language

Confirm every live tool page includes visible review-before-use language.

Pass criteria:

- Service reports tell users to review before sending.
- Invoice pages mention parts, pricing, warranty language, and company rules.
- Follow-up pages mention service details, recommendations, pricing, warranty language, and safety-related wording.
- Maintenance pitch pages mention plan details, pricing, terms, benefits, warranty language, and company agreement rules.
- Estimate pages mention scope, pricing, warranty language, exclusions, and customer approval.
- Refrigeration pages mention temperatures, pressures, refrigerant details, food safety wording, and final operating conditions.

### 6. Affiliate compliance

Check all pages with Jobber or QuickBooks links.

Pass criteria:

- Affiliate disclosure appears before affiliate links.
- Jobber link uses target="_blank".
- Jobber link uses rel="sponsored noopener".
- QuickBooks link uses target="_blank".
- QuickBooks link uses rel="sponsored noopener".
- No Housecall Pro links appear.
- HVAC Paperwork Starter Kit may say Coming Soon.
- Live AI tools must not say Coming Soon.

### 7. Email capture

Check MailerLite display on live tool pages after generation.

Pass criteria:

- MailerLite script is present.
- Embedded form appears after successful generation.
- Email language says users can unsubscribe.
- Email language says the email address is not sold.
- Generator email field is not described as automatic MailerLite signup.

### 8. Bad link scan

Confirm there are no visible public content links to:

- /api/
- thank-you.html

Pass criteria:

- API endpoints only appear inside JavaScript fetch calls.
- thank-you.html is not linked from public content pages.
- thank-you.html is not in sitemap.xml.

### 9. Sitemap and robots

Confirm sitemap.xml includes public pages and excludes private/internal paths.

Pass criteria:

- sitemap.xml includes homepage, tools, guides, live AI tools, and public guide/template pages.
- sitemap.xml excludes /api/ paths.
- sitemap.xml excludes thank-you.html.
- robots.txt disallows /api/.
- robots.txt disallows /thank-you.html.
- robots.txt references the sitemap.

### 10. Conversion path

Confirm a visitor can follow the intended path:

Search or direct visit → helpful page → live AI tool → generated result → email signup → recommended resources.

Pass criteria:

- Homepage points to tools and guides.
- Tools page points to all six live AI tools.
- Guides point to relevant tools.
- Tool pages point to related tools.
- Recommended resources appear after useful tool context.
- Review-first language remains visible.

## Safe test notes

Use this sample for general HVAC tools:

Customer reported AC running but not cooling well. Technician found weak capacitor and dirty filter. Replaced capacitor. System cooling with 18-degree temperature split. Recommended filter replacement and coil cleaning. Customer declined coil cleaning today.

Use this sample for maintenance pitch:

Completed seasonal AC maintenance. Filter was dirty and outdoor coil had debris. Recommended regular filter replacement and routine maintenance. Customer asked about options for staying on a maintenance schedule.

Use this sample for estimate tool:

Customer reported AC running but not cooling well. Outdoor coil dirty and filter clogged. Recommended coil cleaning and filter replacement. Customer asked for estimate before approving additional work.

Use this sample for commercial refrigeration:

Customer reported walk-in cooler temperature was higher than normal. Technician found condenser coil dirty and restricted with debris. Cleaned condenser coil and advised customer to monitor box temperature after service. Final temperature readings should be confirmed before sending.

## Day 50 success criteria

Day 50 is complete when:

- All core pages load.
- All live tool pages load.
- All six AI tools submit successfully.
- MailerLite appears after generation.
- Affiliate disclosures are correct.
- No public links point to /api/.
- No public links point to thank-you.html.
- Sitemap and robots are correct.
- Any discovered issues are documented and either fixed or moved to Day 51.

## Expected outcome

HVAC AI Helper is ready to be treated as a public MVP after Day 50 QA, unless testing finds a blocking issue.
