import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  getHello(): ReturnType<AppService['getHello']> {
    // If injection worked, this.appService won't be undefined
    return this.appService.getHello();
  }
}