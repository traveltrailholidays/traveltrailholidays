import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';
import { apiDetailsI } from './interfaces/api-details.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('details')
  apiDetails(): apiDetailsI {
    return this.appService.apiDeatils();
  }
}
