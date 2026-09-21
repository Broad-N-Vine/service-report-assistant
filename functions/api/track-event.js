const ALLOWED_EVENTS = new Set([
  "page_view",
  "tool_start",
  "tool_completion",
  "tool_cta_click",
  "affiliate_click",
  "email_signup_attempt",
  "lead_magnet_click",
  "starter_kit_click",
  "purchase"
]);

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function cleanText(value, maxLength = 160) {
  return String(value || "")
    .replace(/[\r\n\t]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanPath(value) {
  const text = cleanText(value, 220);
  return text.startsWith("/") ? text.split("?")[0] : "";
}

function sameOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return false;

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch (error) {
    return false;
  }
}

export async function onRequestPost(context) {
  const request = context.request;
  const env = context.env || {};

  if (!sameOrigin(request)) {
    return jsonResponse({ success: false, error: "Origin not allowed." }, 403);
  }

  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) {
    return jsonResponse({ success: false, error: "JSON required." }, 415);
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return jsonResponse({ success: false, error: "Invalid JSON." }, 400);
  }

  const eventName = cleanText(body && body.eventName, 60);
  if (!ALLOWED_EVENTS.has(eventName)) {
    return jsonResponse({ success: false, error: "Unknown event." }, 400);
  }

  const properties = body && typeof body.properties === "object" && body.properties
    ? body.properties
    : {};

  const page = cleanPath(properties.page);
  const tool = cleanText(properties.tool, 80);
  const partner = cleanText(properties.partner, 80);
  const target = cleanText(properties.target, 160);
  const source = cleanText(properties.source, 160);
  const session = cleanText(properties.session, 80);

  if (env.ANALYTICS_ENGINE && typeof env.ANALYTICS_ENGINE.writeDataPoint === "function") {
    env.ANALYTICS_ENGINE.writeDataPoint({
      indexes: [eventName],
      blobs: [page, tool, partner, target, source, session],
      doubles: [1]
    });
  }

  console.log("hvac_analytics_event", {
    eventName,
    page,
    tool,
    partner,
    target,
    source,
    stored: Boolean(env.ANALYTICS_ENGINE)
  });

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

export async function onRequestGet(context) {
  return jsonResponse({
    success: true,
    status: "ok",
    analyticsBindingAvailable: Boolean(
      context.env &&
      context.env.ANALYTICS_ENGINE &&
      typeof context.env.ANALYTICS_ENGINE.writeDataPoint === "function"
    ),
    trackedEvents: Array.from(ALLOWED_EVENTS)
  });
}
