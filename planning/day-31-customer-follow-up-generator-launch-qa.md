# Day 31 — Customer Follow-Up Generator Launch QA

## Goal

Confirm the HVAC Customer Follow-Up Text Generator is working safely and reliably after connecting it to the Cloudflare Workers AI backend.

---

## Current Live Tool

Page:

https://service-report-assistant.pages.dev/hvac-customer-follow-up-text-generator.html

Backend endpoint:

/api/generate-customer-follow-up

---

## Current Status

The HVAC Customer Follow-Up Text Generator is now connected to the AI backend.

The user can:

- Enter company name
- Select job type
- Enter customer first name
- Paste technician notes
- Select preferred message type
- Select tone
- Enter email
- Generate customer follow-up wording
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
AC repair

Customer name:
Sarah

Technician notes:
Customer reported AC was running but not cooling. Technician found failed capacitor and replaced it with an approved replacement part. System started after repair and cooling operation was checked before leaving. Customer was advised to replace the clogged filter.

Preferred message type:
Text message

Tone:
Professional

Email:
test@example.com

Expected:

- Form submits successfully
- Loading message appears
- Generated result appears on the same page
- Customer Follow-Up Message appears
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
- Preferred message type
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

## QA Test 5 — Warranty Safety

Use:

Company name:
Example HVAC

Job type:
Furnace repair

Customer name:
Mike

Technician notes:
Customer reported furnace not heating. Technician cleaned dirty flame sensor and confirmed furnace cycled after service.

Preferred message type:
Email

Tone:
Professional

Email:
test@example.com

Expected:

- Output should not invent warranty terms
- Output should not say the furnace is guaranteed to keep working
- Output should not make unsupported safety claims
- Review notes should mention checking warranty and safety wording

---

## QA Test 6 — Pricing Safety

Use:

Company name:
Example HVAC

Job type:
AC repair

Customer name:
Sarah

Technician notes:
Customer reported AC was not cooling. Technician replaced failed capacitor and checked cooling operation after repair.

Preferred message type:
Text message

Tone:
Friendly

Email:
test@example.com

Expected:

- Output should not invent price
- Output should not mention discount
- Output should not mention payment terms unless provided
- Review notes should mention confirming pricing before sending

---

## QA Test 7 — Declined Work

Use:

Company name:
Example HVAC

Job type:
Maintenance tune-up

Customer name:
Alex

Technician notes:
Completed seasonal AC maintenance. Filter was dirty and outdoor coil had debris. Recommended filter replacement and coil cleaning. Customer declined coil cleaning today.

Preferred message type:
Both text and email

Tone:
Professional

Email:
test@example.com

Expected:

- Output mentions declined coil cleaning only because notes support it
- Output should not pressure the customer too aggressively
- Output should not invent a price for coil cleaning
- Review notes should mention confirming recommendations and customer approval

---

## QA Test 8 — Commercial Refrigeration

Use:

Company name:
Example HVAC

Job type:
Commercial refrigeration

Customer name:
Chris

Technician notes:
Customer reported walk-in cooler running warmer than normal. Technician found condenser coil dirty and restricted with debris. Cleaned condenser coil and advised customer to monitor box temperature after service.

Preferred message type:
Email

Tone:
Professional

Email:
test@example.com

Expected:

- Output references walk-in cooler or commercial refrigeration
- Output does not invent temperature readings
- Output does not make food safety guarantees
- Review notes mention confirming readings, safety wording, and final conditions if needed

---

## QA Test 9 — Character Counter

Expected:

- Technician notes character counter appears
- Counter updates while typing
- Long notes over 4000 characters are rejected

---

## QA Test 10 — Copy Buttons

After successful generation, test:

- Copy Follow-Up Message
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

https://service-report-assistant.pages.dev/api/generate-customer-follow-up?v=qa

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
- [ ] Warranty safety test
- [ ] Pricing safety test
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
- Other tools besides service report, invoice, and customer follow-up are still static/demo tools.
- Cloudflare Workers AI quality may vary.
- OpenAI remains a possible future upgrade if higher writing quality is needed.

---

## Day 31 Outcome

By the end of Day 31:

- Customer follow-up generator is QA tested
- Backend and frontend are confirmed working
- Known limitations are documented
- Project is ready for the next AI tool

Recommended next step:

Day 32 — Build AI Backend for HVAC Maintenance Plan Pitch Generator
