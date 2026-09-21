import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sourcePath = new URL("../functions/api/generate-service-report.js", import.meta.url);
const source = await readFile(sourcePath, "utf8");
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const { onRequestGet, onRequestPost } = await import(moduleUrl);

const baseResult = {
  serviceReport: "Customer reported an AC issue. The technician replaced the capacitor.",
  invoiceDescription: "Replaced capacitor.",
  customerFollowUp: "Thank you for choosing us. Please contact us with any questions.",
  internalSummary: "AC repair completed. Capacitor replaced.",
  reviewNotes: ["Review the final wording before sending it to the customer."]
};

async function runGenerator(aiResult, onRun) {
  const request = new Request("https://example.com/api/generate-service-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyName: "Smith Heating & Cooling",
      jobType: "AC repair",
      technicianNotes: "Customer reported AC running but not cooling. Replaced weak capacitor after diagnosis.",
      tone: "Professional",
      email: "test@example.com",
      website: ""
    })
  });

  const response = await onRequestPost({
    request,
    env: {
      AI: {
        run: async (model, options) => {
          if (onRun) {
            onRun(model, options);
          }

          return { response: JSON.stringify(aiResult) };
        }
      }
    }
  });

  assert.equal(response.status, 200);
  return response.json();
}

test("reports do not reserve space for an unsupported date", async () => {
  const payload = await runGenerator({
    ...baseResult,
    serviceReport: [
      "Service Report for Smith Heating & Cooling",
      "",
      "On [date], a service call was made to address an issue with the customer's air conditioning system.",
      "",
      "Service performed: Replaced capacitor."
    ].join("\n")
  });

  assert.equal(payload.success, true);
  assert.equal(
    payload.result.serviceReport,
    [
      "Service Report for Smith Heating & Cooling",
      "",
      "A service call was made to address an issue with the customer's air conditioning system.",
      "",
      "Service performed: Replaced capacitor."
    ].join("\n")
  );
  assert.doesNotMatch(payload.result.serviceReport, /\[date\]|\bOn\s*,/i);
});

test("review notes are split, punctuated, and deduplicated", async () => {
  const payload = await runGenerator({
    ...baseResult,
    reviewNotes: [
      "Missing date of service call.,Missing model number and serial number of the air conditioning system.",
      "Missing cost of replacement capacitor.,Missing details on the condition of the system before and after repair.",
      "Review before sending to the customer to ensure accuracy and completeness.,Confirm pricing, parts, readings, warranty language, customer approval, and company-specific details before sending.",
      "Confirm pricing, parts, readings, warranty language, customer approval, and company-specific details before sending."
    ]
  });

  assert.deepEqual(payload.result.reviewNotes, [
    "Missing date of service call.",
    "Missing model number and serial number of the air conditioning system.",
    "Missing cost of replacement capacitor.",
    "Missing details on the condition of the system before and after repair.",
    "Review before sending to the customer to ensure accuracy and completeness.",
    "Confirm pricing, parts, readings, warranty language, customer approval, and company-specific details before sending."
  ]);

  payload.result.reviewNotes.forEach((note) => {
    assert.match(note, /[.!?]$/);
    assert.doesNotMatch(note, /\.,|,,|\.\S/);
  });
});

test("real service dates remain and the prompt separates work from recommendations", async () => {
  let userPrompt = "";
  const payload = await runGenerator(
    {
      ...baseResult,
      serviceReport: "On September 20, 2026, the technician replaced the capacitor."
    },
    (_model, options) => {
      userPrompt = options.messages.find((message) => message.role === "user").content;
    }
  );

  assert.equal(
    payload.result.serviceReport,
    "On September 20, 2026, the technician replaced the capacitor."
  );
  assert.match(userPrompt, /A recommendation is not completed work\./);
  assert.match(userPrompt, /only the capacitor replacement was completed\./);
  assert.match(userPrompt, /Do not add a report title or company heading\./);
});

test("the health response identifies the continuity-cleanup build", async () => {
  const response = await onRequestGet({ env: { AI: {} } });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.buildVersion, "service-report-continuity-cleanup-2026-09-21");
});
