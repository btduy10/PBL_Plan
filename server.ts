import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy GoogleGenAI instance helper
function getGeminiAi() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// PBL AI Co-Pilot Endpoint
app.post("/api/gemini/pbl-assistant", async (req, res) => {
  try {
    const { action, payload } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: "GEMINI_API_KEY chưa được cấu hình trong Cài đặt > Bí mật (Secrets).",
      });
    }

    const ai = getGeminiAi();
    let prompt = "";

    if (action === "generate_driving_question") {
      const { topic, subject, gradeLevel, context } = payload;
      prompt = `Bạn là chuyên gia phương pháp Giáo dục Học theo Dự án (PBL) chuẩn BIE (PBLWorks).
Hãy gợi ý 3 "Câu hỏi cốt lõi" (Driving Questions) chất lượng cao cho dự án sau:
- Môn học / Chủ đề: ${subject || "Tích hợp"} - ${topic}
- Khối lớp: ${gradeLevel || "Lớp 8-12"}
- Bối cảnh thực tế: ${context || "Tối ưu môi trường sống và cộng đồng"}

Yêu cầu cho Câu hỏi cốt lõi chuẩn BIE:
1. Mang tính khiêu khích tư duy (Provocative & Open-ended).
2. Kết nối trực tiếp với vấn đề thực tế (Real-world context).
3. Đặt học sinh vào vai trò chủ thể giải quyết vấn đề.
4. Bắt đầu bằng những cụm từ như: "Làm thế nào để...", "Chúng ta có thể...", "Làm sao chúng ta..."

Trả về định dạng JSON thuần tuý với cấu trúc:
{
  "drivingQuestions": [
    {
      "question": "Câu hỏi...",
      "rationale": "Lý do vì sao câu hỏi này đạt chuẩn PBL...",
      "suggestedProducts": ["Sản phẩm 1", "Sản phẩm 2"]
    }
  ]
}`;
    } else if (action === "generate_rubric") {
      const { drivingQuestion, projectTitle, targetSkills } = payload;
      prompt = `Bạn là chuyên gia PBL thiết kế Tiêu chí Đánh giá (Rubric) chuẩn 4Cs (Critical Thinking, Collaboration, Communication, Creativity) cho dự án: "${projectTitle}".
Câu hỏi cốt lõi: "${drivingQuestion}".
Kỹ năng tập trung: ${targetSkills ? targetSkills.join(", ") : "Cả 4 kỹ năng 4Cs"}.

Hãy tạo bộ Rubric gồm 4 tiêu chí tương ứng 4Cs (hoặc các tiêu chí trọng tâm). Mỗi tiêu chí có 3 mức độ:
1. Cần cố gắng (Developing)
2. Đạt chuẩn (Proficient)
3. Xuất sắc (Exemplary)

Trả về định dạng JSON với cấu trúc:
{
  "rubricCriteria": [
    {
      "category": "Tư duy phản biện (Critical Thinking)",
      "developing": "Mô tả mức 1...",
      "proficient": "Mô tả mức 2...",
      "exemplary": "Mô tả mức 3..."
    }
  ]
}`;
    } else if (action === "review_learning_log") {
      const { logText, studentRole, projectTitle } = payload;
      prompt = `Bạn là một Giáo viên hướng dẫn PBL giàu kinh nghiệm.
Một học sinh đảm nhận vai trò "${studentRole}" trong dự án "${projectTitle}" vừa viết nhật ký học tập (Learning Log):
"${logText}"

Hãy viết một phản hồi mang tính xây dựng (Formative Feedback) theo quy tắc PBL:
1. Khen ngợi cụ thể hành động/tư duy của học sinh (Praise).
2. Đặt 1-2 câu hỏi gợi mở thúc đẩy học sinh đào sâu (Question for reflection).
3. Gợi ý hành động tiếp theo hoặc thử thách nâng cao (Actionable next step).
4. Đánh giá sơ bộ điểm mạnh về 4Cs (Tư duy phản biện, Hợp tác, Giao tiếp, Sáng tạo).

Trả về định dạng JSON:
{
  "feedbackText": "Nội dung phản hồi chân thành, động viên...",
  "reflectionQuestion": "Câu hỏi gợi mở tiếp theo...",
  "suggestedSkillsToFocus": ["Hợp tác", "Sáng tạo"],
  "score4C": {
    "criticalThinking": 8,
    "collaboration": 9,
    "communication": 8,
    "creativity": 9
  }
}`;
    } else if (action === "suggest_tasks") {
      const { drivingQuestion, projectTitle, teamRoles } = payload;
      prompt = `Bạn là chuyên gia thiết kế quy trình làm việc PBL.
Dự án: "${projectTitle}"
Câu hỏi cốt lõi: "${drivingQuestion}"
Các vai trò trong nhóm: ${teamRoles ? teamRoles.join(", ") : "Leader, Researcher, Designer, Tech Lead"}

Hãy đề xuất 6-8 nhiệm vụ cụ thể cho Bảng Kanban (To-Do), mỗi nhiệm vụ gắn liền với:
- Tên nhiệm vụ
- Mô tả chi tiết
- Vai trò đề xuất phụ trách
- Kỹ năng 4C áp dụng (Tư duy phản biện / Hợp tác / Giao tiếp / Sáng tạo)
- Thuộc tính "Student Voice & Choice" (Cho phép học sinh tự do chọn hình thức thực hiện không).

Trả về JSON:
{
  "suggestedTasks": [
    {
      "title": "...",
      "description": "...",
      "assignedRole": "...",
      "skillTag": "Tư duy phản biện",
      "isVoiceAndChoice": true
    }
  ]
}`;
    } else {
      return res.status(400).json({ error: "Action không hợp lệ." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Error in Gemini PBL assistant API:", error);
    return res.status(500).json({
      error: error.message || "Lỗi khi kết nối với Gemini AI",
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PBL Server running on http://localhost:${PORT}`);
  });
}

startServer();
