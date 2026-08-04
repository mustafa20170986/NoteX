import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;
  private sessions = new Map<string, any>();
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI,
    });
  }
  async getresponse(sessionId: string, prompt: string, content?: string) {
    try {
      let chat = this.sessions.get(sessionId);
      if (!chat) {
        if (!content) {
          return { message: 'inital body is required' };
        }
      }
      chat = this.ai.chats.create({
        model: 'gemini-3.6-flash',
        config: {
          systemInstruction: `you are an ai assistant helping with a 
          specific note here is the reference: \n\n${content}`,
        },
      });

      this.sessions.set(sessionId, chat);
      const sendprompt = await chat.sendMessage({
        message: prompt,
      });
      return { text: sendprompt.text };
    } catch (error) {
      console.log(error);
    }
  }
}
