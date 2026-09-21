const BUILD_VERSION = "service-report-fact-continuity-2026-09-21";
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
  "Never insert placeholders such as [date], [name], [model], TBD, N/A, or blank template fields into customer-facing output.",
  "If a date, model number, serial number, price, or other detail was not provided, omit it from customer-facing sections and mention it only in reviewNotes when it is genuinely useful to review.",
  "Keep completed work, findings, recommendations, declined work, and future work separate in every section.",
  "Never describe recommended, pending, declined, or future work as completed work.",
  "The user prompt includes a source-fact map copied from the technician notes. Treat its categories as strict continuity guardrails.",
  "Keep reviewNotes as a JSON array of short, complete sentences with normal punctuation.",
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


function stripPlaceholderOpening(text) {
  return text
    .replace(
      /\bOn[ \t]+\[\s*(?:date|service[ \t]+date)\s*\][ \t]*,?[ \t]*([a-z])/gi,
      function (_match, firstLetter) {
        return firstLetter.toUpperCase();
      }
    )
    .replace(/\bOn[ \t]+\[\s*(?:date|service[ \t]+date)\s*\][ \t]*,?[ \t]*/gi, "");
}

function cleanGeneratedText(value) {
  let text = textFromValue(value).replace(/\r\n?/g, "\n");

  if (!text) {
    return "";
  }

  text = stripPlaceholderOpening(text)
    .replace(
      /(^|\n)[ \t]*(?:service[ \t]+date|date|customer(?:[ \t]+name)?|model(?:[ \t]+number)?|serial(?:[ \t]+number)?|price|cost)[ \t]*:[ \t]*(?:\[\s*[^\]\n]+\s*\]|TBD|N\/A)[ \t]*(?=\n|$)/gi,
      "$1"
    )
    .replace(/\[\s*(?:date|service[ \t]+date|customer|customer[ \t]+name|model|model[ \t]+number|serial|serial[ \t]+number|price|cost)\s*\]/gi, "")
    .replace(/\b(?:TBD|N\/A)\b/gi, "")
    .replace(/\bOn[ \t]*,[ \t]*([a-z])/gi, function (_match, firstLetter) {
      return firstLetter.toUpperCase();
    })
    .replace(/[ \t]+([,.;:!?])/g, "$1")
    .replace(/([.!?])[ \t]*[,;:]+/g, "$1")
    .replace(/([,;:])[ \t]*([,;:])+/g, "$1")
    .replace(/([.!?])[ \t]*([.!?])+/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/^\s*[,.;:]+[ \t]*/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text;
}

function splitReviewNoteEntries(value) {
  const rawNotes = Array.isArray(value)
    ? value
    : (typeof value === "string" ? [value] : []);
  const entries = [];
  const reviewNoteStarter = "(?:Missing|Confirm|Review|Verify|Check|Clarify|Add|Include|Document|Record|Provide)";

  rawNotes.forEach(function (note) {
    if (typeof note !== "string") {
      return;
    }

    let text = note.replace(/\r\n?/g, "\n");

    text = text
      .replace(new RegExp("([.!?])\\s*[,;:]+\\s*(?=" + reviewNoteStarter + "\\b)", "gi"), "$1\n")
      .replace(new RegExp("([.!?])\\s*(?=" + reviewNoteStarter + "\\b)", "gi"), "$1\n")
      .replace(new RegExp("[,;]+\\s*(?=" + reviewNoteStarter + "\\b)", "gi"), "\n")
      .replace(/\s*;\s*(?=[A-Z])/g, "\n");

    text.split(/\n+/).forEach(function (entry) {
      if (entry.trim()) {
        entries.push(entry);
      }
    });
  });

  return entries;
}

function normalizeReviewNotes(value) {
  const cleaned = [];
  const seen = new Set();

  splitReviewNoteEntries(value).forEach(function (note) {
    let text = cleanGeneratedText(
      note.replace(/^(?:[-*•]|\d+[.)])[ \t]*/, "")
    );

    if (!text) {
      return;
    }

    text = text
      .replace(/^[,.;:\s]+/, "")
      .replace(/[,;:\s]+$/, "")
      .replace(/([.!?])(?:[.,;:!?])+$/, "$1")
      .trim();

    if (!/[.!?]$/.test(text)) {
      text += ".";
    }

    const key = text.toLowerCase().replace(/[.!?]+$/, "");

    if (!seen.has(key)) {
      seen.add(key);
      cleaned.push(text);
    }
  });

  return cleaned;
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

function splitTechnicianNoteStatements(value) {
  return cleanText(value)
    .replace(/\r\n?/g, "\n")
    .replace(
      /\s+(?:and|but)\s+(?=(?:recommend(?:ed|s|ing)?|advise(?:d|s|ing)?|suggest(?:ed|s|ing)?|declin(?:ed|es|ing)?|defer(?:red|s|ring)?|pending)\b)/gi,
      "\n"
    )
    .replace(/([.!?])[ \t]+(?=[A-Z0-9])/g, "$1\n")
    .replace(/[;\n]+/g, "\n")
    .split("\n")
    .map(function (statement) {
      return statement.trim();
    })
    .filter(Boolean);
}

function classifyTechnicianNotes(value) {
  const facts = {
    customerReported: [],
    findings: [],
    completedWork: [],
    documentedResults: [],
    recommendations: [],
    other: []
  };

  splitTechnicianNoteStatements(value).forEach(function (statement) {
    if (/\b(?:recommend(?:ed|s|ing)?|advise(?:d|s|ing)?|suggest(?:ed|s|ing)?|declin(?:ed|es|ing)?|defer(?:red|s|ring)?|pending|future|estimate|quote|return visit|follow[- ]?up(?: visit)?|should|needs? to)\b/i.test(statement)) {
      facts.recommendations.push(statement);
    } else if (/\b(?:customer|client|tenant|owner)\b.*\b(?:report(?:ed|s|ing)?|said|stated|complain(?:ed|s|ing)?|notic(?:ed|es|ing)?|request(?:ed|s|ing)?)\b/i.test(statement)) {
      facts.customerReported.push(statement);
    } else if (/\b(?:replac(?:ed|ing)|repair(?:ed|ing)|clean(?:ed|ing)|clear(?:ed|ing)|flush(?:ed|ing)|install(?:ed|ing)|adjust(?:ed|ing)|tighten(?:ed|ing)|seal(?:ed|ing)|reset|restor(?:ed|ing)|remov(?:ed|ing)|lubricat(?:ed|ing)|perform(?:ed|ing)|complet(?:ed|ing)|chang(?:ed|ing)|servic(?:ed|ing)|tested|checked)\b/i.test(statement)) {
      facts.completedWork.push(statement);
    } else if (/\b(?:after (?:the )?(?:repair|service)|temperature split|operat(?:ed|ing)|cooling|heating|draining|cycled|started|running|reading(?:s)?|measured|verified|confirmed)\b/i.test(statement)) {
      facts.documentedResults.push(statement);
    } else if (/\b(?:found|observed|noted|diagnosed|inspection|weak|failed|dirty|clogged|restricted|leak(?:ing|ed)?|damaged|low|high|not (?:cooling|heating|running|working))\b/i.test(statement)) {
      facts.findings.push(statement);
    } else {
      facts.other.push(statement);
    }
  });

  return facts;
}

