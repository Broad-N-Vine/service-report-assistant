# Day 45 — Simple Site Performance and Conversion Dashboard

## Goal

Create a simple manual dashboard for tracking HVAC AI Helper performance, conversion paths, live tool status, affiliate paths, SEO pages, known issues, and weekly next actions.

This dashboard is intentionally simple. It is meant to help make better decisions before adding more tools, paid products, or automation.

---

## Dashboard Date

Created:

2026-08-16

Site:

https://service-report-assistant.pages.dev/

Brand:

HVAC AI Helper

Primary positioning:

Free HVAC/R AI tools for cleaner service paperwork.

---

## Current Live AI Tool Count

Total live AI tools:

6

---

## Live AI Tool Status

| # | Tool | Page | Backend | Status | Notes |
|---|------|------|---------|--------|-------|
| 1 | HVAC Service Report Generator | /hvac-service-report-generator.html | /api/generate-service-report | Live | Core tool |
| 2 | HVAC Invoice Description Generator | /hvac-invoice-description-generator.html | /api/generate-invoice-description | Live | Invoice wording |
| 3 | HVAC Customer Follow-Up Text Generator | /hvac-customer-follow-up-text-generator.html | /api/generate-customer-follow-up | Live | Text and email follow-ups |
| 4 | HVAC Maintenance Plan Pitch Generator | /hvac-maintenance-plan-pitch-generator.html | /api/generate-maintenance-plan-pitch | Live | Low-pressure maintenance wording |
| 5 | HVAC Estimate Description Generator | /hvac-estimate-description-generator.html | /api/generate-estimate-description | Live | Estimate wording |
| 6 | Commercial Refrigeration Service Report Generator | /commercial-refrigeration-service-report-generator.html | /api/generate-commercial-refrigeration-report | Live | Refrigeration-specific report generator |

---

## Current Conversion Flow

Primary visitor path:

1. Visitor lands on homepage, tools page, or guide page
2. Visitor clicks a live AI tool
3. Visitor enters technician notes and email
4. Tool generates a result on-page
5. MailerLite signup form appears below the generated result
6. Visitor can join the email list
7. Visitor sees recommended resources
8. Visitor may click Jobber, QuickBooks, or future starter kit offer

---

## Email Capture Status

MailerLite embedded form:

Live

Form ID:

tYlgPM

Automation:

HVAC AI Helper Welcome Sequence

Current status:

Active and tested

Important limitation:

The email field inside each generator validates the request but does not automatically subscribe the user to MailerLite.

Current signup path:

User must submit the embedded MailerLite form after generating a result.

Future improvement:

Connect generator email field to MailerLite API.

---

## Monetization Status

| Offer | Status | Link | Notes |
|------|--------|------|-------|
| Jobber | Live | https://go.getjobber.com/hvufmvufglw6 | Field service software affiliate path |
| QuickBooks | Live | https://quickbooks.intuit.com/partners/affiliates?cid=par_pim_Q_AO4O_wXnkk | Accounting and invoicing affiliate path |
| HVAC Paperwork Starter Kit | Coming soon | n/a | Future paid product or lead magnet |

---

## Important Public Pages

### Main Pages

| Page | Status | Notes |
|------|--------|-------|
| / | Live | Homepage updated for six live AI tools |
| /tools.html | Live | Tools page updated for six live AI tools |
| /blog.html | Live | Guides/templates hub |
| /contact.html | Live | Contact page |
| /privacy.html | Live | Privacy policy |
| /affiliate-disclosure.html | Live | Affiliate disclosure |

### Live AI Tool Pages

| Page | Status |
|------|--------|
| /hvac-service-report-generator.html | Live |
| /hvac-invoice-description-generator.html | Live |
| /hvac-customer-follow-up-text-generator.html | Live |
| /hvac-maintenance-plan-pitch-generator.html | Live |
| /hvac-estimate-description-generator.html | Live |
| /commercial-refrigeration-service-report-generator.html | Live |

### Important SEO Guide and Template Pages

| Page | Status |
|------|--------|
| /hvac-technician-notes-examples.html | Live |
| /what-should-an-hvac-service-report-include.html | Live |
| /hvac-invoice-wording-examples.html | Live |
| /ac-capacitor-replacement-invoice-description-examples.html | Live |
| /hvac-service-report-checklist.html | Live |
| /hvac-tune-up-report-template.html | Live |
| /ac-repair-service-report-template.html | Live |
| /furnace-repair-service-report-template.html | Live |
| /walk-in-cooler-service-report-example.html | Live |

