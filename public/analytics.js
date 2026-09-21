(() => {
  "use strict";

  const TOOL_FORMS = {
    "service-report-form": "service-report",
    "invoice-description-form": "invoice-description",
    "follow-up-form": "customer-follow-up",
    "maintenance-plan-pitch-form": "maintenance-plan-pitch",
    "estimate-description-form": "estimate-description",
    "commercial-refrigeration-form": "commercial-refrigeration"
  };

  const GENERATOR_PATHS = {
    "/hvac-service-report-generator": "service-report",
    "/hvac-invoice-description-generator": "invoice-description",
    "/hvac-customer-follow-up-text-generator": "customer-follow-up",
    "/hvac-maintenance-plan-pitch-generator": "maintenance-plan-pitch",
    "/hvac-estimate-description-generator": "estimate-description",
    "/commercial-refrigeration-service-report-generator": "commercial-refrigeration"
  };

  function cleanPath(value) {
    try {
      const url = new URL(value, window.location.origin);
      return url.pathname.slice(0, 200);
    } catch (error) {
      return String(value || "").split("?")[0].slice(0, 200);
    }
  }

  function cleanValue(value, maxLength = 100) {
    return String(value || "").trim().slice(0, maxLength);
  }

  function getPagePath() {
    return cleanPath(window.location.href);
  }

  function sendToCloudflare(eventName, properties) {
    if (window.zaraz && typeof window.zaraz.track === "function") {
      try {
        window.zaraz.track(eventName, properties);
      } catch (error) {
        // Analytics must never interrupt the user workflow.
      }
    }
  }

  function sendToFirstPartyEndpoint(eventName, properties) {
    const payload = JSON.stringify({
      eventName,
      properties
    });

    try {
      fetch("/api/track-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: payload,
        keepalive: true,
        credentials: "same-origin"
      }).catch(() => {});
    } catch (error) {
      // Analytics must never interrupt the user workflow.
    }
  }

  function track(eventName, properties = {}) {
    const safeProperties = {
      page: getPagePath(),
      tool: cleanValue(properties.tool),
      partner: cleanValue(properties.partner),
      target: cleanValue(properties.target, 160),
      source: cleanValue(properties.source, 160)
    };

    sendToCloudflare(eventName, safeProperties);
    sendToFirstPartyEndpoint(eventName, safeProperties);
  }

  window.hvacTrack = track;

  function inferToolFromHref(href) {
    try {
      const url = new URL(href, window.location.origin);
      return GENERATOR_PATHS[url.pathname.replace(/\.html$/, "")] || "";
    } catch (error) {
      return "";
    }
  }

  function trackLinkClick(anchor) {
    const href = anchor.getAttribute("href") || "";
    if (!href) return;

    let url;
    try {
      url = new URL(href, window.location.origin);
    } catch (error) {
      return;
    }

    const explicitEvent = cleanValue(anchor.dataset.trackEvent);
    if (explicitEvent) {
      track(explicitEvent, {
        target: anchor.dataset.trackTarget || cleanPath(url.href),
        source: anchor.dataset.trackSource || getPagePath()
      });
      return;
    }

    if (url.hostname === "go.getjobber.com") {
      track("affiliate_click", {
        partner: "jobber",
        target: url.hostname,
        source: getPagePath()
      });
      return;
    }

    if (url.hostname === "quickbooks.intuit.com") {
      track("affiliate_click", {
        partner: "quickbooks",
        target: url.pathname,
        source: getPagePath()
      });
      return;
    }

    if (url.origin === window.location.origin) {
      const normalizedPath = url.pathname.replace(/\.html$/, "");
      const tool = inferToolFromHref(url.href);

      if (tool) {
        track("tool_cta_click", {
          tool,
          target: normalizedPath,
          source: getPagePath()
        });
      }

      if (normalizedPath === "/hvac-service-paperwork-quick-pack") {
        track("lead_magnet_click", {
          target: normalizedPath,
          source: getPagePath()
        });
      }

      if (normalizedPath === "/hvac-paperwork-starter-kit") {
        track("starter_kit_click", {
          target: normalizedPath,
          source: getPagePath()
        });
      }
    }
  }

  function setupGeneratorTracking() {
    Object.entries(TOOL_FORMS).forEach(([formId, tool]) => {
      const form = document.getElementById(formId);
      if (!form) return;

      let startTracked = false;

      form.addEventListener("submit", () => {
        if (!startTracked) {
          startTracked = true;
          track("tool_start", {
            tool,
            source: getPagePath()
          });
        }
      });

      const resultSection = document.getElementById("generated-result-section");
      if (!resultSection) return;

      let completionTracked = !resultSection.classList.contains("hidden");

      const observer = new MutationObserver(() => {
        const isVisible = !resultSection.classList.contains("hidden");

        if (isVisible && !completionTracked) {
          completionTracked = true;
          track("tool_completion", {
            tool,
            source: getPagePath()
          });
        }
      });

      observer.observe(resultSection, {
        attributes: true,
        attributeFilter: ["class"]
      });
    });
  }

  function setupMailerLiteTracking() {
    document.addEventListener("submit", (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      if (form.closest(".ml-embedded")) {
        track("email_signup_attempt", {
          source: getPagePath()
        });
      }
    }, true);
  }

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a");
    if (anchor) {
      trackLinkClick(anchor);
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupGeneratorTracking();
      setupMailerLiteTracking();
    });
  } else {
    setupGeneratorTracking();
    setupMailerLiteTracking();
  }
})();
