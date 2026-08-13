const JSON_HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  "X-Content-Type-Options": "nosniff"
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: JSON_HEADERS
  });
}

export async function onRequestGet(context) {
  try {
    const { env } = context;

    if (!env.AI) {
      return jsonResponse(
        {
          success: false,
          error: "Missing Cloudflare Workers AI binding. Expected binding name: AI"
        },
        500
      );
    }

    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
      messages: [
        {
          role: "user",
          content: "Reply with exactly this text: AI test working"
        }
      ],
      max_tokens: 50
    });

    return jsonResponse({
      success: true,
      message: "Workers AI binding is working.",
      result
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: error && error.message ? error.message : String(error),
        name: error && error.name ? error.name : null
      },
      500
    );
  }
}
