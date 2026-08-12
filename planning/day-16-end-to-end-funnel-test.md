# Day 16 — End-to-End Funnel Test

## Goal

Test the full HVAC AI Helper funnel from visitor entry to email delivery.

The purpose is to confirm that the system works as a complete path:

Search-style page -> helpful content -> free tool or guide -> email signup -> thank-you experience -> MailerLite subscriber -> automation email -> return visit to site.

---

## Current Status

### Website

Status: Live

Core site:
- Home page
- Tools page
- Guides page
- Contact page
- Privacy Policy
- Affiliate Disclosure
- Thank-you page

---

### Email Capture

Status: Working

MailerLite form:
- Embedded on pages
- Signup thank-you message functioning
- Double opt-in redirect is not available on free plan
- Email automation is active
- Test emails were received after a short delay

---

### Email Automation

Status: Live

Automation name:
HVAC AI Helper Welcome Sequence

Trigger:
Completes HVAC AI Helper embedded form

Sequence:
- Email 1: Welcome and Best Starting Point
- Email 2: Service Report Cleanup
- Email 3: Invoice and Follow-Up Wording
- Email 4: Maintenance Follow-Up
- Email 5: Recommended Resources
- Email 6: Future Starter Kit Feedback

---

## Test Pages

Test the funnel from these pages:

1. Home page
https://service-report-assistant.pages.dev/

2. Tools page
https://service-report-assistant.pages.dev/tools.html

3. Guides page
https://service-report-assistant.pages.dev/blog.html

4. Main tool page
https://service-report-assistant.pages.dev/hvac-service-report-generator.html

5. Best starting guide
https://service-report-assistant.pages.dev/hvac-technician-notes-examples.html

6. Before-and-after examples page
https://service-report-assistant.pages.dev/hvac-service-report-before-and-after-examples.html

7. Maintenance agreement follow-up page
https://service-report-assistant.pages.dev/hvac-maintenance-agreement-follow-up-template.html

---

## End-to-End Test Checklist

### 1. Page Load Test

For each test page, confirm:

- Page loads successfully
- Header navigation appears
- Footer appears
- Page looks correct on desktop
- Page looks acceptable on mobile
- No obvious broken layout sections
- No duplicate page sections
- No missing CSS styling

---

### 2. Navigation Test

For each test page, confirm:

- Home link works
- Tools link works
- Guides link works
- Contact link works
- Privacy Policy link works
- Affiliate Disclosure link works

---

### 3. Main CTA Test

For each test page, confirm:

- Main button points to the correct related tool or guide
- Secondary button works if present
- Related links work
- Tool links return the visitor to the correct generator

---

### 4. Email Signup Test

Use a fresh test email if possible.

Confirm:

- MailerLite form loads
- Form can be submitted
- Success message appears
- Subscriber appears in MailerLite
- Subscriber enters automation
- Email 1 is sent
- Email 1 is received
- Email links open correctly

---

### 5. Thank-You Page Test

Open:

https://service-report-assistant.pages.dev/thank-you.html

Confirm:

- Page loads
- Page has noindex meta tag
- Technician Notes Examples button works
- Service Report Generator button works
- View All Tools button works
- Footer links work

Note:
Do not add thank-you.html to sitemap.xml.

---

### 6. Affiliate Link Test

On pages with the Recommended Resources section, confirm:

- Affiliate disclosure appears before links
- Jobber button works
- QuickBooks button works
- Links open in a new tab
- Links use sponsored/noopener attributes in the HTML

Current Jobber link:
https://go.getjobber.com/hvufmvufglw6

Current QuickBooks link:
https://quickbooks.intuit.com/partners/affiliates?cid=par_pim_Q_AO4O_wXnkk

---

### 7. Sitemap Test

Open:

https://service-report-assistant.pages.dev/sitemap.xml

Confirm:

- Sitemap loads
- XML display message is normal
- Public SEO pages are included
- thank-you.html is not included
- planning files are not included
- template files are not included

---

### 8. Email Link Test

From Email 1, click:

- HVAC Technician Notes Examples
- HVAC Service Report Generator

Confirm both links open correctly.

Later, when Emails 2 through 6 arrive, test each email’s links the same way.

---

## Known Limitations

- Current tools are still demo/static frontend tools.
- Live AI backend is not connected yet.
- broadnvine@gmail.com is being used as the sender for now.
- Custom sender domain remains a future deliverability improvement.
- Double opt-in redirect is not available on the current free MailerLite plan.

---

## Pass / Fail Notes

Use this section while testing.

### Passed

- [ ] Home page loads
- [ ] Tools page loads
- [ ] Guides page loads
- [ ] Main generator loads
- [ ] Technician notes guide loads
- [ ] Before-and-after examples page loads
- [ ] Maintenance agreement page loads
- [ ] MailerLite form works
- [ ] Subscriber appears in MailerLite
- [ ] Automation starts
- [ ] Email 1 received
- [ ] Email 1 links work
- [ ] Thank-you page works
- [ ] Affiliate links work
- [ ] Sitemap works

### Issues Found

Write any problems here:

- 

### Fixes Completed

Write any fixes here:

- 

---

## Day 16 Outcome

By the end of Day 16, the project should have a verified working funnel:

Visitor -> helpful page -> email signup -> MailerLite subscriber -> welcome email -> return site visit.

Once this is confirmed, the next major project decision is:

1. Improve conversion and tracking
2. Build the first paid HVAC Paperwork Starter Kit
3. Plan the real AI backend
4. Publish another SEO page batch
