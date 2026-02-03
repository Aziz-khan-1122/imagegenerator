
import { GoogleGenAI } from "@google/genai";

/**
 * Generates an image based on the provided text prompt.
 * Uses gemini-2.5-flash-image which is the standard for fast generation.
 */
export const generateAIImage = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("AI API Key is missing. Please ensure your environment is configured.");
  }

  // Always create a new instance to ensure we use current context
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Images are returned as parts in the response candidate
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("The model did not return any image data. Try a different prompt.");
  } catch (error: any) {
    console.error("Image Generation Failure:", error);
    throw new Error(error.message || "Failed to generate your image.");
  }
};
