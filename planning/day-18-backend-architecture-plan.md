# Day 18 — Backend Architecture Plan

## Goal

Plan the backend architecture for the future real AI version of HVAC AI Helper.

The backend must allow the HVAC Service Report Generator to call an AI provider securely without exposing API keys in public frontend code.

The first backend version should be simple, secure, and beginner-manageable.

---

## Current Stack

Current frontend:

- Cloudflare Pages
- Static HTML pages
- CSS file
- Frontend JavaScript/demo tool behavior
- MailerLite embedded form
- GitHub repository connected to deployment

Current email system:

- MailerLite form
- MailerLite automation
- Subscriber thank-you message
- 6-email welcome sequence

Current limitation:

The tools are still demo/static frontend tools and do not call a real AI backend yet.

---

## Recommended Backend Direction

Use:

Cloudflare Pages frontend
+
Cloudflare Pages Function backend endpoint
+
AI provider API
+
MailerLite subscriber capture
+
Same-page generated output

---

## Why This Architecture Makes Sense

### 1. It fits the current site

The site is already on Cloudflare Pages, so adding a Pages Function keeps the project inside the same platform instead of adding a separate backend host too early.

---

### 2. It protects the AI API key

The AI API key should never be placed inside public HTML, public JavaScript, or any file inside the public folder.

Instead:

- Store the AI API key as a Cloudflare secret
- Read it only from the backend function
- Let the browser call the backend endpoint
- Let the backend call the AI provider

---

### 3. It keeps the user experience clean

The user should stay on the generator page.

Correct future flow:

User fills out generator form
->
Frontend sends form data to backend endpoint
->
Backend calls AI
->
Backend returns generated result
->
Frontend displays result on the same page

---

### 4. It is easier to grow later

After the first generator works, the same backend pattern can be reused for:

- HVAC Invoice Description Generator
- HVAC Customer Follow-Up Text Generator
- HVAC Maintenance Plan Pitch Generator
- HVAC Estimate Description Generator
- Commercial Refrigeration Service Report Generator

---

## Recommended File Structure

Future backend files should use a structure similar to this:

```text
public/
  index.html
  tools.html
  blog.html
  hvac-service-report-generator.html
  styles.css

functions/
  api/
    generate-service-report.js
