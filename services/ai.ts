
import { GoogleGenAI } from "@google/genai";

/**
 * Utilitário para executar funções do Gemini com lógica de retry e recuo exponencial.
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isQuotaError = 
      error?.message?.includes('429') || 
      error?.status === 429 || 
      error?.message?.toLowerCase().includes('quota');
    
    if (isQuotaError && retries > 0) {
      console.warn(`Gemini API Quota hit. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 1.5);
    }
    throw error;
  }
}

export const isQuotaExceeded = (error: any): boolean => {
  return error?.message?.includes('429') || 
         error?.status === 429 || 
         error?.message?.toLowerCase().includes('quota');
};

export const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });
