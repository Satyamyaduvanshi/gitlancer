import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private readonly appId = process.env.GITHUB_APP_ID;
  private readonly baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  private generateJwt(): string {
    // 🛡️ THE FIX: Reads the string from .env and replaces literal \n with actual newlines
    const rawKey = process.env.GITHUB_PRIVATE_KEY;
    if (!rawKey) throw new Error("Missing GITHUB_PRIVATE_KEY in .env");
    
    const privateKey = rawKey.replace(/\\n/g, '\n');

    const payload = {
      iat: Math.floor(Date.now() / 1000) - 60,
      exp: Math.floor(Date.now() / 1000) + (10 * 60),
      iss: this.appId,
    };
    return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  }

  private async getInstallationToken(installationId: string): Promise<string> {
    const token = this.generateJwt();
    const response = await axios.post(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {},
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } }
    );
    return response.data.token;
  }

  async getGithubUserInfo(installationId: string, username: string) {
    try {
      const token = await this.getInstallationToken(installationId);
      const response = await axios.get(`https://api.github.com/users/${username}`, {
        headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github+json' }
      });
      
      return {
        avatarUrl: response.data.avatar_url,
        name: response.data.name || username,
      };
    } catch (error) {
      this.logger.error(`❌ Failed to fetch GitHub profile for ${username}: ${error.message}`);
      return null;
    }
  }

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
        headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github+json' }
      });
      this.logger.log(`💬 Comment posted on PR #${prNumber}`);
    } catch (error) {
      this.logger.error(`❌ GitHub API Error: ${error.response?.data?.message || error.message}`);
    }
  }
}