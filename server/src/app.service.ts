import { Injectable } from '@nestjs/common';
import { apiDetailsI } from './interfaces/api-details.interface';

@Injectable()
export class AppService {
  apiDeatils(): apiDetailsI {
    return {
      name: 'TTH Server',
      version: '1.0.0',
      description: 'This is the Travel Trail Holidays (TTH) Server which provide the REST APIs',
      status: 'Running',
      created_by: 'Diwakar Jha',
    };
  }
}
