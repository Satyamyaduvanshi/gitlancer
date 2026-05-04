import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  
  private model = this.genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { temperature: 0.2 } 
  });

  async auditPullRequest(diffUrl: string) {
    let retries = 3;
    let backoffDelay = 2000; // Start with a 2-second delay

    while (retries > 0) {
      try {
        // 1. Fetch raw diff from GitHub
        const { data: diff } = await axios.get(diffUrl);

        const prompt = `
          You are an elite, merciless Senior Security Auditor and Principal Engineer evaluating a GitHub Pull Request for a Web3 bounty platform.
          Your job is to analyze the provided Git Diff and determine a fair financial payout in USDC.

          CRITICAL RULES (ABSOLUTE COMPLIANCE REQUIRED):
          1. NO FREE MONEY: If the changes are purely to documentation (.md files), code comments, formatting, linting, or simple typo fixes, the bounty MUST be 0.
          2. NO MALICIOUS CODE: If you detect infinite loops, reentrancy vulnerabilities, exposed secrets, or broken logic, the bounty MUST be 0 and you must list the flags.
          3. REAL WORK ONLY: You only pay for functional code changes—frontend logic, backend services, database schemas, or smart contracts.

          BOUNTY RUBRIC:
          - 0 USDC: Trivial work (Docs, typos, formatting) or dangerous code.
          - 2-5 USDC: Minor bug fixes, simple UI component tweaks, minor CSS.
          - 5-15 USDC: Moderate features, API endpoint creation, complex state management.
          - 15-30 USDC: Major architectural additions, complex algorithmic logic, critical security patches, or Anchor/Rust smart contract development.

          Analyze the DIFF and return ONLY a valid JSON object matching this exact schema:
          {
            "isEligible": boolean, // false if trivial or dangerous
            "complexityScore": number, // 0-10 (0 for docs, 10 for genius-level code)
            "securityFlags": ["array of specific security warnings, empty if safe"],
            "bountyUSDC": number, // Must be 0 if isEligible is false
            "reasoning": "A concise, highly technical, 2-sentence explanation of the exact code changed and why this specific amount was awarded."
          }

          DIFF TO ANALYZE:
          ${diff.substring(0, 15000)}
        `;

        // 2. Generate Content
        const result = await this.model.generateContent(prompt);
        const text = result.response.text();

        // 3. Clean and Parse JSON
        const jsonString = text.replace(/```json|```/g, '').trim();
        const parsedAudit = JSON.parse(jsonString);

        // 4. Server-Side Sanity Checks
        if (parsedAudit.isEligible === false) {
          parsedAudit.bountyUSDC = 0; 
        }
        
        parsedAudit.bountyUSDC = Math.min(Math.max(parsedAudit.bountyUSDC, 0), 100);

        this.logger.log(`✅ Audit Complete: ${parsedAudit.bountyUSDC} USDC awarded. Reason: ${parsedAudit.reasoning}`);
        
        return parsedAudit;

      } catch (error: any) {
  
        if ((error?.status === 503 || error?.status === 429) && retries > 1) {
          this.logger.warn(`⚠️ Gemini API busy (Status: ${error.status}). Retrying in ${backoffDelay / 1000}s... (${retries - 1} tries left)`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          retries--;
          backoffDelay *= 2;
          continue;
        }

      
        if (error instanceof SyntaxError && retries > 1) {
          this.logger.warn(`⚠️ Gemini returned invalid JSON. Retrying... (${retries - 1} tries left)`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          retries--;
          continue;
        }

       
        this.logger.error('❌ Failed to audit PR entirely after retries', error);
        
        return {
          isEligible: false,
          complexityScore: 0,
          securityFlags: ["AI_AUDIT_FAILURE"],
          bountyUSDC: 0,
          reasoning: "The automated audit failed due to network congestion or parsing errors. Manual review required."
        };
      }
    }
  }
}