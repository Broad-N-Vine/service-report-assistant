# Day 17 — Real AI Generator Flow Plan

## Goal

Define the correct user experience for the future real AI version of the HVAC Service Report Generator.

The goal is to make sure the site makes good on its promise:

Visitor enters rough HVAC/R technician notes -> tool generates useful service paperwork -> visitor can review/copy the result -> email follow-up supports the relationship.

---

## Current Status

The site currently has:

- Live website
- Static/demo frontend tools
- MailerLite email capture
- Thank-you page
- 6-email welcome automation
- Affiliate/resource sections
- SEO guide and example pages

Important:

The current tools are not connected to a live AI backend yet.

That means the current generator experience should be treated as a demo/helper stage, not the final product experience.

---

## Future Real-AI Tool Promise

When AI functionality is connected, the HVAC Service Report Generator should actually generate output based on the user's rough technician notes.

The final behavior should not be:

User enters notes -> enters email -> gets redirected away -> no report is generated.

The correct behavior should be:

User enters notes -> submits form -> AI generates output -> result appears on the page -> user can copy the output -> user is added to email sequence.

---

## Recommended Future User Flow

### Step 1 — Visitor opens the generator

Page:

https://service-report-assistant.pages.dev/hvac-service-report-generator.html

Visitor sees:

- Clear tool title
- Short explanation
- Safety/review reminder
- Form fields
- Email field
- Generate button

---

### Step 2 — Visitor fills out the form

Recommended fields:

- Company name
- Job type
- Technician notes
- Preferred tone
- Email address

Optional future fields:

- Customer type
- Equipment type
- Service category
- Include invoice wording checkbox
- Include customer follow-up checkbox
- Include internal summary checkbox

---

### Step 3 — Visitor clicks Generate

Button text:

Generate Service Paperwork

The button should not say only "Submit" because the expected action is generation.

---

### Step 4 — Loading state appears

While the AI is working, show a clear message:

Generating your service paperwork...

Do not refresh this page.

This may take a few seconds.

---

### Step 5 — Backend securely calls AI

Important rule:

Do not expose API keys in public frontend code.

The frontend should send the form data to a secure backend endpoint.

The backend should:

- Validate the request
- Check for required fields
- Call the AI provider securely
- Return structured output to the page
- Handle errors safely

---

### Step 6 — Result appears on the same page

The generated output should appear directly on the generator page.

Recommended output sections:

1. Customer-Ready Service Report
2. Invoice Description
3. Customer Follow-Up Message
4. Internal Job Summary
5. Missing Information or Review Notes

Each section should have:

- Clear heading
- Generated text
- Copy button

---

### Step 7 — Email capture still happens

The email field should support the relationship, not replace the result.

Recommended behavior:

- Add subscriber to MailerLite
- Show the generated result on-page
- Continue sending the welcome sequence
- Optional future upgrade: email a copy of the generated result

---

### Step 8 — Human review reminder appears near the result

Display this near the generated output:

Review before sending:
AI-generated wording should be reviewed before it is sent to a customer. Confirm pricing, parts, readings, warranty language, customer approval, safety wording, and company-specific details.

---

## Result Delivery Decision

### Primary result delivery

Show result immediately on the same page.

Reason:

Users expect a generator to produce output immediately after they fill out the form.

---

### Optional future result delivery

Email a copy of the generated result to the user.

Reason:

This can be useful later, but it should not replace the on-page result.

---

## Thank-You Page Role

The thank-you page is still useful, but it should not be the final result screen for the real AI generator.

Use thank-you.html for:

- General newsletter signup confirmation
- Future lead magnet signup confirmation
- Future template download confirmation
- Non-generator email capture forms

Do not rely on thank-you.html as the final output screen for the real generator.

---

## Required Output Format

The AI should return output in this format:

### 1. Customer-Ready Service Report

Plain-English report for the customer.

Should include:
- What the customer reported
- What the technician found
- What work was completed
- What recommendation is supported by the notes

Should not include:
- Unsupported claims
- Invented readings
- Invented pricing
- Invented parts
- Warranty promises
- Safety guarantees
- Long-term performance promises

---

### 2. Invoice Description

Short invoice wording.

