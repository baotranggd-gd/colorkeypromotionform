// ============================================================
// OPS PORTAL - AI CHAT
// Vercel Serverless Function
// Endpoint: /api/ai-chat
// Gemini 3.8 Flash - READ ONLY
// ============================================================

const ALLOWED_ORIGINS = [
  'https://colorkeypromotionform.vercel.app',
  'https://www.colorkeypromotionform.vercel.app'
];


// ============================================================
// SYSTEM INSTRUCTION
// ============================================================

const SYSTEM_INSTRUCTION = `
You are the AI Business & Market Intelligence assistant inside OPS PORTAL.

ROLE
- You are a read-only business intelligence assistant for operations.
- Analyze only the data supplied in the request context.
- Never invent sales, stock, promotion, customer, product, or market facts.
- If data is missing, clearly say that it is not available or not connected.
- External market intelligence is NOT connected unless it is explicitly included in the context.
- Never claim that you changed, created, deleted, approved, reserved, released, or updated anything.
- Do not execute portal actions.
- You may recommend what the operator should review, but the AI remains read-only.

LANGUAGE
- Default language: Vietnamese.
- Answer in English only when the user asks in English.
- Answer in Chinese only when the user asks in Chinese.

ANALYSIS STYLE
- Be concise, practical, and business-oriented.
- Prefer concrete numbers from the supplied portal data.
- Distinguish facts from interpretation.
- Use:
  "Dữ liệu cho thấy..." for facts.
  "Có thể..." or "Khả năng..." for hypotheses.
- Never present an assumption as a confirmed fact.
- Never fabricate missing data.

BUSINESS ANALYSIS FORMAT
When useful, structure the response as:

WHAT
What is happening according to the data.

WHY
Possible drivers supported by the available data.

MARKET
External market signal only if market data is actually supplied.
If not connected, explicitly say:
"Chưa có dữ liệu thị trường bên ngoài được kết nối."

IMPLICATION
What the finding may mean operationally or commercially.

WATCH
What the operator should monitor next.

SIMPLE QUESTIONS
If the user asks a simple factual question, answer directly.
Do not force the full WHAT / WHY / MARKET / IMPLICATION / WATCH structure.

RANKINGS
Only provide rankings that can be calculated from the supplied data.
Never invent rankings or estimates.

READ-ONLY RULE
The AI must never perform or claim to perform:
- create
- edit
- delete
- approve
- reject
- reserve stock
- release stock
- change promotion
- change customer
- change product
- change order
- change warehouse data
- change portal settings

The AI can only analyze and explain supplied information.
`;


// ============================================================
// CORS
// ============================================================

function setCors(req, res) {

  const origin = req.headers.origin || '';

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader(
      'Access-Control-Allow-Origin',
      origin
    );
  } else {
    // Allow Vercel / same-origin requests
    res.setHeader(
      'Access-Control-Allow-Origin',
      '*'
    );
  }

  res.setHeader(
    'Vary',
    'Origin'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, OPTIONS'
  );
}


// ============================================================
// EXTRACT GEMINI TEXT
// ============================================================

function extractText(data) {

  const candidates =
    Array.isArray(data?.candidates)
      ? data.candidates
      : [];

  return candidates
    .flatMap(
      candidate =>
        candidate?.content?.parts || []
    )
    .map(
      part =>
        part?.text || ''
    )
    .filter(Boolean)
    .join('')
    .trim();
}


// ============================================================
// MAIN HANDLER
// ============================================================

