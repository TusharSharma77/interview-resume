const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const {GoogleGenAI} = require("@google/genai");
const {z} = require("zod");
const {zodToJsonSchema} = require("zod-to-json-schema");
const ai = new GoogleGenAI({

  apiKey:
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY,
});

if (!process.env.GOOGLE_GENAI_API_KEY && !process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn("Gemini API key is not set. Check BACKEND/.env (GOOGLE_GENAI_API_KEY).");
}

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

function trimText(value, maxChars) {
  if (typeof value !== "string") return "";
  return value.length > maxChars ? value.slice(0, maxChars) : value;
}

function toQuestions(items = []) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (typeof item === "string") {
        return {
          question: item,
          intention: "Assess understanding and communication depth.",
          answer: "Explain with clear structure, practical examples, and trade-offs.",
        };
      }
      return {
        question: item?.question || "",
        intention: item?.intention || "Assess understanding and communication depth.",
        answer: item?.answer || "Explain with clear structure, practical examples, and trade-offs.",
      };
    })
    .filter((q) => q.question);
}

function normalizeMatchScore(value) {
  if (typeof value === "number") return Math.max(0, Math.min(100, Math.round(value)));
  if (typeof value === "string") {
    const fraction = value.match(/(\d+)\s*\/\s*(\d+)/);
    if (fraction) {
      const num = Number(fraction[1]);
      const den = Number(fraction[2]) || 10;
      return Math.max(0, Math.min(100, Math.round((num / den) * 100)));
    }
    const num = Number(value.replace(/[^\d.]/g, ""));
    if (!Number.isNaN(num)) {
      return Math.max(0, Math.min(100, Math.round(num)));
    }
  }
  return 60;
}

function toSkillGaps(items = []) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (typeof item === "string") {
        return { skill: item, severity: "medium" };
      }
      const severity = ["low", "medium", "high"].includes(item?.severity) ? item.severity : "medium";
      return { skill: item?.skill || "", severity };
    })
    .filter((s) => s.skill);
}

function toPreparationPlan(items = [], fallbackSkills = []) {
  if (Array.isArray(items) && items.length > 0) {
    return items.map((item, index) => ({
      day: Number(item?.day) || index + 1,
      focus: item?.focus || "Interview preparation",
      tasks: Array.isArray(item?.tasks) && item.tasks.length > 0 ? item.tasks : ["Revise key topics and practice answers."],
    }));
  }

  return [
    {
      day: 1,
      focus: "Core concepts revision",
      tasks: ["Review fundamentals from resume and job description.", "Prepare concise project explanations."],
    },
    {
      day: 2,
      focus: fallbackSkills[0]?.skill || "Technical practice",
      tasks: ["Solve practical problems.", "Practice trade-off based answers."],
    },
    {
      day: 3,
      focus: "Mock interview",
      tasks: ["Run a timed mock interview.", "Refine weak answers and examples."],
    },
  ];
}

function normalizeReportShape(raw) {
  const technicalQuestions = toQuestions(raw?.technicalQuestions);
  const behavioralQuestions = toQuestions(raw?.behavioralQuestions);
  const skillGaps = toSkillGaps(raw?.skillGaps);
  const safeTechnicalQuestions =
    technicalQuestions.length > 0
      ? technicalQuestions
      : [
          {
            question: "How does the Node.js event loop handle async I/O?",
            intention: "Assess backend runtime fundamentals.",
            answer: "Explain phases, non-blocking I/O, and practical implications in APIs.",
          },
        ];
  const safeBehavioralQuestions =
    behavioralQuestions.length > 0
      ? behavioralQuestions
      : [
          {
            question: "Tell me about a production issue you owned end-to-end.",
            intention: "Assess ownership and incident handling.",
            answer: "Use STAR, include root cause, actions, and prevention steps.",
          },
        ];
  const safeSkillGaps =
    skillGaps.length > 0 ? skillGaps : [{ skill: "Event loop deep dive", severity: "medium" }];

  return {
    title: raw?.title || raw?.report_title || "Interview Report",
    matchScore: normalizeMatchScore(raw?.matchScore),
    technicalQuestions: safeTechnicalQuestions,
    behavioralQuestions: safeBehavioralQuestions,
    skillGaps: safeSkillGaps,
    preparationPlan: toPreparationPlan(raw?.preparationPlan, safeSkillGaps),
  };
}

async function generateInterviewReport({resume, selfDescription, jobDescription}){
    const compactResume = trimText(resume, 3000);
    const compactSelfDescription = trimText(selfDescription, 500);
    const compactJobDescription = trimText(jobDescription, 1200);

    const prompt = `Return ONLY valid JSON for a very short interview summary.
Keep all text brief.
Use exactly 1 item in each array.
Keep every answer to 1 short sentence.
Schema:
{
  "matchScore": number (0-100),
  "technicalQuestions": [{ "question": string, "intention": string, "answer": string }],
  "behavioralQuestions": [{ "question": string, "intention": string, "answer": string }],
  "skillGaps": [{ "skill": string, "severity": "low" | "medium" | "high" }],
  "preparationPlan": [{ "day": number, "focus": string, "tasks": string[] }],
  "title": string
}

Return ONLY valid JSON. No markdown, no extra keys.

Candidate details:
Resume: ${compactResume}
Self Description: ${compactSelfDescription}
Job Description: ${compactJobDescription}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      maxOutputTokens: 220,
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  const rawText = response?.text ?? "";
  const parsed = (() => {
    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error("Gemini returned non-JSON output.");
    }
  })();

  const normalized = normalizeReportShape(parsed);
  const validated = interviewReportSchema.safeParse(normalized);
  if (!validated.success) {
    throw new Error("Gemini response did not match interview schema.");
  }

  return validated.data;
}

module.exports = {
    generateInterviewReport
}
