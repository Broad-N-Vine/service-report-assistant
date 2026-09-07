# Day 58 - Canonical URL Signal Cleanup

## Objective

Strengthen canonical URL signals across HVAC AI Helper after the site moved to an extensionless public URL strategy.

The goal was to help Google better understand that extensionless URLs are the preferred public versions of the site pages.

## Background

Cloudflare Pages serves the physical `.html` files while public URLs resolve cleanly as extensionless URLs.

Google Search Console previously showed old `.html` URLs under Page with redirect and a mix of extensionless and `.html` URLs under Crawled - currently not indexed.

The site strategy remains:

- Public URLs are extensionless.
- Physical files remain `.html`.
- No new redirects are added.
- Sitemap uses extensionless URLs.
- Internal links use extensionless URLs.
- Canonical tags now point to extensionless URLs.

## Pages updated

Canonical tags were added to:

- Homepage
- Tools page
- Guides page
- Contact page
- Privacy page
- Affiliate disclosure page
- Live AI generator pages
- Static guide pages
- Checklist pages
- Template pages
- Invoice wording pages
- Customer follow-up pages
- Service report example pages
- Commercial refrigeration pages

## Pages intentionally not updated

`public/thank-you.html` was not given a canonical tag.

That page remains outside the public SEO flow and should remain noindex.

## Canonical format

Each public page now uses a self-referencing canonical tag pointing to its extensionless URL.

Example:

```html
<link rel="canonical" href="https://service-report-assistant.pages.dev/hvac-service-report-generator" />
