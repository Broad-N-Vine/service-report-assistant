const BUILD_VERSION = "workers-ai-customer-follow-up-generator-2026-08-16";
const DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  "X-Content-Type-Options": "nosniff"
};

const SYSTEM_PROMPT = [
  "You are an AI writing assistant for HVAC/R service companies.",
  "",
  "Your job is to turn rough HVAC/R technician notes into clear, professional customer follow-up messages.",
  "",
  "Use only the information provided by the user.",
  "Do not invent facts, prices, discounts, warranty terms, guarantees, safety claims, code-compliance claims, performance claims, diagnostic readings, model numbers, serial numbers, or final operating conditions.",
  "",
  "Write in plain English.",
  "Keep the wording helpful, professional, and easy for a customer to understand.",
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
      error: "Invalid request. Please submit the follow-up generator form again."
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
      error: "Please enter a job type before generating your follow-up message."
    };
  }

  if (!technicianNotes) {
    return {
      valid: false,
      error: "Please enter technician notes before generating your follow-up message."
    };
  }

  if (technicianNotes.length < 25) {
    return {
      valid: false,
      error: "Please add more detail to the technician notes before generating your follow-up message."
    };
  }

  if (technicianNotes.length > 4000) {
    return {
      valid: false,
      error: "Please shorten the technician notes before generating your follow-up message."
    };
  }

  if (!email || !isValidEmail(email)) {
    return {
      valid: false,
      error: "Please enter a valid email address before generating your follow-up message."
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
    "Create HVAC/R customer follow-up messaging based only on the information provided.",
    "",
    "Return only one valid JSON object with exactly these keys:",
    "",
    "{",
    '  "customerFollowUp": "Customer follow-up message text.",',
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
    "customerFollowUp:",
    "Write a clear customer follow-up message that summarizes the visit and any supported next step.",
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
    "- Do not invent prices.",
    "- Do not invent discounts.",
    "- Do not invent part costs.",
    "- Do not invent model numbers.",
    "- Do not invent serial numbers.",
    "- Do not invent diagnostic readings.",
    "- Do not invent warranty language.",
    "- Do not invent guarantees.",
    "- Do not claim the system is fully fixed unless the notes clearly say that.",
    "- Do not claim the system is safe unless the notes clearly support that.",
    "- Do not guarantee fewer repairs, lower bills, or better comfort.",
    "- Do not pressure the customer with unsupported urgency.",
    "- Do not add recommendations that were not documented in the technician notes.",
    "- If the notes are too vague, explain what information is missing.",
    "- Always include a reminder to review customer details, completed work, pricing, recommendations, warranty language, and safety wording before sending."
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

  const customerFollowUp = textFromValue(
    result.customerFollowUp ||
    result.customer_follow_up ||
    result.followUp ||
    result.follow_up ||
    result.customerMessage ||
    result.customer_message ||
    result.message
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
    customerFollowUp ||
    shortTextMessage ||
    emailVersion;

  if (!anyMainOutput) {
    return null;
  }

  const safeCustomerFollowUp =
    customerFollowUp ||
    "Thank you for having us out today. Please review the service details and contact our office if you have any questions.";

  const safeShortTextMessage =
    shortTextMessage ||
    "Thanks for having us out today. Please contact our office if you have any questions about the service visit.";

  const safeEmailVersion =
    emailVersion ||
    "Hello,\n\nThank you for having us out today. Please review the service details and contact our office if you have any questions.\n\nThank you.";

  if (reviewNotes.length === 0) {
    reviewNotes.push("Review the message before sending it to the customer.");
  }

  reviewNotes.push("Confirm customer details, completed work, pricing, recommendations, warranty language, and safety wording before sending.");

  return {
    customerFollowUp: safeCustomerFollowUp,
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
    message: "HVAC Customer Follow-Up Generator API is available. Use POST to generate follow-up messaging."
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
          error: "The follow-up generator is not fully configured yet. Missing Cloudflare Workers AI binding."
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
          error: "Invalid request. Please submit the follow-up generator form again."
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
          error: "The follow-up generator did not return usable output. Please try again."
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
          error: "The follow-up generator returned an unexpected format. Please try again."
        },
        502
      );
    }

    const normalizedResult = normalizeAiResult(parsedResult);

    if (!normalizedResult) {
      return jsonResponse(
        {
          success: false,
          error: "The follow-up generator returned incomplete output. Please try again."
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
        error: "The follow-up generator is temporarily unavailable. Please try again later."
      },
      500
    );
  }
}