function buildFactMapLines(technicianNotes) {
  const facts = classifyTechnicianNotes(technicianNotes);
  const groups = [
    ["Customer-reported issue", facts.customerReported],
    ["Confirmed findings", facts.findings],
    ["Confirmed completed work", facts.completedWork],
    ["Documented results or readings", facts.documentedResults],
    ["Recommendations, declined items, or open work", facts.recommendations],
    ["Other source statements", facts.other]
  ];
  const lines = [];

  groups.forEach(function (group) {
    lines.push(group[0] + ":");

    if (group[1].length === 0) {
      lines.push("- None explicitly stated.");
    } else {
      group[1].forEach(function (statement) {
        lines.push("- " + statement);
      });
    }

    lines.push("");
  });

  return lines;
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
    "Source-fact map copied from the technician notes:",
    ...buildFactMapLines(data.technicianNotes),
    "Continuity requirements:",
    "- Only statements under Confirmed completed work may be described as work that was performed, completed, repaired, replaced, cleaned, installed, or billed.",
    "- Confirmed findings must remain findings unless the same action also appears under Confirmed completed work.",
    "- Recommendations, declined items, and open work must remain recommendations, declined items, or open work in every output section.",
    "- Do not move an item from one source-fact category into another.",
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
    "Do not add a date line, opening date phrase, model number, serial number, price, or other field unless it was actually provided in the technician notes or form data.",
    "Do not add a report title or company heading. Start directly with the service narrative.",
    "Never use bracketed placeholders or template filler such as [date], [customer], TBD, or N/A.",
    "",
    "invoiceDescription:",
    "Write 1 to 3 short invoice lines based only on confirmed work.",
    "Include only work the notes explicitly say was completed. Do not bill or take credit for a finding, recommendation, declined item, or future service.",
    "",
    "customerFollowUp:",
    "Write a short text-message or email-style follow-up.",
    "Avoid unsupported claims such as 'ensure optimal performance,' 'prevent future repairs,' or similar guarantees.",
    "Do not assume how the customer feels or how the equipment performed after the documented visit.",
    "Do not say the customer is satisfied, happy, pleased, or enjoying improved comfort unless the technician notes explicitly say so.",
    "",
    "internalSummary:",
    "Write a short internal office summary.",
    "Keep completed work separate from open recommendations and declined work.",
    "",
    "reviewNotes:",
    "Return a JSON array of short, complete sentences. Each array item should contain one clear review point.",
    "Do not combine multiple notes into one comma-separated string.",
    "Only flag missing information that would materially help the office review or finalize the paperwork.",
    "Do not invent whether the customer was charged, approved work, declined work, or created a sales opportunity.",
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
    "- A recommendation is not completed work. If the notes say an item was recommended, keep it out of completed-work and invoice wording.",
    "- Example: 'Replaced capacitor. Recommended filter replacement and coil cleaning.' means only the capacitor replacement was completed.",
    "- If the notes are too vague, explain what information is missing in reviewNotes.",
    "- Do not use placeholders in any customer-facing section.",
    "- Always include a reminder to review before sending to the customer."
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

  const serviceReport = cleanGeneratedText(
    result.serviceReport ||
    result.customerReadyServiceReport ||
    result.customer_ready_service_report ||
    result.report ||
    result.service_report
  );

  const invoiceDescription = cleanGeneratedText(
    result.invoiceDescription ||
    result.invoice_description ||
    result.invoice ||
    result.invoiceLines ||
    result.invoice_lines
  );

  const customerFollowUp = cleanGeneratedText(
    result.customerFollowUp ||
    result.customer_follow_up ||
    result.followUp ||
    result.follow_up ||
    result.customerMessage ||
    result.customer_message
  );

  const internalSummary = cleanGeneratedText(
    result.internalSummary ||
    result.internal_summary ||
    result.summary ||
    result.officeSummary ||
    result.office_summary
  );

  let reviewNotes = normalizeReviewNotes(
    result.reviewNotes ||
    result.review_notes ||
    result.missingInformation ||
    result.missing_information
  );

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
    reviewNotes.push("Review the final wording before sending it to the customer.");
  }

  const standardReviewNote = "Confirm pricing, parts, readings, warranty language, customer approval, and company-specific details before sending.";
  if (!reviewNotes.some(function (note) {
    return note.toLowerCase() === standardReviewNote.toLowerCase();
  })) {
    reviewNotes.push(standardReviewNote);
  }

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
