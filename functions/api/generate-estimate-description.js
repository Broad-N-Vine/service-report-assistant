const BUILD_VERSION = "workers-ai-estimate-description-generator-2026-08-16";
const DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  "X-Content-Type-Options": "nosniff"
};

const SYSTEM_PROMPT = [
  "You are an AI writing assistant for HVAC/R service companies.",
  "",
  "Your job is to turn rough HVAC/R technician notes into clear, professional estimate description wording.",
  "",
  "Use only the information provided by the user.",
  "Do not invent facts, prices, labor rates, taxes, discounts, parts, model numbers, serial numbers, warranty terms, guarantees, diagnostic readings, safety claims, code-compliance claims, project scope, or final operating conditions.",
  "",
  "Write in plain English.",
  "Keep the wording professional, clear, and useful for HVAC/R owners, office managers, technicians, and customers.",
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
      error: "Invalid request. Please submit the estimate description generator form again."
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
      error: "Please enter a job type before generating your estimate description."
    };
  }

  if (!technicianNotes) {
    return {
      valid: false,
      error: "Please enter technician notes before generating your estimate description."
    };
  }

  if (technicianNotes.length < 25) {
    return {
      valid: false,
      error: "Please add more detail to the technician notes before generating your estimate description."
    };
  }

  if (technicianNotes.length > 4000) {
    return {
      valid: false,
      error: "Please shorten the technician notes before generating your estimate description."
    };
  }

  if (!email || !isValidEmail(email)) {
    return {
      valid: false,
      error: "Please enter a valid email address before generating your estimate description."
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
    "Create HVAC/R estimate description wording based only on the information provided.",
    "",
    "Return one valid JSON object only.",
    "",
    "The JSON object must use exactly these keys:",
    "",
    "{",
    '  "estimateDescription": "Customer-ready estimate description text.",',
    '  "shortEstimateLine": "Short estimate line text.",',
    '  "customerExplanation": "Customer explanation text.",',
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
    "",
    "estimateDescription:",
    "Write a clear customer-ready estimate description that explains the recommended work based only on the notes.",
    "",
    "shortEstimateLine:",
    "Write one short estimate line that could fit inside estimate software.",
    "",
    "customerExplanation:",
    "Write a slightly more detailed customer-friendly explanation of why the recommended work may be needed, without overpromising.",
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
    "- Do not invent project scope beyond the technician notes.",
    "- Do not claim the system is fully fixed unless the notes clearly say that.",
    "- Do not claim the system is safe unless the notes clearly support that.",
    "- Do not guarantee fewer repairs, lower bills, better comfort, or longer equipment life.",
    "- Do not pressure the customer with unsupported urgency.",
    "- Do not add recommendations that were not documented in the technician notes.",
    "- If the notes are too vague, explain what information is missing.",
    "- Always include a reminder to confirm scope, pricing, parts, labor, taxes, discounts, warranty language, customer approval, and company-specific estimate rules before sending."
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
        return typeof note === "string" ? note.trim() : "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
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

  const estimateDescription = textFromValue(
    result.estimateDescription ||
    result.estimate_description ||
    result.description ||
    result.estimate ||
    result.proposalDescription ||
    result.proposal_description ||
    result.recommendedWork ||
    result.recommended_work
  );

  const shortEstimateLine = textFromValue(
    result.shortEstimateLine ||
    result.short_estimate_line ||
    result.shortLine ||
    result.short_line ||
    result.estimateLine ||
    result.estimate_line ||
    result.proposalLine ||
    result.proposal_line
  );

  const customerExplanation = textFromValue(
    result.customerExplanation ||
    result.customer_explanation ||
    result.explanation ||
    result.customerMessage ||
    result.customer_message ||
    result.customerFriendlyExplanation ||
    result.customer_friendly_explanation
  );

  let reviewNotes = [];

  reviewNotes = reviewNotes.concat(splitReviewNotes(result.reviewNotes));
  reviewNotes = reviewNotes.concat(splitReviewNotes(result.missingInformation));
  reviewNotes = reviewNotes.concat(splitReviewNotes(result.missing_information));
  reviewNotes = reviewNotes.concat(splitReviewNotes(result.notes));
  reviewNotes = reviewNotes.concat(splitReviewNotes(result.officeReviewNotes));
  reviewNotes = reviewNotes.concat(splitReviewNotes(result.office_review_notes));

  const anyMainOutput =
    estimateDescription ||
    shortEstimateLine ||
    customerExplanation;

  if (!anyMainOutput) {
    return null;
  }

  const safeEstimateDescription =
    estimateDescription ||
    "Recommended HVAC/R work based on the documented technician notes. Confirm the final scope, pricing, parts, labor, taxes, discounts, and warranty language before sending this estimate to the customer.";

  const safeShortEstimateLine =
    shortEstimateLine ||
    "Recommended HVAC/R work; confirm final scope and estimate details before sending.";

  const safeCustomerExplanation =
    customerExplanation ||
    "Based on the documented service notes, additional HVAC/R work may be recommended. Please review the final estimate details, pricing, scope, and terms with the office before approving work.";

  if (reviewNotes.length === 0) {
    reviewNotes.push("Review the estimate description before sending it to the customer.");
  }

  reviewNotes.push("Confirm scope, pricing, parts, labor, taxes, discounts, warranty language, customer approval, and company-specific estimate rules before sending.");

  return {
    estimateDescription: safeEstimateDescription,
    shortEstimateLine: safeShortEstimateLine,
    customerExplanation: safeCustomerExplanation,
    reviewNotes: reviewNotes
  };
}

function buildFallbackResultFromRawText(outputText) {
  const cleanedOutput = cleanText(outputText);

  if (!cleanedOutput) {
    return null;
  }

  return {
    estimateDescription: cleanedOutput,
    shortEstimateLine: "Recommended HVAC/R work; confirm final scope and estimate details before sending.",
    customerExplanation: "Based on the documented service notes, additional HVAC/R work may be recommended. Please review the final estimate details, pricing, scope, and terms with the office before approving work.",
    reviewNotes: [
      "The generator returned usable wording but not the expected structured format, so review this result carefully.",
      "Confirm scope, pricing, parts, labor, taxes, discounts, warranty language, customer approval, and company-specific estimate rules before sending."
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
    message: "HVAC Estimate Description Generator API is available. Use POST to generate estimate wording."
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
          error: "The estimate description generator is not fully configured yet. Missing Cloudflare Workers AI binding."
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
          error: "Invalid request. Please submit the estimate description generator form again."
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
          error: "The estimate description generator did not return usable output. Please try again."
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
        error: "The estimate description generator returned incomplete output. Please try again."
      },
      502
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: "The estimate description generator is temporarily unavailable. Please try again later."
      },
      500
    );
  }
}
