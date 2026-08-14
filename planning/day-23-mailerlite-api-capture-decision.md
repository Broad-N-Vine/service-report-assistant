# Day 23 — MailerLite API Capture Decision

## Goal

Decide whether the HVAC Service Report Generator should automatically add users to MailerLite when they generate a result.

The generator is now connected to Cloudflare Workers AI and returns results on the same page.

Current question:

Should the email field in the generator form also add the user to MailerLite automatically?

---

## Current Generator Flow

Current live page:

https://service-report-assistant.pages.dev/hvac-service-report-generator.html

Current behavior:

1. User enters job details
2. User enters email address
3. User clicks Generate Service Paperwork
4. Cloudflare Workers AI backend generates result
5. Result appears on the same page
6. Copy buttons work
7. MailerLite signup section appears below the result

---

## Current Limitation

The email field inside the generator form currently validates the AI request.

It does not automatically add the user to MailerLite.

MailerLite signup still happens through the embedded MailerLite form shown below the generated result.

---

## Ideal Future Flow

The best future user experience is:

1. User enters job details
2. User enters email once
3. User clicks Generate Service Paperwork
4. Backend generates AI result
5. Backend adds or updates subscriber in MailerLite
6. Result appears on the same page
7. Subscriber enters the welcome email automation

This would remove the second email form step.

---

## MailerLite API Capture Benefits

Pros:

- Better user experience
- One form instead of two
- Less friction after result generation
- More subscribers should enter the email sequence
- Cleaner funnel tracking
- Better match between generator use and email follow-up

---

## MailerLite API Capture Risks

Cons:

- Requires MailerLite API token
- Requires storing another secret in Cloudflare
- Requires more backend error handling
- Requires choosing the correct MailerLite group
- Requires testing double opt-in behavior
- Could create confusion if API capture and embedded form both exist
- Adds another moving part to the first AI tool

---

## Required MailerLite Information

To build this later, we need:

1. MailerLite API token
2. MailerLite Group ID
3. Confirmation of which group triggers the current welcome automation
4. Confirmation whether double opt-in still applies to API-created subscribers
5. Decision on whether to keep or remove the embedded MailerLite form on the generator page

---

## Security Rules

Do not put the MailerLite API token in:

- HTML
- public JavaScript
- GitHub files
- planning files
- screenshots
- messages

The token should be stored only as a Cloudflare secret.

Likely secret name:

MAILERLITE_API_KEY

Possible group variable:

MAILERLITE_GROUP_ID

---

## Future Backend Behavior

When the user submits the generator form, the backend should:

1. Validate job type
2. Validate technician notes
3. Validate tone
4. Validate email
5. Generate AI result
6. Attempt to add subscriber to MailerLite
7. Return the AI result even if MailerLite capture fails

Important:

The AI result should not fail just because MailerLite capture fails.

If AI succeeds but MailerLite fails, show the result and optionally show:

Your service paperwork was generated, but email signup may not have completed. You can still copy your result below.

---

## Recommended Version 1 Decision

Do not add MailerLite API capture yet.

Reason:

The AI generator just went live. Keep the first live AI version stable before adding another API dependency.

Current acceptable behavior:

- Generator email field validates request
- MailerLite embedded form appears after result
- User can join email sequence manually

---

## Recommended Version 2 Decision

Add MailerLite API capture after the generator has passed live QA and the page has been stable.

When adding API capture:

- Add MAILERLITE_API_KEY as a Cloudflare secret
- Add MAILERLITE_GROUP_ID as a Cloudflare variable or secret
- Update backend function to call MailerLite
- Keep AI result visible even if MailerLite call fails
- Test with fresh email addresses
- Confirm subscribers enter automation
- Then consider hiding or removing the embedded MailerLite form from this generator page

---

## Suggested Future User Message

After successful generation and MailerLite capture:

Your service paperwork was generated successfully. Review the result below before using it. You may also receive helpful HVAC/R paperwork examples by email.

If MailerLite capture fails:

Your service paperwork was generated successfully. Email signup may not have completed, but you can still copy your result below.

---

## Day 23 Decision

Decision:

Wait before adding MailerLite API capture.

Reason:

The main AI generator is newly live and should be kept stable before adding another API dependency.

Next immediate focus:

Day 24 — AI Generator Usage and Safety Cleanup

---

## Day 23 Outcome

By the end of Day 23:

- MailerLite API capture is documented
- Decision is made to delay implementation
- Required future information is listed
- The current split flow is understood
- The project remains stable