module.exports = async function handler(req, res) {

  // ----------------------------------------------------------
  // CORS
  // ----------------------------------------------------------

  setCors(req, res);


  // ----------------------------------------------------------
  // OPTIONS / PREFLIGHT
  // ----------------------------------------------------------

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }


  // ----------------------------------------------------------
  // METHOD VALIDATION
  // ----------------------------------------------------------

  if (req.method !== 'POST') {

    return res.status(405).json({
      ok: false,
      error: 'Method not allowed'
    });

  }


  // ----------------------------------------------------------
  // GEMINI API KEY
  // ----------------------------------------------------------

  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {

    return res.status(500).json({
      ok: false,
      error:
        'GEMINI_API_KEY is not configured on the server.'
    });

  }


  try {

    // --------------------------------------------------------
    // PARSE REQUEST BODY
    // --------------------------------------------------------

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : (req.body || {});


    // --------------------------------------------------------
    // USER QUESTION
    // --------------------------------------------------------

    const question =
      String(
        body.question || ''
      ).trim();


    // --------------------------------------------------------
    // PORTAL CONTEXT
    // --------------------------------------------------------

    const context =
      body.context &&
      typeof body.context === 'object'
        ? body.context
        : {};


    // --------------------------------------------------------
    // VALIDATE QUESTION
    // --------------------------------------------------------

    if (!question) {

      return res.status(400).json({
        ok: false,
        error: 'Question is required.'
      });

    }


    // --------------------------------------------------------
    // QUESTION LENGTH LIMIT
    // --------------------------------------------------------

    if (question.length > 4000) {

      return res.status(400).json({
        ok: false,
        error: 'Question is too long.'
      });

    }


    // --------------------------------------------------------
    // SERIALIZE PORTAL DATA
    // --------------------------------------------------------

    const contextJson =
      JSON.stringify(context);


    // --------------------------------------------------------
    // CONTEXT SIZE LIMIT
    // --------------------------------------------------------

    if (contextJson.length > 120000) {

      return res.status(413).json({
        ok: false,
        error:
          'AI context is too large. Please narrow the data scope.'
      });

    }


    // ========================================================
    // GEMINI 3.8 FLASH
    // IMPORTANT:
    // Do NOT read GEMINI_MODEL here.
    // This prevents old model values from Vercel
    // from causing model-format errors.
    // ========================================================

    const model =
      'gemini-3.8-flash';


    // ========================================================
    // GEMINI REST ENDPOINT
    // ========================================================

    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;


    // ========================================================
    // USER PROMPT
    // ========================================================

    const userPrompt = `
USER QUESTION:
${question}

PORTAL DATA CONTEXT (READ-ONLY):
${contextJson}

IMPORTANT:
Answer the user's question using the supplied portal data only.

If the required information does not exist in the supplied context,
say that the data is unavailable.

Do not invent information.
Do not assume missing numbers.
Do not claim external market information unless it exists in the context.
`;


    // ========================================================
    // CALL GEMINI
    // ========================================================

    const response =
      await fetch(
        endpoint,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            'x-goog-api-key':
              apiKey
          },

          body:
            JSON.stringify({

              // ------------------------------------------------
              // SYSTEM INSTRUCTION
              // ------------------------------------------------

              system_instruction: {
                parts: [
                  {
                    text:
                      SYSTEM_INSTRUCTION
                  }
                ]
              },


              // ------------------------------------------------
              // USER CONTENT
              // ------------------------------------------------

              contents: [
                {
                  role: 'user',

                  parts: [
                    {
                      text:
                        userPrompt
                    }
                  ]
                }
              ],


              // ------------------------------------------------
              // GENERATION CONFIG
              // ------------------------------------------------

              generationConfig: {

                maxOutputTokens:
                  1200

              }

            })
        }
      );


    // ========================================================
    // READ GEMINI RESPONSE
    // ========================================================

    const data =
      await response
        .json()
        .catch(
          () => ({})
        );


    // ========================================================
    // GEMINI API ERROR
    // ========================================================

    if (!response.ok) {

      console.error(
        'Gemini API error:',
        response.status,
        data
      );


      return res.status(
        response.status
      ).json({

        ok: false,

        error:
          data?.error?.message ||
          `Gemini API HTTP ${response.status}`

      });

    }


    // ========================================================
    // EXTRACT ANSWER
    // ========================================================

    const answer =
      extractText(data);


    // ========================================================
    // EMPTY RESPONSE
    // ========================================================

    if (!answer) {

      return res.status(502).json({

        ok: false,

        error:
          'Gemini returned no text response.'

      });

    }


    // ========================================================
    // SUCCESS
    // ========================================================

    return res.status(200).json({

      ok: true,

      answer,

      model

    });


  } catch (error) {

    // ========================================================
    // SERVER ERROR
    // ========================================================

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
