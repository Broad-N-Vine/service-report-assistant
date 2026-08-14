const BUILD_VERSION = "workers-ai-honeypot-cleanup-2026-08-14";
const DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  "X-Content-Type-Options": "nosniff"
};

const SYSTEM_PROMPT = [
  "You are an AI writing assistant for HVAC/R service companies.",
  "",
  "Turn rough technician notes into clean, professional service paperwork.",
  "",
  "Use only the information provided by the user.",
  "Do not invent facts, parts, prices, model numbers, serial numbers, warranties, guarantees, test results, safety claims, code-compliance claims, or final operating conditions.",
  "",
  "Write in plain English.",
  "Keep the tone professional and useful.",
  "",
  "Always flag missing or unclear information instead of guessing.",
  "",
  "Do not mention that you are an AI.",
  "",
  "Return only valid JSON.",
  "Do not include markdown.",
  "Do not include backticks.",
  "Do not include commentary outside the JSON object."
].join("\n");

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: JSON_HEADERS
  });
}

function cleanText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function textFromValue(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .map(function (item) {
        return typeof item === "string" ? item.trim() : "";
      })
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeTone(tone) {
  const cleanedTone = cleanText(tone);
  const allowedTones = ["Professional", "Friendly", "Brief", "Detailed"];

  if (allowedTones.includes(cleanedTone)) {
    return cleanedTone;
  }

  return "Professional";
}

function validateRequestBody(body) {
  if (!body || typeof body !== "object") {
    return {
      valid: false,
      error: "Invalid request. Please submit the generator form again."
    };
  }

  const companyName = cleanText(body.companyName);
  const jobType = cleanText(body.jobType);
  const technicianNotes = cleanText(body.technicianNotes);
  const email = cleanText(body.email);
  const tone = normalizeTone(body.tone);
  const website = cleanText(body.website);

  if (website) {
    return {
      valid: false,
      error: "Unable to process this request. Please refresh the page and try again."
    };
  }

  if (!jobType) {
    return {
      valid: false,
      error: "Please enter a job type before generating your report."
    };
  }

  if (!technicianNotes) {
    return {
      valid: false,
      error: "Please enter technician notes before generating your report."
    };
  }

  if (technicianNotes.length < 25) {
    return {
      valid: false,
      error: "Please add more detail to the technician notes before generating your report."
    };
  }

  if (technicianNotes.length > 4000) {
    return {
      valid: false,
      error: "Please shorten the technician notes before generating your report."
    };
  }

  if (!email || !isValidEmail(email)) {
    return {
      valid: false,
      error: "Please enter a valid email address before generating your report."
    };
  }

  return {
    valid: true,
    data: {
      companyName: companyName,
      jobType: jobType,
      technicianNotes: technicianNotes,
      email: email,
      tone: tone
    }
  };
}

function buildUserPrompt(data) {
  const companyName = data.companyName || "Not provided";

  return [
    "Company name:",
    companyName,
    "",
    "Job type:",
    data.jobType,
    "",
    "Preferred tone:",
    data.tone,
    "",
    "Technician notes:",
    data.technicianNotes,
    "",
    "Create a clean HVAC/R service paperwork package based only on the information provided.",
    "",
    "Return only one valid JSON object with exactly these keys:",
    "",
    "{",
    '  "serviceReport": "Customer-ready service report text.",',
    '  "invoiceDescription": "Invoice wording text.",',
    '  "customerFollowUp": "Customer follow-up message text.",',
    '  "internalSummary": "Internal office summary text.",',
    '  "reviewNotes": [',
    '    "Review note 1.",',
    '    "Review note 2."',
    "  ]",
    "}",
    "",
    "Important: every key must be present. Do not skip any key.",
    "",
    "serviceReport:",
    "Write a clear customer-ready service report. Include what was reported, what was found, what work was completed, and any supported recommendation.",
    "",
    "invoiceDescription:",
    "Write 1 to 3 short invoice lines based only on confirmed work.",
    "",
    "customerFollowUp:",
    "Write a short text-message or email-style follow-up.",
    "",
    "internalSummary:",
    "Write a short internal office summary.",
    "",
    "reviewNotes:",
    "List missing details, unclear items, and human review reminders.",
    "",
    "Rules:",
    "- Do not invent facts.",
    "- Do not invent parts.",
    "- Do not invent prices.",
    "- Do not invent model numbers.",
    "- Do not invent serial numbers.",
    "- Do not invent test readings.",
    "- Do not invent warranty language.",
    "- Do not claim the system is fully fixed unless the notes clearly say that.",
    "- Do not claim the system is safe unless the notes clearly support that.",
    "- Do not guarantee fewer repairs, lower bills, or better comfort.",
    "- If the notes are too vague, explain what information is missing.",
    "- Always include a reminder to review before sending to customer."
  ].join("\n");
}

function extractAiText(aiResponse) {
  if (!aiResponse) {
    return "";
  }

  if (typeof aiResponse.response === "string") {
    return aiResponse.response;
  }

  if (typeof aiResponse.text === "string") {
    return aiResponse.text;
  }

  if (typeof aiResponse.result === "string") {
    return aiResponse.result;
  }

  if (aiResponse.result && typeof aiResponse.result.response === "string") {
    return aiResponse.result.response;
  }

  if (aiResponse.result && typeof aiResponse.result.text === "string") {
    return aiResponse.result.text;
  }

  if (
    Array.isArray(aiResponse.choices) &&
    aiResponse.choices[0] &&
    aiResponse.choices[0].message &&
    typeof aiResponse.choices[0].message.content === "string"
  ) {
    return aiResponse.choices[0].message.content;
  }

  if (
    aiResponse.result &&
    Array.isArray(aiResponse.result.choices) &&
    aiResponse.result.choices[0] &&
    aiResponse.result.choices[0].message &&
    typeof aiResponse.result.choices[0].message.content === "string"
  ) {
    return aiResponse.result.choices[0].message.content;
  }

  return "";
}

function extractJsonObject(text) {
  if (!text) {
    return "";
  }

  let cleaned = text.trim();

  cleaned = cleaned
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return cleaned;
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function normalizeAiResult(result) {
  if (!result || typeof result !== "object") {
    return null;
  }

  const serviceReport = textFromValue(
    result.serviceReport ||
    result.customerReadyServiceReport ||
    result.customer_ready_service_report ||
    result.report ||
    result.service_report
  );

  const invoiceDescription = textFromValue(
    result.invoiceDescription ||
    result.invoice_description ||
    result.invoice ||
    result.invoiceLines ||
    result.invoice_lines
  );

  const customerFollowUp = textFromValue(
    result.customerFollowUp ||
    result.customer_follow_up ||
    result.followUp ||
    result.follow_up ||
    result.customerMessage ||
    result.customer_message
  );

  const internalSummary = textFromValue(
    result.internalSummary ||
    result.internal_summary ||
    result.summary ||
    result.officeSummary ||
    result.office_summary
  );

  let reviewNotes = [];

  if (Array.isArray(result.reviewNotes)) {
    reviewNotes = result.reviewNotes
      .map(function (note) {
        return typeof note === "string" ? note.trim() : "";
      })
      .filter(Boolean);
  } else if (typeof result.reviewNotes === "string") {
    reviewNotes = result.reviewNotes
      .split("\n")
      .map(function (note) {
        return note.replace(/^[-*]\s*/, "").trim();
      })
      .filter(Boolean);
  } else if (Array.isArray(result.missingInformation)) {
    reviewNotes = result.missingInformation
      .map(function (note) {
        return typeof note === "string" ? note.trim() : "";
      })
      .filter(Boolean);
  } else if (typeof result.missingInformation === "string") {
    reviewNotes = [result.missingInformation.trim()];
  }

  const anyMainOutput =
    serviceReport ||
    invoiceDescription ||
    customerFollowUp ||
    internalSummary;

  if (!anyMainOutput) {
    return null;
  }

  const safeServiceReport =
    serviceReport ||
    "The submitted technician notes were received, but the generated service report needs review because the output was incomplete.";

  const safeInvoiceDescription =
    invoiceDescription ||
    "Completed HVAC/R service visit. Confirm specific work performed before finalizing invoice wording.";

  const safeCustomerFollowUp =
    customerFollowUp ||
    "Thank you for having us out today. Please contact our office if you have any additional questions about the service visit.";

  const safeInternalSummary =
    internalSummary ||
    "HVAC/R service visit notes were submitted. Office review is needed before sending customer-facing paperwork.";

  if (reviewNotes.length === 0) {
    reviewNotes.push("Review final wording before sending to the customer.");
  }

  reviewNotes.push("Confirm pricing, parts, readings, warranty language, customer approval, and company-specific details before sending.");

  return {
    serviceReport: safeServiceReport,
    invoiceDescription: safeInvoiceDescription,
    customerFollowUp: safeCustomerFollowUp,
    internalSummary: safeInternalSummary,
    reviewNotes: reviewNotes
  };
}

export async function onRequestGet(context) {
  const hasAiBinding = Boolean(context.env && context.env.AI);

  return jsonResponse({
    success: true,
    status: "ok",
    buildVersion: BUILD_VERSION,
    aiBindingAvailable: hasAiBinding,
    model: DEFAULT_MODEL,
    message: "HVAC Service Report Generator API is available. Use POST to generate a report."
  });
}

export async function onRequestPost(context) {
  try {
    const request = context.request;
    const env = context.env;

    if (!env || !env.AI) {
      return jsonResponse(
        {
          success: false,
          error: "The generator is not fully configured yet. Missing Cloudflare Workers AI binding."
        },
        500
      );
    }

    let body;

    try {
      body = await request.json();
    } catch (error) {
      return jsonResponse(
        {
          success: false,
          error: "Invalid request. Please submit the generator form again."
        },
        400
      );
    }

    const validation = validateRequestBody(body);

    if (!validation.valid) {
      return jsonResponse(
        {
          success: false,
          error: validation.error
        },
        400
      );
    }

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      {
        role: "user",
        content: buildUserPrompt(validation.data)
      }
    ];

    const aiResponse = await env.AI.run(DEFAULT_MODEL, {
      messages: messages,
      max_tokens: 1800,
      temperature: 0.1
    });

    const outputText = extractAiText(aiResponse);

    if (!outputText) {
      return jsonResponse(
        {
          success: false,
          error: "The generator did not return usable output. Please try again."
        },
        502
      );
    }

    let parsedResult;

    try {
      const jsonText = extractJsonObject(outputText);
      parsedResult = JSON.parse(jsonText);
    } catch (error) {
      return jsonResponse(
        {
          success: false,
          error: "The generator returned an unexpected format. Please try again."
        },
        502
      );
    }

    const normalizedResult = normalizeAiResult(parsedResult);

    if (!normalizedResult) {
      return jsonResponse(
        {
          success: false,
          error: "The generator returned incomplete output. Please try again."
        },
        502
      );
    }

    return jsonResponse({
      success: true,
      result: normalizedResult
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: "The generator is temporarily unavailable. Please try again later."
      },
      500
    );
  }
}
