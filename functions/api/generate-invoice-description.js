const BUILD_VERSION = "workers-ai-invoice-generator-2026-08-15";
const DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  "X-Content-Type-Options": "nosniff"
};

const SYSTEM_PROMPT = [
  "You are an AI writing assistant for HVAC/R service companies.",
  "",
  "Your job is to turn rough HVAC/R technician notes into clean, professional invoice wording.",
  "",
  "Use only the information provided by the user.",
  "Do not invent facts, prices, labor rates, taxes, discounts, parts, model numbers, serial numbers, warranties, guarantees, diagnostic readings, safety claims, or final operating conditions.",
  "",
  "Write in plain English.",
  "Keep the wording professional, concise, and useful for HVAC/R owners, office managers, technicians, and customers.",
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
      error: "Invalid request. Please submit the invoice generator form again."
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
      error: "Please enter a job type before generating your invoice wording."
    };
  }

  if (!technicianNotes) {
    return {
      valid: false,
      error: "Please enter technician notes before generating your invoice wording."
    };
  }

  if (technicianNotes.length < 25) {
    return {
      valid: false,
      error: "Please add more detail to the technician notes before generating your invoice wording."
    };
  }

  if (technicianNotes.length > 4000) {
    return {
      valid: false,
      error: "Please shorten the technician notes before generating your invoice wording."
    };
  }

  if (!email || !isValidEmail(email)) {
    return {
      valid: false,
      error: "Please enter a valid email address before generating your invoice wording."
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
    "Create clean HVAC/R invoice wording based only on the information provided.",
    "",
    "Return only one valid JSON object with exactly these keys:",
    "",
    "{",
    '  "invoiceDescription": "Professional invoice description text.",',
    '  "shortInvoiceLine": "Short invoice line text.",',
    '  "detailedInvoiceDescription": "More detailed invoice description text.",',
    '  "reviewNotes": [',
    '    "Review note 1.",',
    '    "Review note 2."',
    "  ]",
    "}",
    "",
    "Important: every key must be present. Do not skip any key.",
    "",
    "invoiceDescription:",
    "Write a clean invoice description that explains the confirmed work performed. Keep it professional and customer-ready.",
    "",
    "shortInvoiceLine:",
    "Write one short invoice line that could fit inside invoice software.",
    "",
    "detailedInvoiceDescription:",
    "Write a slightly more detailed invoice description that gives the customer useful context without overexplaining.",
    "",
    "reviewNotes:",
    "List missing details, unclear items, and human review reminders.",
    "",
    "Rules:",
    "- Do not invent prices.",
    "- Do not invent labor rates.",
    "- Do not invent taxes.",
    "- Do not invent discounts.",
    "- Do not invent part costs.",
    "- Do not invent parts.",
    "- Do not invent model numbers.",
    "- Do not invent serial numbers.",
    "- Do not invent diagnostic readings.",
    "- Do not invent warranty language.",
    "- Do not claim the system is fully fixed unless the notes clearly say that.",
    "- Do not claim the system is safe unless the notes clearly support that.",
    "- Do not guarantee fewer repairs, lower bills, or better comfort.",
    "- Do not add work that was not documented in the technician notes.",
    "- If the notes are too vague, explain what information is missing.",
    "- Always include a reminder to confirm pricing, parts, labor, taxes, discounts, warranty language, customer approval, and company-specific invoice rules before sending."
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

  const invoiceDescription = textFromValue(
    result.invoiceDescription ||
    result.invoice_description ||
    result.invoice ||
    result.description ||
    result.invoiceWording ||
    result.invoice_wording
  );

  const shortInvoiceLine = textFromValue(
    result.shortInvoiceLine ||
    result.short_invoice_line ||
    result.shortLine ||
    result.short_line ||
    result.invoiceLine ||
    result.invoice_line
  );

  const detailedInvoiceDescription = textFromValue(
    result.detailedInvoiceDescription ||
    result.detailed_invoice_description ||
    result.detailedDescription ||
    result.detailed_description ||
    result.longInvoiceDescription ||
    result.long_invoice_description
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
  } else if (Array.isArray(result.officeReviewNotes)) {
    reviewNotes = result.officeReviewNotes
      .map(function (note) {
        return typeof note === "string" ? note.trim() : "";
      })
      .filter(Boolean);
  } else if (typeof result.officeReviewNotes === "string") {
    reviewNotes = [result.officeReviewNotes.trim()];
  }

  const anyMainOutput =
    invoiceDescription ||
    shortInvoiceLine ||
    detailedInvoiceDescription;

  if (!anyMainOutput) {
    return null;
  }

  const safeInvoiceDescription =
    invoiceDescription ||
    "Completed HVAC/R service visit. Confirm specific work performed before finalizing invoice wording.";

  const safeShortInvoiceLine =
    shortInvoiceLine ||
    "Completed HVAC/R service visit; confirm final invoice details before sending.";

  const safeDetailedInvoiceDescription =
    detailedInvoiceDescription ||
    "Completed documented HVAC/R service visit. Office review is needed to confirm the specific work performed, pricing, parts, labor, taxes, discounts, and warranty language before sending the invoice.";

  if (reviewNotes.length === 0) {
    reviewNotes.push("Review final invoice wording before sending to the customer.");
  }

  reviewNotes.push("Confirm pricing, parts, labor, taxes, discounts, warranty language, customer approval, and company-specific invoice rules before sending.");

  return {
    invoiceDescription: safeInvoiceDescription,
    shortInvoiceLine: safeShortInvoiceLine,
    detailedInvoiceDescription: safeDetailedInvoiceDescription,
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
    message: "HVAC Invoice Description Generator API is available. Use POST to generate invoice wording."
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
          error: "The invoice generator is not fully configured yet. Missing Cloudflare Workers AI binding."
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
          error: "Invalid request. Please submit the invoice generator form again."
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
      max_tokens: 1200,
      temperature: 0.1
    });

    const outputText = extractAiText(aiResponse);

    if (!outputText) {
      return jsonResponse(
        {
          success: false,
          error: "The invoice generator did not return usable output. Please try again."
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
          error: "The invoice generator returned an unexpected format. Please try again."
        },
        502
      );
    }

    const normalizedResult = normalizeAiResult(parsedResult);

    if (!normalizedResult) {
      return jsonResponse(
        {
          success: false,
          error: "The invoice generator returned incomplete output. Please try again."
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
        error: "The invoice generator is temporarily unavailable. Please try again later."
      },
      500
    );
  }
}
