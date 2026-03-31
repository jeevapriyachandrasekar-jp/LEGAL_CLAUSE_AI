import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Clause } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeContract(text: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        text: `Analyze the following legal contract. 
        1. Segment the text into key clauses.
        2. For each clause, provide:
           - Category (Termination, Liability, Indemnity, Confidentiality, Payment, Arbitration, Force Majeure, etc.)
           - Risk Level (Low, Medium, High)
           - Risk Explanation (Why is it risky? Look for red flags like "unlimited liability", "penalty", "automatic renewal", "non-compete", "sole discretion", etc.)
           - Simplified Explanation (Plain English for a non-lawyer)
        3. Provide a brief overall summary of the contract.

        Contract Text:
        ${text.slice(0, 30000)}
        `,
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          clauses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                originalText: { type: Type.STRING },
                simplifiedText: { type: Type.STRING },
                category: { type: Type.STRING },
                riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                riskExplanation: { type: Type.STRING },
              },
              required: ["id", "originalText", "simplifiedText", "category", "riskLevel", "riskExplanation"],
            },
          },
          summary: { type: Type.STRING },
        },
        required: ["clauses", "summary"],
      },
    },
  });

  const result = JSON.parse(response.text);
  return result;
}

export async function askContractQuestion(
  question: string,
  contractText: string,
  clauses: Clause[]
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        text: `You are a legal assistant. Answer the following question based on the provided contract text and analyzed clauses.
        
        Question: ${question}
        
        Contract Summary: ${contractText.slice(0, 5000)}
        
        Analyzed Clauses:
        ${JSON.stringify(clauses.slice(0, 20), null, 2)}
        `,
      },
    ],
    config: {
      systemInstruction: "Provide concise, accurate legal answers based ONLY on the provided text. If the information is not present, say you don't know.",
    },
  });

  return response.text;
}
