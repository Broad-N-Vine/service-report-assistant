# Day 19 — AI Prompt and JSON Output Contract

## Goal

Define the exact prompt and structured JSON response contract for the future real AI version of the HVAC Service Report Generator.

The backend should send rough HVAC/R technician notes to the AI provider and receive predictable structured output that the frontend can display on the same page.

The goal is to avoid messy AI responses and make the generator easy to build, test, and expand later.

---

## Recommended Build Decision

Use a simple but upgrade-ready first version.

### Version 1

Build one working AI generator first:

- HVAC Service Report Generator
- Cloudflare Pages Function backend endpoint
- OpenAI API call from the backend
- Same-page result display
- Five structured output sections
- Copy buttons
- Basic validation
- Human review warning
- Existing MailerLite signup flow remains separate for now

### Version 2

Upgrade later:

- Add MailerLite API subscriber capture
- Send generated report copy by email
- Add Cloudflare Turnstile
- Add usage limits
- Add more generator tools
- Add paid template pack or paid AI usage path

---

## Why Version 1 Should Stay Simple

Version 1 should focus on proving the core promise:

User enters rough technician notes -> AI generates useful service paperwork -> result appears on the page.

Do not combine too many systems in the first real AI build.

Avoid adding these in version 1:

- User accounts
- Payments
- Saved history
- MailerLite API integration
- Emailing generated reports
- Multiple AI tools at once
- Complex analytics
- Complex rate limits

Those features can be added after the first real generator works.

---

## Future Backend Endpoint

Recommended endpoint:

/api/generate-service-report

Frontend page:

public/hvac-service-report-generator.html

Backend file:

functions/api/generate-service-report.js

---

## Required Input Fields

The frontend should send these fields to the backend:

### Required

- jobType
- technicianNotes
- email

### Optional

- companyName
- tone

---

## Recommended Request JSON

Example request from the frontend to the backend:

{
  "companyName": "Example HVAC",
  "jobType": "No-cooling service call",
  "technicianNotes": "Customer reported AC not cooling. Found failed capacitor. Replaced capacitor. System started and cooling checked.",
  "tone": "Professional",
  "email": "customer@example.com"
}

---

## Backend Validation Rules

Before calling the AI provider, the backend should validate:

- technicianNotes is present
- technicianNotes is at least 25 characters
- technicianNotes is not more than 4000 characters
- jobType is present
- email is present
- email has a basic valid format
- honeypot field is empty if added later

If validation fails, do not call the AI provider.

Return a clear error response instead.

---

## Error Response Format

Use this structure for errors:

{
  "success": false,
  "error": "Please add more detail to the technician notes before generating your report."
}

---

## Successful Response Format

Use this structure for successful responses:

{
  "success": true,
  "result": {
    "serviceReport": "Customer-ready service report text here.",
    "invoiceDescription": "Invoice wording here.",
    "customerFollowUp": "Customer follow-up message here.",
    "internalSummary": "Internal office summary here.",
    "reviewNotes": [
      "Confirm pricing before sending.",
      "Confirm warranty language before sending.",
      "Review final wording before sending to customer."
    ]
  }
}

---

## Required Output Sections

The AI output must include exactly these five sections:

1. serviceReport
2. invoiceDescription
3. customerFollowUp
4. internalSummary
5. reviewNotes

The frontend will display these as:

1. Customer-Ready Service Report
2. Invoice Description
3. Customer Follow-Up Message
4. Internal Job Summary
5. Missing Information or Review Notes

---

## JSON Schema Contract

Use this schema as the target response shape:

{
  "type": "object",
  "additionalProperties": false,
  "required": [
    "serviceReport",
    "invoiceDescription",
    "customerFollowUp",
    "internalSummary",
    "reviewNotes"
  ],
  "properties": {
    "serviceReport": {
      "type": "string",
      "description": "Plain-English customer-ready HVAC/R service report."
    },
    "invoiceDescription": {
      "type": "string",
      "description": "Short invoice wording based only on confirmed work."
    },
    "customerFollowUp": {
      "type": "string",
      "description": "Short customer follow-up message."
    },
    "internalSummary": {
      "type": "string",
      "description": "Short internal office summary."
    },
    "reviewNotes": {
      "type": "array",
      "description": "Missing information, unclear items, or human review reminders.",
      "items": {
        "type": "string"
      }
    }
  }
}

---

## System Prompt

Use this as the system instruction for the AI provider:

You are an AI writing assistant for HVAC/R service companies.

Your job is to turn rough technician notes into clean, professional service paperwork.

