
import { GoogleGenAI } from "@google/genai";

export const generateSiteVideo = async (projectType: string): Promise<string> => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `A cinematic, high-definition drone shot of a massive active ${projectType} construction site, cranes moving, workers in high-visibility gear, sunlight reflecting off structure, professional architecture cinematography.`;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed - no URI returned");

  // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
  return `${downloadLink}&key=${process.env.API_KEY}`;
};
