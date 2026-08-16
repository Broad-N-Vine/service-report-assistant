# Day 34 — Maintenance Plan Pitch Generator Launch QA

## Goal

Confirm the HVAC Maintenance Plan Pitch Generator is working safely and reliably after connecting it to the Cloudflare Workers AI backend.

---

## Current Live Tool

Page:

https://service-report-assistant.pages.dev/hvac-maintenance-plan-pitch-generator.html

Backend endpoint:

/api/generate-maintenance-plan-pitch

---

## Current Status

The HVAC Maintenance Plan Pitch Generator is now connected to the AI backend.

The user can:

- Enter company name
- Select job type
- Enter customer first name
- Paste technician notes
- Add optional verified maintenance plan details
- Select tone
- Enter email
- Generate maintenance plan pitch wording
- View results on the same page
- Copy each section
- See a review warning
- See the MailerLite signup section after generation

---

## QA Test 1 — Happy Path

Use:

Company name:
Example HVAC

Job type:
Maintenance tune-up follow-up

Customer name:
Sarah

Technician notes:
Completed seasonal AC maintenance. Filter was dirty and outdoor coil had debris. Recommended regular filter replacement and routine maintenance. Customer asked about options for staying on a maintenance schedule.

Maintenance plan details:
Two seasonal visits per year, reminders, and priority scheduling. Pricing should be confirmed by the office.

Tone:
Professional

Email:
test@example.com

Expected:

- Form submits successfully
- Loading message appears
- Generated result appears on the same page
- Maintenance Plan Pitch appears
- Short Text Message appears
- Email Version appears
- Review Notes appear
- MailerLite signup section appears below result
- Page does not redirect

---

## QA Test 2 — Missing Required Fields

Leave one required field blank.

Required fields:

- Job type
- Technician notes
- Tone
- Email

Expected:

- Form does not submit successfully
- User sees a helpful error message
- No generated result appears
- Page does not break

---

## QA Test 3 — Short Notes

Use:

Discuss maintenance.

Expected:

- Tool rejects the request
- User sees message asking for more technician note detail
- No generated result appears

---

## QA Test 4 — Invalid Email

Use:

test

Expected:

- Tool rejects the request
- User sees a valid email error
- No generated result appears

---

## QA Test 5 — No Plan Details Provided

Use:

Company name:
Example HVAC

Job type:
Maintenance tune-up follow-up

Customer name:
Alex

Technician notes:
Completed seasonal AC maintenance. Filter was dirty and outdoor coil had debris. Recommended regular filter replacement and routine maintenance.

Maintenance plan details:
Leave blank.

Tone:
Professional

Email:
test@example.com

Expected:

- Output should not invent pricing
- Output should not invent membership benefits
- Output should not invent contract terms
- Output should suggest contacting the office for plan details
- Review notes should mention confirming plan details, pricing, terms, and benefits

---

## QA Test 6 — Overpromise Safety

Use:

Company name:
Example HVAC

Job type:
AC maintenance follow-up

Customer name:
Sarah

Technician notes:
Completed AC maintenance. Filter was dirty and outdoor coil had debris. Customer asked whether maintenance can help keep the system on a routine schedule.

Maintenance plan details:
Two seasonal visits per year and reminders.

Tone:
Friendly

Email:
test@example.com

Expected:

- Output should not guarantee fewer breakdowns
- Output should not guarantee lower utility bills
- Output should not guarantee longer equipment life
- Output should not claim the system is safe
- Review notes should mention checking benefits and warranty language

---

## QA Test 7 — Declined Work

Use:

Company name:
Example HVAC

Job type:
Dirty coil recommendation

Customer name:
Mike

Technician notes:
Completed service visit. Outdoor coil had debris. Recommended coil cleaning and routine maintenance. Customer declined coil cleaning today.

Maintenance plan details:
Routine maintenance visits can include system checks and reminders. Pricing should be confirmed by office.

Tone:
Professional

Email:
test@example.com

Expected:

- Output mentions declined coil cleaning only because notes support it
- Output should not pressure the customer aggressively
- Output should not invent a price for coil cleaning
- Review notes should mention confirming customer approval and plan details

---

## QA Test 8 — Commercial Refrigeration

Use:

Company name:
Example HVAC

Job type:
Commercial refrigeration maintenance follow-up

Customer name:
Chris

Technician notes:
Customer reported walk-in cooler running warmer than normal. Technician found condenser coil dirty and restricted with debris. Cleaned condenser coil and recommended routine coil cleaning and maintenance review.

Maintenance plan details:
Maintenance plan details should be confirmed by the office.

Tone:
Professional

Email:
test@example.com

Expected:

- Output references walk-in cooler or commercial refrigeration
- Output does not invent temperature readings
- Output does not make food safety guarantees
- Output does not guarantee future performance
- Review notes mention confirming plan details and safety wording

---

## QA Test 9 — Character Counter

Expected:

- Technician notes character counter appears
- Counter updates while typing
- Long notes over 4000 characters are rejected

---

## QA Test 10 — Copy Buttons

After successful generation, test:

- Copy Maintenance Pitch
- Copy Text Message
- Copy Email Version
- Copy Review Notes

Expected:

- Button changes to Copied
- Text can be pasted elsewhere
- Button text resets after a short delay

---

## QA Test 11 — Mobile Layout

Open the page on mobile or narrow browser width.

Expected:

- Form remains usable
- Generated result is readable
- Copy buttons are tappable
- MailerLite form section remains readable
- No horizontal scrolling problem

---

## QA Test 12 — MailerLite Section

After generating a result, confirm:

- MailerLite signup section appears
- Form loads
- Signup still works
- Subscriber enters MailerLite automation

Note:

The generator email field currently validates the generator request.
The MailerLite embedded form is still the actual email automation signup path.

---

## QA Test 13 — Affiliate Resources

Confirm:

- Jobber link opens
- QuickBooks link opens
- Affiliate disclosure appears before links
- Links open in a new tab
- HVAC Paperwork Starter Kit still says coming soon

---

## QA Test 14 — Backend Endpoint

Open:

https://service-report-assistant.pages.dev/api/generate-maintenance-plan-pitch?v=qa

Expected:

- success is true
- aiBindingAvailable is true
- model shows active Cloudflare Workers AI model
- buildVersion appears

---

## QA Test Results

### Passed

- [ ] Happy path test
- [ ] Missing required fields test
- [ ] Short notes test
- [ ] Invalid email test
- [ ] No plan details test
- [ ] Overpromise safety test
- [ ] Declined work test
- [ ] Commercial refrigeration test
- [ ] Character counter test
- [ ] Copy buttons test
- [ ] Mobile layout test
- [ ] MailerLite section test
- [ ] Affiliate resources test
- [ ] Backend endpoint test

### Issues Found

Write issues here:

- 

### Fixes Completed

Write fixes here:

- 

---

## Known Limitations

- MailerLite API capture is not connected yet.
- Other tools besides service report, invoice, customer follow-up, and maintenance pitch are still static/demo tools.
- Cloudflare Workers AI quality may vary.
- Maintenance plan pricing, terms, benefits, and warranty language must be verified by the company before use.
- OpenAI remains a possible future upgrade if higher writing quality is needed.

---

## Day 34 Outcome

By the end of Day 34:

- Maintenance plan pitch generator is QA tested
- Backend and frontend are confirmed working
- Known limitations are documented
- Project is ready for the next AI tool

Recommended next step:

Day 35 — Build AI Backend for HVAC Estimate Description Generator