Use only the information provided by the user. Do not invent facts, parts, prices, model numbers, serial numbers, warranties, guarantees, test results, safety claims, code-compliance claims, or final operating conditions.

Write in plain English. Keep the tone professional and useful for HVAC/R business owners, office managers, technicians, and customers.

The output must be practical, clear, and easy to review before sending to a customer.

Always flag missing or unclear information instead of guessing.

Do not mention that you are an AI.

Return only the requested structured output.

---

## User Prompt Template

Use this as the user message template:

Company name:
{{companyName}}

Job type:
{{jobType}}

Preferred tone:
{{tone}}

Technician notes:
{{technicianNotes}}

Task:
Create a clean HVAC/R service paperwork package based only on the information provided.

Return these sections:

1. Customer-Ready Service Report
Write a clear, plain-English service report for the customer. Explain what was reported, what was found, what work was completed, and any recommendation that is directly supported by the technician notes.

2. Invoice Description
Write 1 to 3 short invoice lines that describe the confirmed work performed. Make the wording professional and easy to paste into invoice software.

3. Customer Follow-Up Message
Write a short text-message or email-style follow-up. Thank the customer, summarize the visit, and mention any next step only if the technician notes support it.

4. Internal Job Summary
Write a short internal summary for office records. This can be more direct than the customer-facing report.

5. Missing Information or Review Notes
List any important missing details, unclear items, or things a human should review before sending this to the customer.

Rules:
- Do not invent facts.
- Do not invent parts.
- Do not invent prices.
- Do not invent model numbers.
- Do not invent serial numbers.
- Do not invent test readings.
- Do not invent warranty language.
- Do not claim the system is fully fixed unless the notes clearly say that.
- Do not claim the system is safe unless the notes clearly support that.
- Do not guarantee fewer repairs.
- Do not guarantee lower bills.
- Do not guarantee better comfort.
- Do not provide legal, code-compliance, or safety certification language.
- If the notes are too vague, explain what information is missing.
- Use the preferred tone, but keep the writing professional.
- Keep the full result concise and useful.
- Always include a review reminder in the review notes.

---

## Recommended Tone Options

Keep the first version simple.

Allowed tone values:

- Professional
- Friendly
- Brief
- Detailed

Default tone:

Professional

If the submitted tone is missing or unsupported, use Professional.

---

## Recommended Job Type Options

The frontend can allow free text or a simple dropdown.

Recommended first dropdown options:

- No-cooling service call
- No-heat service call
- Maintenance visit
- Repair visit
- Tune-up
- Filter replacement
- Condensate drain issue
- Coil cleaning
- Commercial refrigeration service
- Estimate or recommendation
- Other

For version 1, free text is acceptable as long as the backend validates that something was entered.

---

## Sample Input 1

{
  "companyName": "Example HVAC",
  "jobType": "No-cooling service call",
  "technicianNotes": "Customer reported AC not cooling. Found failed capacitor. Replaced capacitor with approved part. System started and cooling checked before leaving.",
  "tone": "Professional",
  "email": "test@example.com"
}

---

## Sample Output 1

{
  "serviceReport": "Customer reported that the AC system was not cooling. Technician inspected the system and found a failed capacitor. The capacitor was replaced with an approved replacement part. After the repair, the system started and cooling was checked before the technician left.",
  "invoiceDescription": "Diagnosed AC no-cooling issue and replaced confirmed failed capacitor. Checked system operation after repair.",
  "customerFollowUp": "Thank you for having us out today. We completed the documented AC repair and checked cooling operation after the repair. Please contact us if you notice any additional comfort concerns.",
  "internalSummary": "No-cooling call. Technician found failed capacitor, replaced approved part, and checked cooling operation after repair.",
  "reviewNotes": [
    "Confirm capacitor part details before sending if needed.",
    "Confirm pricing and warranty language before sending.",
    "Review final wording before sending to customer."
  ]
}

---

## Sample Input 2

{
  "companyName": "Example HVAC",
  "jobType": "Clogged condensate drain",
  "technicianNotes": "Water near indoor unit. Drain line clogged. Cleared drain and flushed line. Water draining after service.",
  "tone": "Friendly",
  "email": "test@example.com"
}

---

## Sample Output 2

