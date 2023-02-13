import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { AppService } from './app.service';
import { IInputData } from './common/models';

@Controller('parse')
export class AppController {

    constructor(private appService: AppService) { }

    @Post('fromDate')
    async getAllFromDateByInput(@Body() input: IInputData, @Res() res: FastifyReply): Promise<void> {
        await this.appService.getAllFromDateByInput(input);

        res.status(HttpStatus.OK).send();
    }
}