---

## Sitemap and Robots Status

sitemap.xml:

Live and updated

robots.txt:

Live and updated

Rules:

- Public pages allowed
- /api/ disallowed
- /thank-you.html disallowed
- Sitemap location listed

Important exclusions:

- API endpoints are not in sitemap
- thank-you.html is not in sitemap

---

## Weekly Manual Metrics

Update this section once per week.

### Week Of: __________

| Metric | Number | Notes |
|--------|--------|-------|
| Total site visits |  |  |
| Homepage visits |  |  |
| Tools page visits |  |  |
| Blog/guides page visits |  |  |
| HVAC Service Report Generator visits |  |  |
| HVAC Invoice Description Generator visits |  |  |
| HVAC Customer Follow-Up Generator visits |  |  |
| HVAC Maintenance Plan Pitch Generator visits |  |  |
| HVAC Estimate Description Generator visits |  |  |
| Commercial Refrigeration Generator visits |  |  |
| Total AI generations |  | Manual estimate or Cloudflare data |
| MailerLite form submissions |  |  |
| New email subscribers |  |  |
| Jobber clicks |  |  |
| QuickBooks clicks |  |  |
| Starter Kit interest/clicks |  | Coming soon |
| Known errors or failed generations |  |  |
| Pages updated this week |  |  |
| New pages published this week |  |  |

---

## Manual Conversion Review

Use this once per week.

### 1. Which pages got traffic?

Notes:

- 

### 2. Which tools were used?

Notes:

- 

### 3. Which pages produced email signups?

Notes:

- 

### 4. Which pages produced affiliate clicks?

Notes:

- 

### 5. Which pages had errors or weak output?

Notes:

- 

### 6. Which page should be improved next?

Notes:

- 

---

## Known Issues Log

| Date | Issue | Page or File | Severity | Status | Fix |
|------|-------|--------------|----------|--------|-----|
| 2026-08-16 | Commercial refrigeration QA generated [date] placeholder | generate-commercial-refrigeration-report.js | Low | Fixed | Added prompt instruction and backend placeholder cleanup |

---

## Next Action Queue

| Priority | Action | Reason | Status |
|----------|--------|--------|--------|
| High | Improve guide-to-tool internal links | More traffic should flow from SEO guide pages to live tools | Next |
| High | Create Starter Kit coming soon page | Builds future product demand | Planned |
| Medium | Plan MailerLite API capture | Reduces friction after generator use | Planned |
| Medium | Create weekly metrics routine | Helps identify what is working | Planned |
| Medium | Add more internal links from blog.html | Improves tool discovery | Planned |
| Low | Consider custom domain sender email | Improves email trust later | Future |
| Low | Consider OpenAI quality upgrade | Possible future output quality improvement | Future |

---

## Weekly Review Template

Copy this section each week.

### Weekly Review Date: __________

Traffic summary:

- 

Tool usage summary:

- 

Email subscriber summary:

- 

Affiliate click summary:

- 

Top page this week:

- 

Weakest page this week:

- 

Biggest issue found:

- 

Fix completed:

- 

Next action:

- 

---

## Decision Rules

Use these rules before building new features.

### Build more SEO pages when:

- Existing guide pages are getting impressions or traffic
- Tool pages are working reliably
- Internal links are clear
- There are no major broken links

### Improve conversion when:

- Tool pages get visits but few email signups
- Users generate results but do not subscribe
- Affiliate links get no clicks
- The MailerLite form is too far down the page

### Build a paid starter kit when:

- Email list is growing
- Users are using multiple tools
- Guide pages are getting search traffic
- Common template needs are clear

### Add more AI tools when:

- The six current tools are stable
- Site navigation remains clean
- There is a clear keyword or workflow reason
- The new tool does not duplicate an existing one

---

## Current Recommendation

The next best build is:

Day 46 — Guide-to-Tool Internal Link Upgrade

Reason:

The site now has six live AI tools. Existing guide and template pages should send more visitors into those tools.

The priority is not more backend work yet. The priority is improving the path from SEO content to tool usage.
