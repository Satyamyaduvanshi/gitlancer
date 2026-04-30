import { Controller, Get, Param, Logger, InternalServerErrorException, Inject } from '@nestjs/common';
import { BountiesService } from './bounties.service';

@Controller('api/bounties')
export class BountiesController {
  private readonly logger = new Logger(BountiesController.name);

  // ⚡ THE FIX: Using your exact @Inject pattern!
  @Inject(BountiesService)
  private readonly bountiesService: BountiesService;

  @Get('user/:userId')
  async getUserBounties(@Param('userId') userId: string) {
    this.logger.log(`GET request received for /api/bounties/user/${userId}`);
    
    try {
      // this.bountiesService will no longer be undefined!
      const data = await this.bountiesService.getBountiesByUserId(userId);
      return data;
    } catch (error) {
      this.logger.error(`Failed to execute GET /api/bounties/user/${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve user bounties');
    }
  }
}