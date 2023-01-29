import { Injectable } from "@nestjs/common";
import axios, { AxiosResponse } from 'axios';
import moment = require("moment");

import { IGroupedResult, IInputData } from "./common/models";
import { baseUrl, endpoints } from './common/constants';

@Injectable()
export class AppService {


    private readonly groupedResult: IGroupedResult[] = [];

    async getAllFromDate(date: string): Promise<IGroupedResult[]> {

        console.log(`will extract from date: ${date}`);

        return;
    }

    async getAllFromDateByInput(input: IInputData): Promise<IGroupedResult[]> {

        const { year, month, day } = input;

        const dateNow: moment.Moment = moment(new Date());
        const startDate: moment.Moment = moment([year, month - 1, day]);

        const iterationsNumber: number = dateNow.diff(startDate, 'days') + 1;

        // console.log(iterationsNumber);

        let currentDate: moment.Moment = startDate;

        var result: IGroupedResult[] = [];


        for (let i = 0; i < iterationsNumber; i++) {

            console.log(currentDate);

            // 2023/01/10 05:00
            // 2023%2F01%2F10+05%3A00


            // 2023/01/10 20:59
            // 2023%2F01%2F10+20%3A59

            const params: any = {
                page: 1,
                dateFrom: `${currentDate.format().substr(0, 4)}/${currentDate.format().substr(5, 2)}/${currentDate.format().substr(8, 2)} 05:00`,
                dateTo: `${currentDate.format().substr(0, 4)}/${currentDate.format().substr(5, 2)}/${currentDate.format().substr(8, 2)} 20:59`,
            };

            const response: AxiosResponse<{ totalPages: number, tournaments: any[] }> = await axios.get(`${baseUrl}${endpoints.tournamentsByDates}`, {
                params
            });

            const preparedRequests: any[] = []; 

            for (let j = 0; j < response.data.tournaments.length; j++) {

                // preparedRequests.push(new Promise())

                const matchesResponse: AxiosResponse = await axios.get(`${baseUrl}${endpoints.tournamentsByDates}/${response.data.tournaments[i].id}/matches`);
                
                matchesResponse.data.forEach((item) => {
                    result.push({
                        date: item.date,
                        firstParticipant: item.participant1.nickname,
                        secondParticipant: item.participant2.nickname,
                        firstScore: item.participant1.score,
                        secondScore: item.participant2.score,
                    });
                });

                const used: number = process.memoryUsage().heapUsed / 1024 / 1024;
                console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
            }

            // const allResults: any[] = 

            currentDate = currentDate.add(1, 'days');
        }

        return result;
    }


}