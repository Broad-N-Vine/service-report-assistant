# Day 49 — Template and Static Page Cleanup

## Goal
Review remaining template and static pages for outdated wording, missing internal links, missing live AI tool paths, old branding, and trust/compliance cleanup.

Day 48 upgraded service report example, checklist, office admin, tune-up, AC repair, and furnace repair pages.
Day 49 focuses on broader static pages and remaining template-style pages that support the full site experience.

## Why This Matters
Visitors may not always land on tool pages first.
They may enter through the homepage, tools page, contact page, privacy page, affiliate disclosure page, or older static/template pages.

Each page should clearly support this flow:

Search visitor or direct visitor → helpful page → relevant live AI tool → email signup → recommended resource or future starter kit.

## Current Live AI Tools
1. HVAC Service Report Generator — /hvac-service-report-generator.html
2. HVAC Invoice Description Generator — /hvac-invoice-description-generator.html
3. HVAC Customer Follow-Up Text Generator — /hvac-customer-follow-up-text-generator.html
4. HVAC Maintenance Plan Pitch Generator — /hvac-maintenance-plan-pitch-generator.html
5. HVAC Estimate Description Generator — /hvac-estimate-description-generator.html
6. Commercial Refrigeration Service Report Generator — /commercial-refrigeration-service-report-generator.html

## Day 49 Cleanup Targets
Review pages for:

1. Old “Service Report Assistant” branding that should now say “HVAC AI Helper”
2. Live AI tools accidentally described as “coming soon”
3. Missing links to tools.html
4. Missing links from static pages to the most relevant live AI tools
5. Any /api/ links in public page content
6. Any thank-you.html links in public navigation or content
7. Affiliate links missing disclosure before the links
8. Affiliate links missing target="_blank" or rel="sponsored noopener"
9. MailerLite forms accidentally removed or broken
10. Footer links missing or inconsistent
11. Pages that should mention “review before sending”
12. Pages that need simple internal links to service report, invoice, follow-up, estimate, maintenance, or refrigeration tools

## Suggested Day 49 Page Order
1. public/index.html
2. public/tools.html
3. public/contact.html
4. public/privacy.html
5. public/affiliate-disclosure.html
6. public/hvac-invoice-description-generator.html
7. public/hvac-customer-follow-up-text-generator.html
8. public/hvac-maintenance-plan-pitch-generator.html
9. public/hvac-estimate-description-generator.html
10. public/commercial-refrigeration-service-report-generator.html

## Static Page Rules
- Keep wording simple and trustworthy.
- Do not overpromise what the AI tools do.
- Say AI output is a draft and should be reviewed before use.
- Use relative `.html` links.
- Do not link to `/api/`.
- Do not link to `thank-you.html`.
- Keep footer links to privacy, affiliate disclosure, and contact.
- Keep branding consistent as “HVAC AI Helper.”

## Tool Page Rules
- Make sure each live tool page links back to tools.html.
- Make sure each tool page links to at least a few relevant related tools.
- Do not describe any live tool as “coming soon.”
- Keep “review before sending” language visible.
- Preserve working form behavior and API endpoint references inside JavaScript when already correct.
- Do not change backend endpoint names unless fixing a proven issue.

## Affiliate/Resource Rules
- Affiliate disclosure must appear before affiliate links.
- Jobber link:
  https://go.getjobber.com/hvufmvufglw6
- QuickBooks link:
  https://quickbooks.intuit.com/partners/affiliates?cid=par_pim_Q_AO4O_wXnkk
- Affiliate anchors should use:
  target="_blank"
  rel="sponsored noopener"
- HVAC Paperwork Starter Kit can remain Coming Soon.

## Safety Language
Use wording like:

AI-generated wording is a draft. Review service details, parts, pricing, readings, warranty language, safety wording, customer-specific details, and company rules before sending anything to a customer.

For estimate pages also include:

Review recommended work, pricing, options, warranty language, exclusions, and customer approval requirements before sending.

## QA Checklist
- Page loads.
- Header navigation works.
- Footer links work.
- Branding says HVAC AI Helper where appropriate.
- No outdated “Service Report Assistant” page branding unless intentionally part of metadata history.
- No live AI tool is labeled coming soon.
- Relevant page links to tools.html.
- Relevant page links to live AI tools.
- No public page content links to /api/.
- No public page content links to thank-you.html.
- MailerLite form still loads if page had one.
- Affiliate disclosure appears before affiliate links if page has affiliate links.
- Affiliate links use target="_blank" and rel="sponsored noopener".
- Mobile layout remains readable.

## Day 49 Outcome
Static and template pages are cleaner, more consistent, easier to navigate, and better connected to the live AI tools.

## Recommended Next Step
Day 50 — Public Launch Polish and Final Site QA:
Run through homepage, tools page, sitemap, robots, live AI tools, top guide pages, email signup, affiliate disclosures, and mobile readability before shifting into traffic/content growth.
