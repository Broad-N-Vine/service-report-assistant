# Day 41 — Sitewide AI Tool Status and Navigation Cleanup

## Goal

Update the sitewide positioning now that HVAC AI Helper has multiple live AI tools.

The site is no longer only a static paperwork resource or demo site. It now has a working AI tool set.

---

## Current Live AI Tools

1. HVAC Service Report Generator
2. HVAC Invoice Description Generator
3. HVAC Customer Follow-Up Text Generator
4. HVAC Maintenance Plan Pitch Generator
5. HVAC Estimate Description Generator
6. Commercial Refrigeration Service Report Generator

---

## Primary Goal

Make the homepage and tools page clearly show that the site has live working AI tools.

The site should send users quickly toward the working tools and remove outdated preview/demo language where it no longer applies.

---

## Files to Update

Primary files:

- public/index.html
- public/tools.html

Possible later files:

- public/blog.html
- public/sitemap.xml

---

## Homepage Cleanup Goals

The homepage should:

- Feature the six live AI tools
- Make the HVAC Service Report Generator the primary starting point
- Mention invoice wording, follow-up messages, maintenance pitches, estimates, and commercial refrigeration
- Clarify that AI outputs should be reviewed before use
- Send users to the Tools page and the main generator
- Keep the site focused on HVAC/R paperwork cleanup

---

## Tools Page Cleanup Goals

The tools page should:

- Clearly label which tools are live AI tools
- Put the six live AI tools at the top
- Remove old “coming soon” or “preview” language from tools that are now live
- Keep static/template pages separate from live AI tools
- Add short descriptions for each tool
- Add simple “Open Tool” buttons
- Keep the user journey clean and fast

---

## Live Tool Order

Recommended order:

1. HVAC Service Report Generator
2. HVAC Invoice Description Generator
3. HVAC Customer Follow-Up Text Generator
4. HVAC Maintenance Plan Pitch Generator
5. HVAC Estimate Description Generator
6. Commercial Refrigeration Service Report Generator

Reason:

This order follows the most common HVAC/R paperwork workflow:

Service notes
→ service report
→ invoice wording
→ customer follow-up
→ maintenance pitch
→ estimate wording
→ refrigeration-specific paperwork

---

## Suggested Homepage Positioning

Main headline direction:

Free HVAC/R AI tools for cleaner service paperwork.

Supporting message:

Turn rough technician notes into service reports, invoice descriptions, customer follow-ups, estimate wording, maintenance pitches, and commercial refrigeration paperwork.

Trust message:

AI-generated text should be reviewed before sending to customers, adding to invoices, or storing in service records.

---

## Suggested Tools Page Sections

### Section 1 — Live AI Tools

Show the six live tools with short descriptions and buttons.

### Section 2 — Templates and Examples

Show static template pages and SEO examples.

Examples:

- HVAC Tune-Up Report Template
- AC Repair Service Report Template
- Furnace Repair Service Report Template
- HVAC Technician Notes Examples
- Walk-In Cooler Service Report Example
- HVAC Service Report Checklist

### Section 3 — Recommended Workflow

A simple workflow:

1. Start with technician notes
2. Generate a service report
3. Generate invoice wording
4. Generate follow-up wording
5. Review before sending

---

## Safety and Trust Language

Keep this message visible on homepage and tools page:

AI outputs are drafts. Review service details, pricing, parts, readings, warranty language, safety wording, food safety wording, and customer-specific details before use.

---

## Day 41 QA Checklist

After updating the homepage and tools page, confirm:

- [ ] Homepage loads correctly
- [ ] Tools page loads correctly
- [ ] Header navigation works
- [ ] Six live AI tools are clearly visible
- [ ] Each live tool button opens the correct page
- [ ] No outdated “coming soon” language appears for live tools
- [ ] Static templates are still listed separately
- [ ] Affiliate/resource disclosure remains where needed
- [ ] Mobile layout remains readable
- [ ] Sitemap does not include API endpoints
- [ ] Sitemap includes public live tool pages

---

## Known Limitations

- MailerLite API capture is not connected yet.
- Email signup still uses the embedded MailerLite form.
- Cloudflare Workers AI quality may vary.
- AI outputs must be reviewed before customer use.
- Additional static template pages are not all AI-powered.

---

## Day 41 Outcome

By the end of Day 41:

- Homepage reflects the current live AI tool set
- Tools page reflects the current live AI tool set
- Six live AI tools are easier to find
- Outdated preview/demo language is removed
- The site feels more like a real working HVAC/R AI tool hub

Recommended next step:

Day 42 — Sitewide Link and Sitemap Check
