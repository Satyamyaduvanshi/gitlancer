import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

@Injectable()
export class AiService {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  private model = this.genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  async auditPullRequest(diffUrl: string) {
    // 1. Fetch raw diff from GitHub
    const { data: diff } = await axios.get(diffUrl);

    const prompt = `
      Analyze this GitHub Diff for a bounty payout.
      Return ONLY a JSON object:
      {
        "score": number (1-10),
        "bountyUSDC": number (5-100),
        "reasoning": "short string"
      }
      DIFF: ${diff.substring(0, 15000)}
    `;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    const jsonString = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  }
}