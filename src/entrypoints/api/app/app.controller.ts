import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AppService } from './app.service';

class InterpretCommandRequest{
  idGame: string; 
  idObject: string;
  idCommand:string;
  args: any;
}

@Controller('api')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/v1/hello-world')
	getHello(): string {
		return this.appService.getHello();
	}

  @Post('/v1/interpret-command')
  @HttpCode(HttpStatus.OK)
  interpretCommand(@Body() dto: any): Promise<null> {
    return this.appService.interpretCommand(dto);
  }
}
