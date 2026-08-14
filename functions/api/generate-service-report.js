const BUILD_VERSION = "workers-ai-fast-model-2026-08-14";
const DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  "X-Content-Type-Options": "nosniff"
};

const SYSTEM_PROMPT = `
You are an AI writing assistant for HVAC/R service companies.

Your job is to turn rough technician notes into clean, professional service paperwork.

Use only the information provided by the user. Do not invent facts, parts, prices, model numbers, serial numbers, warranties, guarantees, test results, safety claims, code-compliance claims, or final operating conditions.

Write in plain English. Keep the tone professional and useful for HVAC/R business owners, office managers, technicians, and customers.

Always flag missing or unclear information instead of guessing.

Do not mention that you are an AI.

Return only valid JSON. Do not include markdown. Do not include backticks. Do not include commentary outside the JSON object.
`;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS
  });
}

function cleanText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
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
  const companyName = cleanText(body.companyName);
  const jobType = cleanText(body.jobType);
  const technicianNotes = cleanText(body.technicianNotes);
  const email = cleanText(body.email);
  const tone = normalizeTone(body.tone);

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
      companyName,
      jobType,
      technicianNotes,
      email,
      tone
    }
  };
}

function buildUserPrompt(data) {
  const companyName = data.companyName || "Not provided";

  return `
Company name:
${companyName}

Job type:
${data.jobType}

Preferred tone:
${data.tone}

Technician notes:
${data.technicianNotes}

Create a clean HVAC/R service paperwork package based only on the information provided.

Return only a JSON object with exactly this shape:

{
  "serviceReport": "Plain-English customer-ready service report.",
  "invoiceDescription": "Short invoice wording based only on confirmed work.",
  "customerFollowUp": "Short customer follow-up message.",
  "internalSummary": "Short internal office summary.",
  "reviewNotes": [
    "Missing information, unclear item, or human review reminder."
  ]
}

Section requirements:

1. serviceReport
Write a clear, plain-English service report for the customer. Explain what was reported, what was found, what work was completed, and any recommendation that is directly supported by the technician notes.

2. invoiceDescription
Write 1 to 3 short invoice lines that describe the confirmed work performed. Make the wording professional and easy to paste into invoice software.

3. customerFollowUp
Write a short text-message or email-style follow-up. Thank the customer, summarize the visit, and mention any next step only if the technician notes support it.

4. internalSummary
Write a short internal summary for office records. This can be more direct than the customer-facing report.

5. reviewNotes
List important missing details, unclear items, or things a human should review before sending this to the customer.

Rules:
- Do not invent facts.
- Do not invent parts.
- Do not invent prices.
- Do not invent model numbers.
- Do not invent serial numbers.
- Do not invent test readings.
- Do not invent warranty language.
- Do not claim the system is fully fixed unless the notes clearly say that.
- Do not claim the system is safe unless the notes clearly support that.
- Do not guarantee fewer repairs.
- Do not guarantee lower bills.
- Do not guarantee better comfort.
- Do not provide legal, code-compliance, or safety certification language.
- If the notes are too vague, explain what information is missing.
- Use the preferred tone, but keep the writing professional.
- Keep the full result concise and useful.
- Always include a review reminder in reviewNotes.
`;
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

function validateAiResult(result) {
  if (!result || typeof result !== "object") {
    return false;
  }

  if (typeof result.serviceReport !== "string") {
    return false;
  }

  if (typeof result.invoiceDescription !== "string") {
    return false;
  }

  if (typeof result.customerFollowUp !== "string") {
    return false;
  }

  if (typeof result.internalSummary !== "string") {
    return false;
  }

  if (!Array.isArray(result.reviewNotes)) {
    return false;
  }

  return true;
}

export async function onRequestGet(context) {
  const hasAiBinding = Boolean(context.env && context.env.AI);

  return jsonResponse({
    success: true,
    status: "ok",
    aiBindingAvailable: hasAiBinding,
    model: DEFAULT_MODEL,
    message: "HVAC Service Report Generator API is available. Use POST to generate a report."
  });
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
      messages,
      max_tokens: 1400,
      temperature: 0.2
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

    if (!validateAiResult(parsedResult)) {
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
      result: parsedResult
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
