import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private readonly appId = process.env.GITHUB_APP_ID;
  private readonly privateKeyPath = path.resolve(process.env.GITHUB_PRIVATE_KEY_PATH || './blinky-key.pem');

  // 🛡️ 1. Create a JWT to authenticate as the SOLUX App
  private generateJwt(): string {
    const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
    const payload = {
      iat: Math.floor(Date.now() / 1000) - 60,
      exp: Math.floor(Date.now() / 1000) + (10 * 60),
      iss: this.appId,
    };
    return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  }

  // 🛡️ 2. Get a temporary token for the specific repo installation
  private async getInstallationToken(installationId: string): Promise<string> {
    const token = this.generateJwt();
    const response = await axios.post(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {},
      { 
        headers: { 
          Authorization: `Bearer ${token}`, 
          Accept: 'application/vnd.github+json' 
        } 
      }
    );
    return response.data.token;
  }

  // 🛡️ 3. Generic method to post any comment to a PR
  async postComment(
    owner: string, 
    repo: string, 
    prNumber: number, 
    installationId: string, 
    body: string
  ) {
    try {
      const token = await this.getInstallationToken(installationId);
      const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;
      
      await axios.post(url, { body }, {
        headers: { 
          Authorization: `token ${token}`, 
          Accept: 'application/vnd.github+json' 
        }
      });
      this.logger.log(`💬 Comment posted on PR #${prNumber}`);
    } catch (error) {
      this.logger.error(`❌ GitHub API Error: ${error.response?.data?.message || error.message}`);
    }
  }
}