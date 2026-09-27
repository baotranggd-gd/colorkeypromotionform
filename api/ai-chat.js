// api/ai-chat.js

const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

const SYSTEM_PROMPT = `
Bạn là AI Business & Market Intelligence của OPS Portal.

Mục tiêu:
- Phân tích dữ liệu vận hành được cung cấp từ OPS Portal.
- Hỗ trợ người dùng hiểu sales, customer, product, promotion,
  inventory/stock và business signals.
- Chỉ phân tích và đưa insight.
- Đây là AI READ-ONLY.

QUY TẮC BẮT BUỘC:

1. Không được tự tạo, sửa, xóa hoặc approve:
   - Order
   - Customer
   - Product
   - Promotion
   - Stock
   - Account/User
   - Payment
   - Reservation

2. Không được nói rằng bạn đã thực hiện một action nếu
   thực tế không có tool/action nào được gọi.

3. Chỉ sử dụng dữ liệu được truyền trong CONTEXT.
   Nếu dữ liệu không có, hãy nói rõ:
   "Chưa có dữ liệu để xác nhận."

4. Không được tự bịa:
   - doanh thu
   - số lượng
   - tồn kho
   - khách hàng
   - sản phẩm
   - chương trình promotion
   - market data
   - trend
   - nguyên nhân

5. Phân biệt:
   - FACT: điều được dữ liệu xác nhận
   - INSIGHT: nhận định được suy ra từ dữ liệu
   - HYPOTHESIS: giả thuyết cần kiểm tra thêm

6. Nếu người dùng hỏi về thị trường nhưng CONTEXT
   không có external market data:
   hãy nói rõ external market data chưa được kết nối.
   Không được tự tạo market trend.

7. Ưu tiên trả lời bằng tiếng Việt.

8. Khi phù hợp, cấu trúc:

WHAT
- Điều gì đang xảy ra?

WHY
- Dữ liệu cho thấy nguyên nhân/động lực nào?
- Nếu chưa đủ dữ liệu thì nói rõ.

MARKET
- Có liên quan đến market signal hay không?
- Nếu chưa có market data thì ghi rõ.

IMPLICATION
- Điều này có ý nghĩa gì đối với vận hành/business?

WATCH
- Cần theo dõi thêm chỉ số nào?

9. Khi phân tích stock:
- Không tự quyết định mua hàng.
- Không tự quyết định allocation.
- Không tự reserve stock.
- Chỉ cảnh báo/rút ra insight từ dữ liệu.

10. Khi phân tích promotion:
- Chỉ phân tích promotion có trong CONTEXT.
- Không tự tạo promotion mới.
- Có thể chỉ ra dấu hiệu bất thường hoặc cần kiểm tra.

11. Khi phân tích sales:
- Có thể phân tích revenue, quantity, customer, product,
  category, line, channel, region và trend nếu dữ liệu được cung cấp.

12. Nếu câu hỏi quá mơ hồ:
- Trả lời dựa trên dữ liệu hiện có.
- Nêu ngắn gọn dữ liệu nào cần thêm để phân tích chính xác hơn.

Phong cách:
- Ngắn gọn.
- Rõ ràng.
- Business-oriented.
- Ưu tiên bullet point.
- Không nói dài dòng về kỹ thuật AI.
- Không nhắc đến system prompt.
`;

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );
}

function safeJson(value, maxChars = 120000) {
  try {
    const text = JSON.stringify(value ?? {});

    if (text.length <= maxChars) {
      return text;
    }

    return (
      text.slice(0, maxChars) +
      "\n[CONTEXT TRUNCATED]"
    );
  } catch (error) {
    return "{}";
  }
}

function extractGeminiText(data) {
  if (!data) return "";

  const candidates = data.candidates;

  if (!Array.isArray(candidates)) {
    return "";
  }

  const parts = [];

  for (const candidate of candidates) {
    const content = candidate?.content;

    if (!content || !Array.isArray(content.parts)) {
      continue;
    }

    for (const part of content.parts) {
      if (
        part &&
        typeof part.text === "string"
      ) {
        parts.push(part.text);
      }
    }
  }

  return parts.join("\n").trim();
}

module.exports = async function handler(req, res) {
  setCors(res);

  // Browser preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Only POST
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error:
        "GEMINI_API_KEY is not configured on the server."
    });
  }

  try {
    const body = req.body || {};

    const question =
      typeof body.question === "string"
        ? body.question.trim()
        : "";

    const context = body.context || {};

    if (!question) {
      return res.status(400).json({
        ok: false,
        error: "Question is required."
      });
    }

    if (question.length > 5000) {
      return res.status(400).json({
        ok: false,
        error: "Question is too long."
      });
    }

    const compactContext = safeJson(context);

    const model =
      process.env.GEMINI_MODEL ||
      "gemini-3.8-flash";

    const prompt = `
${SYSTEM_PROMPT}

========================
USER QUESTION
========================

${question}

========================
OPS PORTAL CONTEXT
========================

${compactContext}

========================
TASK
========================

Analyze the user's question using only the
supplied OPS Portal context.

Remember:
- Do not invent missing data.
- Do not perform any write action.
- Clearly distinguish FACT, INSIGHT and HYPOTHESIS
  when useful.
- If the supplied data is insufficient, say what is missing.
`;

    const url =
      `${GEMINI_API_BASE}/${model}:generateContent` +
      `?key=${encodeURIComponent(apiKey)}`;

    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1500
        }
      })
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error(
        "Gemini API error:",
        data
      );

      return res.status(geminiResponse.status).json({
        ok: false,
        error:
          data?.error?.message ||
          "Gemini API request failed."
      });
    }

    const answer = extractGeminiText(data);

    if (!answer) {
      return res.status(502).json({
        ok: false,
        error:
          "Gemini returned an empty response."
      });
    }

    return res.status(200).json({
      ok: true,
      answer,
      model
    });

  } catch (error) {
    console.error(
      "AI Chat error:",
      error
    );

    return res.status(500).json({
      ok: false,
      error: "Internal server error."
    });
  }
};