Should include:
- Confirmed work performed
- Confirmed parts or service only if provided
- Clear billing-style wording

Should not include:
- Unconfirmed pricing
- Unsupported warranty language
- Overly technical language unless needed

---

### 3. Customer Follow-Up Message

Short email or text-style message.

Should include:
- Thank-you message
- Brief summary
- Supported next step if applicable

Should not include:
- Pressure-heavy sales language
- Unsupported promises
- Unsupported maintenance claims

---

### 4. Internal Job Summary

Short internal office summary.

Should include:
- Direct job summary
- What was done
- What needs review
- Any follow-up needed

This can be more direct than customer-facing wording.

---

### 5. Missing Information or Review Notes

List unclear or missing items.

Examples:
- Confirm final operating condition
- Confirm model/serial numbers
- Confirm pricing
- Confirm warranty language
- Confirm customer approval
- Confirm readings
- Confirm parts used
- Review before sending to customer

---

## AI Safety and Trust Rules

The AI must follow these rules:

- Do not invent facts.
- Do not invent parts.
- Do not invent prices.
- Do not invent model numbers.
- Do not invent serial numbers.
- Do not invent readings.
- Do not invent warranty terms.
- Do not claim the system is safe unless notes clearly support that.
- Do not claim the system is fully fixed unless notes clearly support that.
- Do not guarantee fewer repairs.
- Do not guarantee lower bills.
- Do not guarantee better comfort.
- Do not provide legal, code-compliance, or safety certification language.
- Flag missing information instead of guessing.
- Keep wording professional and plain-English.
- Remind the user to review before sending.

---

## Recommended Page Behavior

### Before generation

Show:

- Form
- Email field
- Review disclaimer
- Example notes
- Helpful resource links

---

### During generation

Show:

- Loading message
- Disabled generate button
- No page redirect

---

### After generation

Show:

- Generated report sections
- Copy buttons
- Review warning
- Related tool links
- Recommended resources
- Optional email confirmation message

---

## Error Handling

If required fields are missing, show:

Please complete the required fields before generating your report.

If notes are too vague, show:

The notes are too vague to create a reliable customer-ready report. Please add what the customer reported, what the technician found, and what work was completed.

If AI generation fails, show:

Something went wrong while generating the report. Please try again in a moment.

If email capture fails but AI generation works, show:

Your report was generated, but the email signup may not have completed. You can still copy your result below.

If AI generation fails but email capture works, show:

Your email signup was received, but the report could not be generated. Please try again.

---

## Backend Requirements

The backend should:

- Keep API keys private
- Validate form input
- Limit request size
- Prevent empty submissions
- Prevent obvious spam submissions
- Return structured results
- Log errors without exposing private user notes
- Avoid storing sensitive job notes unless there is a clear reason
- Support future usage limits if needed

---

## Privacy Notes

The generator may receive job notes that include customer or service details.

Future privacy wording should explain:

- What information users submit
- That generated outputs should be reviewed
- That email signup is used for follow-up messages
- That users should avoid submitting sensitive personal information when possible
- That the site does not sell email addresses

---

## Recommended First Real-AI Version

Keep version 1 simple.

Do not start with user accounts, payments, dashboards, or complex saved history.

Version 1 should include:

- One working generator
- Secure backend endpoint
- Same-page generated result
- Email capture
- Copy buttons
- Basic error handling
- Human review warning

Start with:

HVAC Service Report Generator

Do not connect every tool at once.

After the main generator works, repeat the same pattern for:

- HVAC Invoice Description Generator
- HVAC Customer Follow-Up Text Generator
- HVAC Maintenance Plan Pitch Generator
- HVAC Estimate Description Generator
- Commercial Refrigeration Service Report Generator

---

## Success Criteria

This step is complete when the project has a clear blueprint for the real AI generator experience.

The future AI version must satisfy these rules:

- User receives generated output
- Output is based on their rough notes
- Result appears on the page
- Email capture supports the workflow
- Thank-you page is not used as the result page
- API keys are not exposed
- The tool does not overpromise
- The user is reminded to review before sending

---

## Day 17 Outcome

By the end of Day 17, the project has a clear product behavior plan for the real AI generator.

Next recommended step:

Day 18 — Backend Architecture Plan
