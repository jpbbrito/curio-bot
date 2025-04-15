import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { IUpdateTelegram } from './telegram.interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(@Body() body: IUpdateTelegram): object {
    console.log('body', body)
    return this.appService.getHello(body);
  }
}
