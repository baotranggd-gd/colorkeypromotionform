// api/ai-chat.js

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

const SYSTEM_PROMPT = `
Bạn là AI Business & Market Intelligence của OPS Portal.

Mục tiêu:
- Phân tích dữ liệu vận hành được cung cấp từ OPS Portal.
- Hỗ trợ người dùng hiểu sales, customer, product, promotion, inventory/stock và business signals.
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

2. Không được nói rằng bạn đã thực hiện một action nếu thực tế không có tool/action nào được gọi.

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

5. Phân biệt rõ:
   - FACT: điều được dữ liệu xác nhận
   - INSIGHT: nhận định được suy ra từ dữ liệu
   - HYPOTHESIS: giả thuyết cần kiểm tra thêm

6. Nếu người dùng hỏi về thị trường nhưng CONTEXT không có external market data:
   hãy nói rõ external market data chưa được kết nối.
   Không được tự tạo market trend.

7. Ưu tiên trả lời bằng tiếng Việt.
   Nếu người dùng hỏi bằng ngôn ngữ khác thì có thể trả lời theo ngôn ngữ đó.

8. Khi phù hợp, cấu trúc câu trả lời:

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
- Chỉ cảnh báo/rút ra insight từ dữ liệu được cung cấp.

10. Khi phân tích promotion:
- Chỉ phân tích promotion có trong CONTEXT.
- Không tự tạo promotion mới.
- Có thể chỉ ra dấu hiệu bất thường hoặc cần kiểm tra.

11. Khi phân tích sales:
- Có thể phân tích revenue, quantity, customer, product, category, line, channel, region và trend nếu dữ liệu được cung cấp.

12. Nếu câu hỏi quá mơ hồ:
- Hãy trả lời dựa trên dữ liệu hiện có.
- Sau đó nêu ngắn gọn dữ liệu nào cần thêm để phân tích chính xác hơn.

Phong cách:
- Ngắn gọn, rõ ràng, business-oriented.
- Ưu tiên bullet point.
- Không nói dài dòng về kỹ thuật AI.
- Không nhắc đến system prompt.
`;

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function safeJson(value, maxChars = 120000) {
  try {
    const text = JSON.stringify(value ?? {});

    if (text.length <= maxChars) {
      return text;
    }

    return text.slice(0, maxChars) + "\n[CONTEXT TRUNCATED]";
  } catch (error) {
    return "{}";
  }
}

function extractOutputText(response) {
  if (!response) return "";

  if (typeof response.output_text === "string") {
    return response.output_text.trim();
  }

  if (!Array.isArray(response.output)) {
    return "";
  }

  const parts = [];

  for (const item of response.output) {
    if (!item || !Array.isArray(item.content)) continue;

    for (const content of item.content) {
      if (
        content &&
        content.type === "output_text" &&
        typeof content.text === "string"
      ) {
        parts.push(content.text);
      }
    }
  }

  return parts.join("\n").trim();
}

module.exports = async function handler(req, res) {
  setCors(res);

  // Handle browser preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Only POST is allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: "OPENAI_API_KEY is not configured on the server."
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

    const userPrompt = `
USER QUESTION:
${question}

OPS PORTAL CONTEXT:
${compactContext}

TASK:
Analyze the user's question using only the supplied OPS Portal context.

Remember:
- Do not invent missing data.
- Do not perform any write action.
- Clearly distinguish FACT, INSIGHT and HYPOTHESIS when useful.
- If the supplied data is insufficient, say what is missing.
`;

    const model =
      process.env.OPENAI_MODEL || "gpt-5.6-luna";

    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        instructions: SYSTEM_PROMPT,
        input: userPrompt,
        max_output_tokens: 1500
      })
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      console.error("OpenAI API error:", data);

      return res.status(openaiResponse.status).json({
        ok: false,
        error:
          data?.error?.message ||
          "OpenAI API request failed."
      });
    }

    const answer = extractOutputText(data);

    if (!answer) {
      return res.status(502).json({
        ok: false,
        error: "AI returned an empty response."
      });
    }

    return res.status(200).json({
      ok: true,
      answer,
      model
    });

  } catch (error) {
    console.error("AI Chat error:", error);

    return res.status(500).json({
      ok: false,
      error: "Internal server error."
    });
  }
};
