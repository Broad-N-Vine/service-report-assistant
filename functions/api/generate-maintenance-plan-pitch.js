const BUILD_VERSION = "workers-ai-maintenance-plan-pitch-generator-2026-08-16";
const DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  "X-Content-Type-Options": "nosniff"
};

const SYSTEM_PROMPT = [
  "You are an AI writing assistant for HVAC/R service companies.",
  "",
  "Your job is to turn rough HVAC/R technician notes into clear, professional maintenance plan pitch wording.",
  "",
  "Use only the information provided by the user.",
  "Do not invent facts, prices, discounts, plan details, contract terms, warranty terms, guarantees, savings claims, safety claims, code-compliance claims, diagnostic readings, model numbers, serial numbers, or final operating conditions.",
  "",
  "Write in plain English.",
  "Keep the wording helpful, professional, and low-pressure.",
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
      error: "Invalid request. Please submit the maintenance plan pitch generator form again."
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
      error: "Please enter a job type before generating your maintenance plan pitch."
    };
  }

  if (!technicianNotes) {
    return {
      valid: false,
      error: "Please enter technician notes before generating your maintenance plan pitch."
    };
  }

  if (technicianNotes.length < 25) {
    return {
      valid: false,
      error: "Please add more detail to the technician notes before generating your maintenance plan pitch."
    };
  }

  if (technicianNotes.length > 4000) {
    return {
      valid: false,
      error: "Please shorten the technician notes before generating your maintenance plan pitch."
    };
  }

  if (!email || !isValidEmail(email)) {
    return {
      valid: false,
      error: "Please enter a valid email address before generating your maintenance plan pitch."
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
    "Create HVAC/R maintenance plan pitch wording based only on the information provided.",
    "",
    "Return only one valid JSON object with exactly these keys:",
    "",
    "{",
    '  "maintenancePlanPitch": "Customer-ready maintenance plan pitch text.",',
    '  "shortTextMessage": "Short text message version.",',
    '  "emailVersion": "Customer email version.",',
    '  "reviewNotes": [',
    '    "Review note 1.",',
    '    "Review note 2."',
    "  ]",
    "}",
    "",
    "Important: every key must be present. Do not skip any key.",
    "",
    "maintenancePlanPitch:",
    "Write a clear, helpful, low-pressure maintenance plan pitch that connects the customer's situation to the value of routine maintenance without overpromising.",
    "",
    "shortTextMessage:",
    "Write a brief SMS-style version. Keep it short and useful.",
    "",
    "emailVersion:",
    "Write a slightly longer email-style version with a simple greeting and closing.",
    "",
    "reviewNotes:",
    "List missing details, unclear items, and human review reminders.",
    "",
    "Rules:",
    "- Do not invent plan prices.",
    "- Do not invent discounts.",
    "- Do not invent contract terms.",
    "- Do not invent membership benefits.",
    "- Do not invent warranty language.",
    "- Do not invent guarantees.",
    "- Do not invent diagnostic readings.",
    "- Do not invent model numbers.",
    "- Do not invent serial numbers.",
    "- Do not claim maintenance will prevent all breakdowns.",
    "- Do not guarantee lower utility bills.",
    "- Do not guarantee longer equipment life.",
    "- Do not claim the system is safe unless the notes clearly support that.",
    "- Do not pressure the customer with unsupported urgency.",
    "- Do not add recommendations that were not documented in the technician notes.",
    "- If the notes are too vague, explain what information is missing.",
    "- Always include a reminder to confirm plan details, pricing, terms, benefits, warranty language, customer approval, and company-specific maintenance agreement rules before sending."
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

  const maintenancePlanPitch = textFromValue(
    result.maintenancePlanPitch ||
    result.maintenance_plan_pitch ||
    result.planPitch ||
    result.plan_pitch ||
    result.pitch ||
    result.customerPitch ||
    result.customer_pitch ||
    result.maintenancePitch ||
    result.maintenance_pitch
  );

  const shortTextMessage = textFromValue(
    result.shortTextMessage ||
    result.short_text_message ||
    result.textMessage ||
    result.text_message ||
    result.sms ||
    result.smsMessage ||
    result.sms_message
  );

  const emailVersion = textFromValue(
    result.emailVersion ||
    result.email_version ||
    result.email ||
    result.emailMessage ||
    result.email_message ||
    result.customerEmail ||
    result.customer_email
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
    maintenancePlanPitch ||
    shortTextMessage ||
    emailVersion;

  if (!anyMainOutput) {
    return null;
  }

  const safeMaintenancePlanPitch =
    maintenancePlanPitch ||
    "Routine maintenance may help keep the system easier to monitor over time. Please confirm your company's maintenance plan details, pricing, and terms before sharing this message with the customer.";

  const safeShortTextMessage =
    shortTextMessage ||
    "Thanks for having us out today. Ask our office about routine maintenance options if you would like help keeping the system on a regular service schedule.";

  const safeEmailVersion =
    emailVersion ||
    "Hello,\n\nThank you for having us out today. Routine maintenance may be a helpful option if you would like to keep the system on a regular service schedule. Please contact our office if you would like to review available maintenance options.\n\nThank you.";

  if (reviewNotes.length === 0) {
    reviewNotes.push("Review the maintenance plan pitch before sending it to the customer.");
  }

  reviewNotes.push("Confirm plan details, pricing, terms, benefits, warranty language, customer approval, and company-specific maintenance agreement rules before sending.");

  return {
    maintenancePlanPitch: safeMaintenancePlanPitch,
    shortTextMessage: safeShortTextMessage,
    emailVersion: safeEmailVersion,
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
    message: "HVAC Maintenance Plan Pitch Generator API is available. Use POST to generate maintenance plan pitch wording."
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
          error: "The maintenance plan pitch generator is not fully configured yet. Missing Cloudflare Workers AI binding."
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
          error: "Invalid request. Please submit the maintenance plan pitch generator form again."
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
          error: "The maintenance plan pitch generator did not return usable output. Please try again."
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
          error: "The maintenance plan pitch generator returned an unexpected format. Please try again."
        },
        502
      );
    }

    const normalizedResult = normalizeAiResult(parsedResult);

    if (!normalizedResult) {
      return jsonResponse(
        {
          success: false,
          error: "The maintenance plan pitch generator returned incomplete output. Please try again."
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
        error: "The maintenance plan pitch generator is temporarily unavailable. Please try again later."
      },
      500
    );
  }
}
