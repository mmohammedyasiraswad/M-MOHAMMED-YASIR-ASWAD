import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "./types";

// Fix: Strictly initialize GoogleGenAI with process.env.API_KEY as per coding guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "Short summary of the feedback" },
    sentimentScore: { type: Type.NUMBER, description: "0-100 score of sentiment" },
    sentimentLabel: { type: Type.STRING, description: "Positive, Neutral, or Negative" },
    emotions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of emotions: Happy, Angry, Frustrated, Satisfied, Confused"
    },
    keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    keyIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING, description: "UI/UX, Performance, Content, Support, Pricing" },
          priority: { type: Type.STRING, description: "High, Medium, Low" },
          actionItems: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "description", "category", "priority", "actionItems"]
      }
    }
  },
  required: ["summary", "sentimentScore", "sentimentLabel", "emotions", "keywords", "keyIssues", "suggestions"]
};

export async function analyzeFeedback(text: string): Promise<AnalysisResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following user feedback and provide structured insights: \n\n ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert user feedback analyst. Your goal is to provide deep, actionable insights from raw user comments. Be critical but constructive."
      },
    });

    const data = JSON.parse(response.text);
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
}