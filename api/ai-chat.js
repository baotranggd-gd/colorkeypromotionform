// Vercel Serverless Function: /api/ai-chat
// OPS PORTAL - Gemini read-only business intelligence assistant

const ALLOWED_ORIGINS = [
  'https://colorkeypromotionform.vercel.app',
  'https://www.colorkeypromotionform.vercel.app'
];

const SYSTEM_INSTRUCTION = `
You are the AI Business & Market Intelligence assistant inside OPS PORTAL.

ROLE
- You are a read-only business intelligence assistant for operations.
- Analyze only the data supplied in the request context.
- Never invent sales, stock, promotion, customer, product, or market facts.
- If data is missing, say clearly that it is not available or not connected.
- External market intelligence is NOT connected unless it is explicitly included in the context.
- Do not claim that you changed, created, deleted, approved, reserved, released, or updated anything.
- Do not provide instructions that execute portal actions. You may recommend what the operator should review, but the portal remains read-only for AI.

ANALYSIS STYLE
- Default language: Vietnamese. Answer in English or Chinese only when the user asks.
- Be concise, practical, and business-oriented.
- Prefer concrete numbers from the supplied data.
- Distinguish facts from interpretation. Use wording such as "Dữ liệu cho thấy" for facts and "Có thể" / "Khả năng" for hypotheses.
- For business analysis, organize the answer where useful into:
  WHAT — what is happening
  WHY — likely drivers supported by the data
  MARKET — external market signal only if supplied; otherwise state that external market data is not connected
  IMPLICATION — operational/business implication
  WATCH — what the operator should monitor next
- When the user asks a simple factual question, answer directly without forcing all sections.
- If the user asks for a ranking, provide the ranking only when it can be calculated from supplied data.
- Never fabricate a ranking or estimate a value that is not supported by the context.
`;

function setCors(req, res) {
  const origin = req.headers.origin || '';

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

function cleanModelName(value) {
  const raw = String(value || '').trim();

  if (!raw) {
    return 'gemini-3.8-flash';
  }

  return raw.replace(/^models\//, '');
}

function extractText(data) {
  const candidates = Array.isArray(data?.candidates)
    ? data.candidates
    : [];

  return candidates
    .flatMap(candidate => candidate?.content?.parts || [])
    .map(part => part?.text || '')
    .filter(Boolean)
    .join('')
    .trim();
}

module.exports = async function handler(req, res) {

  // CORS
  setCors(req, res);

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed'
    });
  }

  // Gemini API Key
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: 'GEMINI_API_KEY is not configured on the server.'
    });
  }

  try {

    // Parse request
    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : (req.body || {});

    const question = String(body.question || '').trim();

    const context =
      body.context && typeof body.context === 'object'
        ? body.context
        : {};

    // Validate question
    if (!question) {
      return res.status(400).json({
        ok: false,
        error: 'Question is required.'
      });
    }

    // Prevent oversized request
    if (question.length > 4000) {
      return res.status(400).json({
        ok: false,
        error: 'Question is too long.'
      });
    }

    // Convert portal data to JSON
    const contextJson = JSON.stringify(context);

    // Prevent oversized AI context
    if (contextJson.length > 120000) {
      return res.status(413).json({
        ok: false,
        error: 'AI context is too large. Please narrow the data scope.'
      });
    }

    // Gemini model
    const model = cleanModelName(
      process.env.GEMINI_MODEL
    );

    // Gemini REST API endpoint
    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    // Prompt sent to Gemini
    const userPrompt = `
USER QUESTION:
${question}

PORTAL DATA CONTEXT (read-only):
${contextJson}

Answer the user's question using the supplied portal data only.
`;

    // Call Gemini
    const response = await fetch(endpoint, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },

      body: JSON.stringify({

        system_instruction: {
          parts: [
            {
              text: SYSTEM_INSTRUCTION
            }
          ]
        },

        contents: [
          {
            role: 'user',
            parts: [
              {
                text: userPrompt
              }
            ]
          }
        ],

        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1200
        }

      })
    });

    // Read Gemini response
    const data = await response.json().catch(() => ({}));

    // Gemini API error
    if (!response.ok) {

      console.error(
        'Gemini API error:',
        response.status,
        data
      );

      return res.status(response.status).json({
        ok: false,
        error:
          data?.error?.message ||
          `Gemini API HTTP ${response.status}`
      });
    }

    // Extract answer
    const answer = extractText(data);

    if (!answer) {
      return res.status(502).json({
        ok: false,
        error: 'Gemini returned no text response.'
      });
    }

    // Success
    return res.status(200).json({
      ok: true,
      answer,
      model
    });

  } catch (error) {

    console.error(
      'AI chat handler error:',
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        error?.message ||
        'Internal server error'
    });
  }
};
