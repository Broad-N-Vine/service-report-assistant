# Day 28 — Invoice Generator Launch QA

## Goal

Confirm the HVAC Invoice Description Generator is working safely and reliably after connecting it to the Cloudflare Workers AI backend.

---

## Current Live Tool

Page:

https://service-report-assistant.pages.dev/hvac-invoice-description-generator.html

Backend endpoint:

/api/generate-invoice-description

---

## Current Status

The HVAC Invoice Description Generator is now connected to the AI backend.

The user can:

- Enter company name
- Select job type
- Paste technician notes
- Select tone
- Enter email
- Generate invoice wording
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
AC capacitor replacement

Technician notes:
Customer reported AC was running but not cooling. Technician found failed capacitor and replaced it with an approved replacement part. System started after repair and cooling operation was checked before leaving.

Tone:
Professional

Email:
test@example.com

Expected:

- Form submits successfully
- Loading message appears
- Generated result appears on the same page
- Invoice Description appears
- Short Invoice Line appears
- More Detailed Invoice Description appears
- Office Review Notes appear
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

Fixed unit.

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

## QA Test 5 — Pricing Safety

Use:

Company name:
Example HVAC

Job type:
AC repair

Technician notes:
Customer reported AC not cooling. Technician replaced failed capacitor and checked system operation.

Tone:
Professional

Email:
test@example.com

Expected:

- Output should not invent price
- Output should not invent labor rate
- Output should not invent tax
- Output should not invent discount
- Review notes should remind user to confirm pricing and invoice details

---

## QA Test 6 — Warranty Safety

Use:

Company name:
Example HVAC

Job type:
Furnace repair

Technician notes:
Customer reported furnace not heating. Technician cleaned dirty flame sensor and confirmed furnace cycled after service.

Tone:
Professional

Email:
test@example.com

Expected:

- Output should not invent warranty terms
- Output should not make unsupported safety claims
- Output should not say the system is guaranteed to keep working
- Review notes should mention reviewing warranty and safety wording

---

## QA Test 7 — Commercial Refrigeration

Use:

Company name:
Example HVAC

Job type:
Commercial refrigeration

Technician notes:
Customer reported walk-in cooler running warmer than normal. Technician found condenser coil dirty and restricted with debris. Cleaned condenser coil and advised customer to monitor box temperature after service.

Tone:
Professional

Email:
test@example.com

Expected:

- Output references walk-in cooler or commercial refrigeration
- Output does not invent temperature readings
- Output does not make food safety guarantees
- Review notes mention confirming readings and final invoice details

---

## QA Test 8 — Character Counter

Expected:

- Technician notes character counter appears
- Counter updates while typing
- Long notes over 4000 characters are rejected

---

## QA Test 9 — Copy Buttons

After successful generation, test:

- Copy Invoice Description
- Copy Short Invoice Line
- Copy Detailed Description
- Copy Review Notes

Expected:

- Button changes to Copied
- Text can be pasted elsewhere
- Button text resets after a short delay

---

## QA Test 10 — Mobile Layout

Open the page on mobile or narrow browser width.

Expected:

- Form remains usable
- Generated result is readable
- Copy buttons are tappable
- MailerLite form section remains readable
- No horizontal scrolling problem

---

## QA Test 11 — MailerLite Section

After generating a result, confirm:

- MailerLite signup section appears
- Form loads
- Signup still works
- Subscriber enters MailerLite automation

Note:

The generator email field currently validates the generator request.
The MailerLite embedded form is still the actual email automation signup path.

---

## QA Test 12 — Affiliate Resources

Confirm:

- Jobber link opens
- QuickBooks link opens
- Affiliate disclosure appears before links
- Links open in a new tab
- HVAC Paperwork Starter Kit still says coming soon

---

## QA Test 13 — Backend Endpoint

Open:

https://service-report-assistant.pages.dev/api/generate-invoice-description?v=qa

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
- [ ] Pricing safety test
- [ ] Warranty safety test
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
- Other tools besides the service report and invoice generators are still static/demo tools.
- Cloudflare Workers AI quality may vary.
- OpenAI remains a possible future upgrade if higher writing quality is needed.

---

## Day 28 Outcome

By the end of Day 28:

- Invoice generator is QA tested
- Backend and frontend are confirmed working
- Known limitations are documented
- Project is ready for the next AI tool

Recommended next step:

Day 29 — Build AI Backend for HVAC Customer Follow-Up Text Generator
