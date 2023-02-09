import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { IGroupedResult, IInputData } from './common/models';

@Controller('parse')
export class AppController {

    constructor(private appService: AppService) { }

    @Post('fromDate')
    getAllFromDateByInput(@Body() input: IInputData): Promise<IGroupedResult[]> {
        return this.appService.getAllFromDateByInput(input);
    }
}