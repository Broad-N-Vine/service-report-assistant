const BUILD_VERSION = "workers-ai-commercial-refrigeration-placeholder-cleanup-2026-08-16";
const DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  "X-Content-Type-Options": "nosniff"
};

const SYSTEM_PROMPT = [
  "You are an AI writing assistant for HVAC/R and commercial refrigeration service companies.",
  "",
  "Your job is to turn rough commercial refrigeration technician notes into clean, professional service paperwork.",
  "",
  "Use only the information provided by the user.",
  "Do not invent facts, prices, labor rates, taxes, discounts, parts, refrigerant amounts, temperatures, pressures, model numbers, serial numbers, warranty terms, guarantees, diagnostic readings, food safety claims, code-compliance claims, safety claims, or final operating conditions.",
  "Do not use placeholders such as [date], [customer name], [company name], [technician name], [equipment], TBD, or N/A in customer-facing output.",
  "",
  "Write in plain English.",
  "Keep the wording professional, clear, and useful for refrigeration owners, office managers, technicians, and customers.",
  "",
  "Always flag missing or unclear information instead of guessing.",
  "",
  "Do not mention that you are an AI.",
  "",
  "Return only valid JSON.",
  "The response must start with { and end with }.",
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

function removePlaceholderArtifacts(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/^On\s+\[date\],\s*/i, "")
    .replace(/^On\s+the\s+date,\s*/i, "")
    .replace(/^On\s+N\/A,\s*/i, "")
    .replace(/^On\s+TBD,\s*/i, "")
    .replace(/\[date\]/gi, "the service visit")
    .replace(/\[service date\]/gi, "the service visit")
    .replace(/\[customer name\]/gi, "the customer")
    .replace(/\[company name\]/gi, "the company")
    .replace(/\[technician name\]/gi, "the technician")
    .replace(/\[equipment\]/gi, "the equipment")
    .replace(/\bTBD\b/g, "to be confirmed")
    .replace(/\bN\/A\b/g, "to be confirmed")
    .replace(/\s+([,.])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function textFromValue(value) {
  if (typeof value === "string") {
    return removePlaceholderArtifacts(value);
  }

  if (Array.isArray(value)) {
    return value
      .map(function (item) {
        return typeof item === "string" ? removePlaceholderArtifacts(item) : "";
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
  const allowedTones = ["Professional", "Friendly", "Brief", "Detailed", "Simple"];

  if (allowedTones.includes(cleanedTone)) {
    return cleanedTone;
  }

  return "Professional";
}

function validateRequestBody(body) {
  if (!body || typeof body !== "object") {
    return {
      valid: false,
      error: "Invalid request. Please submit the commercial refrigeration report generator form again."
    };
  }

  const companyName = cleanText(body.companyName);
  const jobType = cleanText(body.jobType);
  const equipmentType = cleanText(body.equipmentType);
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
      error: "Please enter a job type before generating your refrigeration service report."
    };
  }

  if (!technicianNotes) {
    return {
      valid: false,
      error: "Please enter technician notes before generating your refrigeration service report."
    };
  }

  if (technicianNotes.length < 25) {
    return {
      valid: false,
      error: "Please add more detail to the technician notes before generating your refrigeration service report."
    };
  }

  if (technicianNotes.length > 4000) {
    return {
      valid: false,
      error: "Please shorten the technician notes before generating your refrigeration service report."
    };
  }

  if (!email || !isValidEmail(email)) {
    return {
      valid: false,
      error: "Please enter a valid email address before generating your refrigeration service report."
    };
  }

  return {
    valid: true,
    data: {
      companyName: companyName,
      jobType: jobType,
      equipmentType: equipmentType,
      technicianNotes: technicianNotes,
      email: email,
      tone: tone
    }
  };
}

function buildUserPrompt(data) {
  const companyName = data.companyName || "Not provided";
  const equipmentType = data.equipmentType || "Not provided";

  return [
    "Company name:",
    companyName,
    "",
    "Job type:",
    data.jobType,
    "",
    "Equipment type:",
    equipmentType,
    "",
    "Preferred tone:",
    data.tone,
    "",
    "Technician notes:",
    data.technicianNotes,
    "",
    "Create a clean commercial refrigeration service paperwork package based only on the information provided.",
    "",
    "Return one valid JSON object only.",
    "",
    "The JSON object must use exactly these keys:",
    "",
    "{",
    '  "serviceReport": "Customer-ready commercial refrigeration service report text.",',
    '  "invoiceDescription": "Invoice wording text.",',
    '  "customerFollowUp": "Customer follow-up message text.",',
    '  "internalSummary": "Internal office summary text.",',
    '  "reviewNotes": [',
    '    "Review note 1.",',
    '    "Review note 2."',
    "  ]",
    "}",
    "",
    "Important:",
    "- Every key must be present.",
    "- The response must start with { and end with }.",
    "- Do not include markdown.",
    "- Do not include a title.",
    "- Do not include commentary outside the JSON.",
    "- Do not use placeholders like [date]. If a date was not provided, omit the date or say 'During the service visit.'",
    "- Do not use placeholders like [customer name], [company name], [technician name], [equipment], TBD, or N/A.",
    "",
    "serviceReport:",
    "Write a clear customer-ready commercial refrigeration service report. Include what was reported, what was found, what work was completed, and any supported recommendation.",
    "",
    "invoiceDescription:",
    "Write 1 to 3 short invoice lines based only on confirmed work.",
    "",
    "customerFollowUp:",
    "Write a short text-message or email-style follow-up.",
    "",
    "internalSummary:",
    "Write a short internal office summary for office records.",
    "",
    "reviewNotes:",
    "List missing details, unclear items, and human review reminders.",
    "",
    "Commercial refrigeration safety rules:",
    "- Do not invent box temperatures.",
    "- Do not invent product temperatures.",
    "- Do not invent pressure readings.",
    "- Do not invent refrigerant amounts.",
    "- Do not invent leak findings.",
    "- Do not invent electrical readings.",
    "- Do not invent model numbers.",
    "- Do not invent serial numbers.",
    "- Do not make food safety guarantees.",
    "- Do not say product is safe.",
    "- Do not say the cooler or freezer is fully fixed unless the notes clearly support that.",
    "- Do not guarantee future temperature performance.",
    "- Do not claim code compliance unless the notes clearly support that.",
    "",
    "General rules:",
    "- Do not invent facts.",
    "- Do not invent parts.",
    "- Do not invent prices.",
    "- Do not invent warranty language.",
    "- Do not invent customer approval.",
    "- Do not add recommendations that were not documented in the technician notes.",
    "- If the notes are too vague, explain what information is missing.",
    "- Always include a reminder to confirm temperatures, pressures, refrigerant details, parts, pricing, warranty language, customer approval, food safety wording, and final operating conditions before sending."
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
    return "";
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function tryParseJson(text) {
  const jsonText = extractJsonObject(text);

  if (!jsonText) {
    return null;
  }

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    return null;
  }
}

function splitReviewNotes(value) {
  if (Array.isArray(value)) {
    return value
      .map(function (note) {
        return typeof note === "string" ? removePlaceholderArtifacts(note) : "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return removePlaceholderArtifacts(value)
      .split("\n")
      .map(function (note) {
        return note.replace(/^[-*]\s*/, "").trim();
      })
      .filter(Boolean);
  }

  return [];
}

function normalizeAiResult(result) {
  if (!result || typeof result !== "object") {
    return null;
  }

  const serviceReport = textFromValue(
    result.serviceReport ||
    result.service_report ||
    result.customerReadyServiceReport ||
    result.customer_ready_service_report ||
    result.report ||
    result.refrigerationReport ||
    result.refrigeration_report
  );

  const invoiceDescription = textFromValue(
    result.invoiceDescription ||
    result.invoice_description ||
    result.invoice ||
    result.invoiceLines ||
    result.invoice_lines ||
    result.invoiceWording ||
    result.invoice_wording
  );

  const customerFollowUp = textFromValue(
    result.customerFollowUp ||
    result.customer_follow_up ||
    result.followUp ||
    result.follow_up ||
    result.customerMessage ||
    result.customer_message ||
    result.message
  );

  const internalSummary = textFromValue(
    result.internalSummary ||
    result.internal_summary ||
    result.summary ||
    result.officeSummary ||
    result.office_summary ||
    result.internalNotes ||
    result.internal_notes
  );

  let reviewNotes = [];

  reviewNotes = reviewNotes.concat(splitReviewNotes(result.reviewNotes));
  reviewNotes = reviewNotes.concat(splitReviewNotes(result.missingInformation));
  reviewNotes = reviewNotes.concat(splitReviewNotes(result.missing_information));
  reviewNotes = reviewNotes.concat(splitReviewNotes(result.notes));
  reviewNotes = reviewNotes.concat(splitReviewNotes(result.officeReviewNotes));
  reviewNotes = reviewNotes.concat(splitReviewNotes(result.office_review_notes));

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
    "The submitted refrigeration technician notes were received, but the generated service report needs review because the output was incomplete.";

  const safeInvoiceDescription =
    invoiceDescription ||
    "Completed commercial refrigeration service visit. Confirm specific work performed before finalizing invoice wording.";

  const safeCustomerFollowUp =
    customerFollowUp ||
    "Thank you for having us out today. Please monitor the equipment as advised and contact our office if you have any questions about the service visit.";

  const safeInternalSummary =
    internalSummary ||
    "Commercial refrigeration service visit notes were submitted. Office review is needed before sending customer-facing paperwork.";

  if (reviewNotes.length === 0) {
    reviewNotes.push("Review final refrigeration wording before sending to the customer.");
  }

  reviewNotes.push("Confirm temperatures, pressures, refrigerant details, parts, pricing, warranty language, customer approval, food safety wording, and final operating conditions before sending.");

  return {
    serviceReport: safeServiceReport,
    invoiceDescription: safeInvoiceDescription,
    customerFollowUp: safeCustomerFollowUp,
    internalSummary: safeInternalSummary,
    reviewNotes: reviewNotes
  };
}

function buildFallbackResultFromRawText(outputText) {
  const cleanedOutput = removePlaceholderArtifacts(outputText);

  if (!cleanedOutput) {
    return null;
  }

  return {
    serviceReport: cleanedOutput,
    invoiceDescription: "Completed commercial refrigeration service visit. Confirm specific work performed before finalizing invoice wording.",
    customerFollowUp: "Thank you for having us out today. Please monitor the equipment as advised and contact our office if you have any questions about the service visit.",
    internalSummary: "Commercial refrigeration service visit notes were submitted. Office review is needed before sending customer-facing paperwork.",
    reviewNotes: [
      "The generator returned usable wording but not the expected structured format, so review this result carefully.",
      "Confirm temperatures, pressures, refrigerant details, parts, pricing, warranty language, customer approval, food safety wording, and final operating conditions before sending."
    ]
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
    message: "Commercial Refrigeration Service Report Generator API is available. Use POST to generate refrigeration service paperwork."
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
          error: "The commercial refrigeration report generator is not fully configured yet. Missing Cloudflare Workers AI binding."
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
          error: "Invalid request. Please submit the commercial refrigeration report generator form again."
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
      max_tokens: 1600,
      temperature: 0.1
    });

    const outputText = extractAiText(aiResponse);

    if (!outputText) {
      return jsonResponse(
        {
          success: false,
          error: "The commercial refrigeration report generator did not return usable output. Please try again."
        },
        502
      );
    }

    const parsedResult = tryParseJson(outputText);

    if (parsedResult) {
      const normalizedResult = normalizeAiResult(parsedResult);

      if (normalizedResult) {
        return jsonResponse({
          success: true,
          result: normalizedResult
        });
      }
    }

    const fallbackResult = buildFallbackResultFromRawText(outputText);

    if (fallbackResult) {
      return jsonResponse({
        success: true,
        result: fallbackResult
      });
    }

    return jsonResponse(
      {
        success: false,
        error: "The commercial refrigeration report generator returned incomplete output. Please try again."
      },
      502
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: "The commercial refrigeration report generator is temporarily unavailable. Please try again later."
      },
      500
    );
  }
}