{
  "serviceReport": "Customer reported water near the indoor unit. Technician found the condensate drain line clogged. The drain line was cleared and flushed, and water was draining after service.",
  "invoiceDescription": "Cleared clogged condensate drain line and flushed drain. Checked drainage after service.",
  "customerFollowUp": "Thank you for having us out today. We cleared and flushed the clogged condensate drain line, and drainage was checked after service. Please monitor the area and contact us if water concerns return.",
  "internalSummary": "Water near indoor unit. Found clogged condensate drain line. Cleared and flushed drain. Drainage checked after service.",
  "reviewNotes": [
    "Confirm whether any water damage was observed or discussed.",
    "Confirm pricing and warranty language before sending.",
    "Review final wording before sending to customer."
  ]
}

---

## Sample Input 3 — Vague Notes

{
  "companyName": "Example HVAC",
  "jobType": "Repair visit",
  "technicianNotes": "Fixed unit. Works now.",
  "tone": "Professional",
  "email": "test@example.com"
}

---

## Sample Output 3 — Vague Notes

{
  "serviceReport": "Technician completed a repair visit and noted that the unit was working after service. The notes provided do not include enough detail to explain what issue was reported, what was found, or what specific work was completed.",
  "invoiceDescription": "Completed HVAC service visit. Additional detail should be confirmed before finalizing invoice wording.",
  "customerFollowUp": "Thank you for having us out today. Our technician completed the service visit. Please contact us if you have any additional concerns.",
  "internalSummary": "Repair visit completed. Notes are vague and should be reviewed before sending customer-facing paperwork.",
  "reviewNotes": [
    "Confirm what the customer reported.",
    "Confirm what the technician found.",
    "Confirm what work was completed.",
    "Confirm whether any parts were used.",
    "Confirm pricing and warranty language before sending.",
    "Review final wording before sending to customer."
  ]
}

---

## Frontend Display Mapping

The frontend should map the JSON keys to visible sections like this:

serviceReport:
Customer-Ready Service Report

invoiceDescription:
Invoice Description

customerFollowUp:
Customer Follow-Up Message

internalSummary:
Internal Job Summary

reviewNotes:
Missing Information or Review Notes

---

## Copy Button Mapping

Add one copy button per output section:

serviceReport:
Copy Service Report

invoiceDescription:
Copy Invoice Description

customerFollowUp:
Copy Follow-Up Message

internalSummary:
Copy Internal Summary

reviewNotes:
Copy Review Notes

---

## Frontend Review Warning

Display this above or below the generated output:

Review before sending:
AI-generated wording should be reviewed before it is sent to a customer. Confirm pricing, parts, readings, warranty language, customer approval, safety wording, and company-specific details.

---

## Backend Safety Checklist

Before sending a response back to the frontend, the backend should confirm:

- AI returned a valid object
- serviceReport is present
- invoiceDescription is present
- customerFollowUp is present
- internalSummary is present
- reviewNotes is present
- reviewNotes is an array
- No raw error details are shown to the user
- No API key is exposed
- No full technician notes are logged unnecessarily

---

## User-Facing Error Messages

### Missing required fields

Please complete the required fields before generating your report.

### Notes too short

Please add more detail to the technician notes before generating your report.

### Notes too long

Please shorten the technician notes before generating your report.

### Invalid email

Please enter a valid email address before generating your report.

### AI generation failed

Something went wrong while generating the report. Please try again in a moment.

### Backend unavailable

The generator is temporarily unavailable. Please try again later.

---

## Version 1 Testing Checklist

Test these before calling the tool live:

- [ ] Empty technician notes
- [ ] Short technician notes
- [ ] Very long technician notes
- [ ] Missing job type
- [ ] Missing email
- [ ] Invalid email
- [ ] Normal no-cooling notes
- [ ] Normal no-heat notes
- [ ] Normal maintenance notes
- [ ] Vague notes
- [ ] Commercial refrigeration notes
- [ ] Same-page result display
- [ ] Copy Service Report button
- [ ] Copy Invoice Description button
- [ ] Copy Follow-Up Message button
- [ ] Copy Internal Summary button
- [ ] Copy Review Notes button
- [ ] Mobile layout
- [ ] Loading state
- [ ] Error state
- [ ] No API key visible in browser code
- [ ] No redirect away from result

---

## Version 1 Success Criteria

The first real AI generator is successful when:

- User enters rough HVAC/R notes
- User clicks Generate Service Paperwork
- Backend validates the request
- Backend securely calls the AI provider
- AI returns structured JSON
- Result appears on the same page
- User can copy each section
- User sees a review warning
- API key remains private
- Existing MailerLite signup path still works

---

## Day 19 Outcome

By the end of Day 19, the project has a clear AI prompt and JSON contract.

Recommended next step:

Day 20 — Build the First Backend Function Draft
