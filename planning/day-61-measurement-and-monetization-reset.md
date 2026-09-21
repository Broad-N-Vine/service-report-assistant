# Day 61 — Measurement and Monetization Operating Reset

## Goal

Move HVAC AI Helper from build-first execution into a measurable monetization operating loop.

The immediate critical path is:

1. Measure real usage.
2. Publish a stronger free lead magnet.
3. Launch the HVAC Paperwork Starter Kit v1.
4. Add paid-product CTAs only to high-intent pages.
5. Begin controlled external distribution.
6. Resume SEO expansion based on measured demand.

Broad technical SEO cleanup and visual redesign are frozen unless a defect or measured conversion problem justifies a change.

---

## Measurement Baseline

### Page traffic

Use Cloudflare Web Analytics for:

- Total site visits
- Page views
- Top landing pages
- Referrers
- Geographic/device trend review when useful

Cloudflare Pages can enable Web Analytics from the project Metrics screen without editing every page.

### Custom conversion events

The site now has a lightweight first-party analytics layer:

- `public/analytics.js`
- `functions/api/track-event.js`

Tracked event names:

- `page_view`
- `tool_start`
- `tool_completion`
- `tool_cta_click`
- `affiliate_click`
- `email_signup_attempt`
- `lead_magnet_click`
- `starter_kit_click`
- `purchase`

No technician notes, email addresses, customer names, prices, or generated output text are included in analytics events.

### Analytics Engine binding

To persist custom events, add a Cloudflare Pages Analytics Engine binding:

Variable name:

`ANALYTICS_ENGINE`

Dataset:

`hvac_ai_helper_events`

After adding the binding, redeploy the project.

If the binding is temporarily missing, the tracking endpoint still returns safely and logs the event without interrupting any user workflow.

---

## Analytics Engine field map

The tracking function writes:

- `index1` = event name
- `blob1` = page path
- `blob2` = tool
- `blob3` = affiliate partner
- `blob4` = target
- `blob5` = source page
- `blob6` = anonymous per-tab session ID
- `double1` = 1

---

## Useful weekly SQL queries

### Estimated visits — last 7 days

```sql
SELECT
  COUNT(DISTINCT blob6) AS sessions,
  SUM(_sample_interval) AS page_views
FROM hvac_ai_helper_events
WHERE
  timestamp > NOW() - INTERVAL '7' DAY
  AND index1 = 'page_view'
```

### Event totals — last 7 days

```sql
SELECT
  index1 AS event_name,
  SUM(_sample_interval) AS events
FROM hvac_ai_helper_events
WHERE timestamp > NOW() - INTERVAL '7' DAY
GROUP BY event_name
ORDER BY events DESC
```

### Tool starts by tool — last 7 days

```sql
SELECT
  blob2 AS tool,
  SUM(_sample_interval) AS starts
FROM hvac_ai_helper_events
WHERE
  timestamp > NOW() - INTERVAL '7' DAY
  AND index1 = 'tool_start'
GROUP BY tool
ORDER BY starts DESC
```

### Tool completions by tool — last 7 days

```sql
SELECT
  blob2 AS tool,
  SUM(_sample_interval) AS completions
FROM hvac_ai_helper_events
WHERE
  timestamp > NOW() - INTERVAL '7' DAY
  AND index1 = 'tool_completion'
GROUP BY tool
ORDER BY completions DESC
```

### Affiliate clicks — last 7 days

```sql
SELECT
  blob3 AS partner,
  SUM(_sample_interval) AS clicks
FROM hvac_ai_helper_events
WHERE
  timestamp > NOW() - INTERVAL '7' DAY
  AND index1 = 'affiliate_click'
GROUP BY partner
ORDER BY clicks DESC
```

### CTA source pages — last 7 days

```sql
SELECT
  blob5 AS source_page,
  index1 AS event_name,
  SUM(_sample_interval) AS events
FROM hvac_ai_helper_events
WHERE
  timestamp > NOW() - INTERVAL '7' DAY
  AND index1 IN ('tool_cta_click', 'lead_magnet_click', 'starter_kit_click')
GROUP BY source_page, event_name
ORDER BY events DESC
```

---

## Weekly scorecard rules

Use the Google Drive `ASSET TRACKER > WEEKLY SCORECARD` tab.

Record:

- Site visits
- Search clicks
- Search impressions
- Tool starts
- Tool completions
- Completion rate
- Email signups
- Signup rate
- Jobber clicks
- QuickBooks clicks
- Lead magnet CTA clicks
- Starter Kit CTA clicks
- Sales
- Revenue
- Top landing page
- Primary insight
- Exactly three next actions
- Broken items

Do not build a new content cluster just because the previous one is finished.

Build next based on:

- Search demand
- Tool usage
- Email conversion
- Affiliate clicks
- Product interest
- Real customer questions
- Broken conversion paths

---

## Privacy rule

Custom event tracking must never include:

- Email address
- Customer name
- Technician notes
- Generated service-report text
- Invoice text
- Estimate text
- Refrigerant readings
- Prices
- Addresses
- Phone numbers
- Any other customer-specific content

The measurement layer should answer what visitors do, not who they are.

---

## Next monetization actions

1. Finalize the free HVAC Service Paperwork Quick Pack.
2. Connect it to MailerLite delivery.
3. Finalize the HVAC Paperwork Starter Kit v1.
4. Create a no-code payment link.
5. Publish a simple Starter Kit sales page.
6. Add the paid CTA to only 5-7 high-intent pages.
7. Begin weekly measurement before expanding content volume again.
