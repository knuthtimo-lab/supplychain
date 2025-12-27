
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Analyzes news about a supplier using search grounding.
 */
export const analyzeSupplierNews = async (supplierName: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the latest compliance and ESG related news for the company "${supplierName}". Identify potential risks such as labor violations, environmental issues, corruption, or sanctions.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    text: response.text,
    sources: groundingChunks,
  };
};

/**
 * Parses CSV text content into structured Supplier objects using LLM for smart mapping.
 */
export const parseSupplierCSV = async (csvText: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse the following CSV data into a JSON array of supplier objects. 
    Required fields: name, country, industry. 
    Optional fields: legalName, address, city, annualVolume.
    
    CSV Data:
    ${csvText}
    
    Return ONLY a valid JSON array.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            legalName: { type: Type.STRING },
            country: { type: Type.STRING },
            industry: { type: Type.STRING },
            address: { type: Type.STRING },
            city: { type: Type.STRING },
            annualVolume: { type: Type.NUMBER },
          },
          required: ["name", "country", "industry"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse JSON from Gemini", e);
    return [];
  }
};

/**
 * Validates questionnaire responses for consistency and risk.
 */
export const validateQuestionnaireResponse = async (responses: Record<string, string>) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `As an ESG compliance auditor, evaluate these questionnaire responses for truthfulness, consistency, and risk.
    
    Responses:
    ${JSON.stringify(responses, null, 2)}
    
    Provide an overall compliance score (0-100) and highlight any red flags or inconsistencies.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.INTEGER, description: "Compliance score from 0-100" },
          feedback: { type: Type.STRING, description: "Summary of red flags or positive findings" },
          inconsistencies: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of identified inconsistencies"
          }
        },
        required: ["score", "feedback", "inconsistencies"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Performs a deep risk assessment using thinking mode for complex reasoning.
 */
export const performDeepRiskAssessment = async (supplierData: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `As a professional supply chain compliance officer, perform a deep risk assessment for the following supplier:
    ${JSON.stringify(supplierData, null, 2)}
    
    Evaluate potential CSDDD violations and provide 3-5 concrete action recommendations.`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
    },
  });

  return response.text;
};

/**
 * Generates audio speech for an alert summary.
 */
export const generateAlertSpeech = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Attention compliance officer: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Audio generation failed");
  return base64Audio;
};

/**
 * Extracts supplier data from a raw text/image/PDF content (OCR-like).
 */
export const extractSupplierFromImage = async (base64Data: string, mimeType: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
      {
        text: "Extract all business information from this document. Return JSON with fields: name, legalName, country, address, industry, registrationNumber.",
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          legalName: { type: Type.STRING },
          country: { type: Type.STRING },
          address: { type: Type.STRING },
          industry: { type: Type.STRING },
          registrationNumber: { type: Type.STRING },
        },
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Simple chat helper for the compliance assistant.
 */
export const startComplianceChat = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are SupplyGuard Assistant, a professional ESG and supply chain compliance expert. You help users navigate CSDDD and other EU regulations. Be precise, professional, and focus on risk mitigation.",
    },
  });
};
