# Day 37 — Estimate Description Generator Launch QA

## Goal

Confirm the HVAC Estimate Description Generator is working safely and reliably after connecting it to the Cloudflare Workers AI backend.

---

## Current Live Tool

Page:

https://service-report-assistant.pages.dev/hvac-estimate-description-generator.html

Backend endpoint:

/api/generate-estimate-description

---

## Current Status

The HVAC Estimate Description Generator is now connected to the AI backend.

The user can:

- Enter company name
- Select job type
- Enter customer first name
- Paste technician notes
- Add optional verified estimate details
- Select tone
- Enter email
- Generate estimate wording
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
AC repair estimate

Customer name:
Sarah

Technician notes:
Customer reported AC was running but not cooling well. Technician found outdoor coil dirty and filter clogged. Recommended coil cleaning and filter replacement. Customer asked for an estimate before approving additional work.

Verified estimate details:
Coil cleaning and filter replacement were recommended. Final pricing and scope should be confirmed by the office.

Tone:
Professional

Email:
test@example.com

Expected:

- Form submits successfully
- Loading message appears
- Generated result appears on the same page
- Estimate Description appears
- Short Estimate Line appears
- Customer Explanation appears
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

Needs repair.

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

## QA Test 5 — No Verified Estimate Details

Use:

Company name:
Example HVAC

Job type:
AC repair estimate

Customer name:
Alex

Technician notes:
Customer reported AC not cooling well. Technician found outdoor coil dirty and recommended coil cleaning.

Verified estimate details:
Leave blank.

Tone:
Professional

Email:
test@example.com

Expected:

- Output should not invent price
- Output should not invent final scope
- Output should not invent warranty terms
- Output should mention office review or final confirmation
- Review notes should mention confirming scope, pricing, parts, labor, and warranty language

---

## QA Test 6 — Pricing Safety

Use:

Company name:
Example HVAC

Job type:
Furnace repair estimate

Customer name:
Mike

Technician notes:
Customer reported furnace not heating. Technician found dirty flame sensor and recommended cleaning and further system review.

Verified estimate details:
Flame sensor cleaning and system review were recommended. Final pricing should be confirmed by the office.

Tone:
Professional

Email:
test@example.com

Expected:

- Output should not invent price
- Output should not invent labor rate
- Output should not invent tax
- Output should not invent discount
- Review notes should mention confirming pricing and estimate details

---

## QA Test 7 — Scope Safety

Use:

Company name:
Example HVAC

Job type:
Condensate drain repair estimate

Customer name:
Sarah

Technician notes:
Customer reported water near indoor unit. Technician found condensate drain restricted. Recommended drain clearing and pan inspection.

Verified estimate details:
Drain clearing and pan inspection are recommended. Final scope should be confirmed by the office.

Tone:
Friendly

Email:
test@example.com

Expected:

- Output should not add work that was not documented
- Output should not say replacement is required unless notes support it
- Output should not promise the issue is permanently resolved
- Review notes should mention confirming final scope

---

## QA Test 8 — Overpromise Safety

Use:

Company name:
Example HVAC

Job type:
Coil cleaning estimate

Customer name:
Chris

Technician notes:
Outdoor coil was dirty and restricted with debris. Technician recommended coil cleaning to improve airflow and allow the system to be reviewed after cleaning.

Verified estimate details:
Coil cleaning was recommended. Final pricing should be confirmed by the office.

Tone:
Professional

Email:
test@example.com

Expected:

- Output should not guarantee lower utility bills
- Output should not guarantee better comfort
- Output should not guarantee fewer repairs
- Output should not claim the system is safe
- Review notes should mention checking benefit claims and warranty language

---

## QA Test 9 — Commercial Refrigeration

Use:

Company name:
Example HVAC

Job type:
Commercial refrigeration estimate

Customer name:
Chris

Technician notes:
Customer reported walk-in cooler running warmer than normal. Technician found condenser coil dirty and restricted with debris. Recommended condenser coil cleaning and maintenance review.

Verified estimate details:
Condenser coil cleaning and maintenance review were recommended. Final pricing should be confirmed by the office.

Tone:
Professional

Email:
test@example.com

Expected:

- Output references walk-in cooler or commercial refrigeration
- Output does not invent temperature readings
- Output does not make food safety guarantees
- Output does not guarantee future performance
- Review notes mention confirming final scope and safety wording

---

## QA Test 10 — Character Counter

Expected:

- Technician notes character counter appears
- Counter updates while typing
- Long notes over 4000 characters are rejected

---

## QA Test 11 — Copy Buttons

After successful generation, test:

- Copy Estimate Description
- Copy Short Estimate Line
- Copy Customer Explanation
- Copy Review Notes

Expected:

- Button changes to Copied
- Text can be pasted elsewhere
- Button text resets after a short delay

---

## QA Test 12 — Mobile Layout

Open the page on mobile or narrow browser width.

Expected:

- Form remains usable
- Generated result is readable
- Copy buttons are tappable
- MailerLite form section remains readable
- No horizontal scrolling problem

---

## QA Test 13 — MailerLite Section

After generating a result, confirm:

- MailerLite signup section appears
- Form loads
- Signup still works
- Subscriber enters MailerLite automation

Note:

The generator email field currently validates the generator request.
The MailerLite embedded form is still the actual email automation signup path.

---

## QA Test 14 — Affiliate Resources

Confirm:

- Jobber link opens
- QuickBooks link opens
- Affiliate disclosure appears before links
- Links open in a new tab
- HVAC Paperwork Starter Kit still says coming soon

---

## QA Test 15 — Backend Endpoint

Open:

https://service-report-assistant.pages.dev/api/generate-estimate-description?v=qa

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
- [ ] No verified estimate details test
- [ ] Pricing safety test
- [ ] Scope safety test
- [ ] Overpromise safety test
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
- Other tools besides service report, invoice, customer follow-up, maintenance pitch, and estimate description are still static/demo tools.
- Cloudflare Workers AI quality may vary.
- Estimate pricing, scope, parts, labor, taxes, discounts, and warranty language must be verified by the company before use.
- OpenAI remains a possible future upgrade if higher writing quality is needed.

---

## Day 37 Outcome

By the end of Day 37:

- Estimate description generator is QA tested
- Backend and frontend are confirmed working
- Known limitations are documented
- Project is ready for the next AI tool

Recommended next step:

Day 38 — Build AI Backend for Commercial Refrigeration Service Report Generator
