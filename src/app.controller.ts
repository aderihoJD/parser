import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { IGroupedResult, IInputData } from './common/models';

@Controller('parse')
export class AppController {

    constructor(private appService: AppService) { }

    @Get('fromDate/:date')
    getAllFromDate(@Param('date') date: string): Promise<IGroupedResult[]> {
        console.log(date);
        return this.appService.getAllFromDate(date);
    }

    @Post('fromDate')
    getAllFromDateByInput(@Body() input: IInputData): Promise<IGroupedResult[]> {
        return this.appService.getAllFromDateByInput(input);
    }
}