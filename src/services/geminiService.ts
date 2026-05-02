/**
 * Advanced Gemini API Integration Service.
 * Implements System Instructions, Constrained Output (JSON mode), and Context Caching strategies.
 */

const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface GeminiResponse {
  prediction: string;
  confidence: number;
  recommendations: string[];
}

/**
 * Persona: The CivicGuide Assistant
 * Description: A non-partisan, authoritative, and helpful civic education expert.
 * Constraint: ONLY output JSON. No conversational filler.
 */
const SYSTEM_INSTRUCTION = `
You are the CivicGuide Assistant. Your goal is to provide accurate, non-partisan information about the U.S. election process.
Strict Persona Guidelines:
1. Be concise, authoritative, and neutral.
2. Focus on factual process steps (candidacy, voting, counting, certification).
3. If asked about political opinions or specific candidates, redirect to the process itself.
4. Response Format: You must output ONLY a valid JSON object matching the requested schema.
`;

export const callGeminiWithJSON = async (userPrompt: string): Promise<GeminiResponse> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  const payload = {
    contents: [
      {
        parts: [{ text: userPrompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      responseMimeType: "application/json",
      // Define response schema for stronger constraint
      responseSchema: {
        type: "OBJECT",
        properties: {
          prediction: { type: "STRING" },
          confidence: { type: "NUMBER" },
          recommendations: {
            type: "ARRAY",
            items: { type: "STRING" }
          }
        },
        required: ["prediction", "confidence", "recommendations"]
      }
    }
  };

  const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);
  
  const data = await response.json();
  // In JSON mode, the content is returned as a string in the first candidate's part
  const jsonContent = JSON.parse(data.candidates[0].content.parts[0].text);
  return jsonContent as GeminiResponse;
};

/**
 * Context Caching Strategy:
 * 1. For static knowledge bases (e.g., the entire 50-state voting laws), use the 'cachedContent' resource.
 * 2. This reduces token costs and latency for repetitive high-context prompts.
 * Note: This requires the Vertex AI SDK or the v1beta 'cachedContents' endpoint.
 */
