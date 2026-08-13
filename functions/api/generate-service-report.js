const DEFAULT_MODEL = "gpt-5.1-mini";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  "X-Content-Type-Options": "nosniff"
};

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "serviceReport",
    "invoiceDescription",
    "customerFollowUp",
    "internalSummary",
    "reviewNotes"
  ],
  properties: {
    serviceReport: {
      type: "string",
      description: "Plain-English customer-ready HVAC/R service report."
    },
    invoiceDescription: {
      type: "string",
      description: "Short invoice wording based only on confirmed work."
    },
    customerFollowUp: {
      type: "string",
      description: "Short customer follow-up message."
    },
    internalSummary: {
      type: "string",
      description: "Short internal office summary."
    },
    reviewNotes: {
      type: "array",
      description: "Missing information, unclear items, or human review reminders.",
      items: {
        type: "string"
      }
    }
  }
};

const SYSTEM_PROMPT = `
You are an AI writing assistant for HVAC/R service companies.

Your job is to turn rough technician notes into clean, professional service paperwork.

Use only the information provided by the user. Do not invent facts, parts, prices, model numbers, serial numbers, warranties, guarantees, test results, safety claims, code-compliance claims, or final operating conditions.

Write in plain English. Keep the tone professional and useful for HVAC/R business owners, office managers, technicians, and customers.

The output must be practical, clear, and easy to review before sending to a customer.

Always flag missing or unclear information instead of guessing.

Do not mention that you are an AI.

Return only the requested structured output.
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

Task:
Create a clean HVAC/R service paperwork package based only on the information provided.

Return these sections:

1. Customer-Ready Service Report
Write a clear, plain-English service report for the customer. Explain what was reported, what was found, what work was completed, and any recommendation that is directly supported by the technician notes.

2. Invoice Description
Write 1 to 3 short invoice lines that describe the confirmed work performed. Make the wording professional and easy to paste into invoice software.

3. Customer Follow-Up Message
Write a short text-message or email-style follow-up. Thank the customer, summarize the visit, and mention any next step only if the technician notes support it.

4. Internal Job Summary
Write a short internal summary for office records. This can be more direct than the customer-facing report.

5. Missing Information or Review Notes
List any important missing details, unclear items, or things a human should review before sending this to the customer.

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
- Always include a review reminder in the review notes.
`;
}

function extractOutputText(openAiResponse) {
  if (typeof openAiResponse.output_text === "string") {
    return openAiResponse.output_text;
  }

  if (!Array.isArray(openAiResponse.output)) {
    return "";
  }

  for (const outputItem of openAiResponse.output) {
    if (!Array.isArray(outputItem.content)) {
      continue;
    }

    for (const contentItem of outputItem.content) {
      if (typeof contentItem.text === "string") {
        return contentItem.text;
      }
    }
  }

  return "";
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

export async function onRequestGet() {
  return jsonResponse({
    success: true,
    status: "ok",
    message: "HVAC Service Report Generator API is available. Use POST to generate a report."
  });
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    if (!env.OPENAI_API_KEY) {
      return jsonResponse(
        {
          success: false,
          error: "The generator is not fully configured yet. Missing API key."
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

    const model = env.OPENAI_MODEL || DEFAULT_MODEL;

    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: buildUserPrompt(validation.data)
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "hvac_service_report_output",
            strict: true,
            schema: RESPONSE_SCHEMA
          }
        },
        max_output_tokens: 1400
      })
    });

    const openAiData = await openAiResponse.json();

    if (!openAiResponse.ok) {
      return jsonResponse(
        {
          success: false,
          error: "Something went wrong while generating the report. Please try again in a moment."
        },
        502
      );
    }

    const outputText = extractOutputText(openAiData);

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
      parsedResult = JSON.parse(outputText);
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
