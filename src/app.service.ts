import { Injectable } from "@nestjs/common";
import axios, { AxiosResponse } from 'axios';
import * as moment from "moment";

import { IGroupedResult, IInputData, IMatchInfo, ITournamentsByDateItem } from "./common/models";
import { baseUrl, endpoints } from './common/constants';
import { prepareGetAllTournamentsDataParams } from "./common/helper";
import { generateExcel } from "./excel";

@Injectable()
export class AppService {

    async getAllFromDateByInput(input: IInputData): Promise<void> {

        const { year, month, day, tournamentNames } = input;

        const dateNow: moment.Moment = moment(new Date());
        const startDate: moment.Moment = moment([year, month - 1, day]);
        const iterationsNumber: number = dateNow.diff(startDate, 'days') + 1;
        const arrayOfIterations: number[] = [];

        for (let i = 0; i < iterationsNumber; i++) {
            arrayOfIterations.push(i);
        }

        var result: IGroupedResult[] = [];

        let currentDate: moment.Moment = startDate;

        for (const item of arrayOfIterations) {

            const used: number = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

            const { url, params } = prepareGetAllTournamentsDataParams(currentDate);

            console.log(`URl: ${url}`);
            console.log(`Params: ${JSON.stringify(params)}`);

            const response: AxiosResponse<{ totalPages: number, tournaments: ITournamentsByDateItem[] }> = await axios.get(url, {
                params
            });

            const preparedRequests: any[] = [];

            response.data.tournaments.forEach((tournament: ITournamentsByDateItem) => {
                const url: string = `${baseUrl}${endpoints.tournamentsByDates}/${tournament.id}/matches`;
                // console.log(url);
                preparedRequests.push(
                    axios.get(url));
            });


            const additionalPages: number[] = [];

            if (response.data.totalPages > 1) {
                for (let i = 1; i < response.data.totalPages; i++) {
                    additionalPages.push(i + 1);
                }
            }

            if (additionalPages.length) {
                for (const page of additionalPages) {
                    const { url, params } = prepareGetAllTournamentsDataParams(currentDate, page);

                    console.log(`URl: ${url}`);
                    console.log(`Params: ${JSON.stringify(params)}`);

                    const additionalPageResponse: AxiosResponse<{ totalPages: number, tournaments: ITournamentsByDateItem[] }> = await axios.get(url, {
                        params
                    });

                    additionalPageResponse.data.tournaments.forEach((tournament: ITournamentsByDateItem) => {
                        const url: string = `${baseUrl}${endpoints.tournamentsByDates}/${tournament.id}/matches`;
                        preparedRequests.push(
                            axios.get(url));
                    });


                }
            }

            const tournamentsByDayResult: PromiseSettledResult<{ data: IMatchInfo[] }>[] = await Promise.allSettled(preparedRequests);

            // console.log(tournamentsByDayResult);

            tournamentsByDayResult.forEach((tournamentsByDayResultItem: PromiseSettledResult<{ data: IMatchInfo[] }>) => {

                if (tournamentsByDayResultItem.status === 'fulfilled') {
                    tournamentsByDayResultItem.value.data.forEach((match: IMatchInfo) => {
                        result.push({
                            date: match.date,
                            firstParticipant: match.participant1.nickname,
                            secondParticipant: match.participant2.nickname,
                            firstTeam: match.participant1.team.token_international,
                            secondTeam: match.participant2.team.token_international,
                            firstScore: match.participant1.score,
                            secondScore: match.participant2.score,
                            tournamentName: match.tournament.token_international,
                        });
                    });
                } else {
                    // handle it later
                }
            });

            const usedAfter: number = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`Added to array. The script uses approximately ${Math.round(usedAfter * 100) / 100} MB`);


            currentDate = currentDate.add(1, 'days');
        }


        // 2023/01/10 05:00
        // 2023%2F01%2F10+05%3A00


        // 2023/01/10 20:59
        // 2023%2F01%2F10+20%3A59

        //NEED TO EXTRACT EACH DAY TOURNAMENTS









        // for (let j = 0; j < response.data.tournaments.length; j++) {

        // preparedRequests.push(new Promise())

        // NEED TO EXTRACT DATA FOE EACH TOURNAMENT

        // preparedRequests.push(
        //     axios.get(`${baseUrl}${endpoints.tournamentsByDates}/${response.data.tournaments[iterationValue].id}/matches`));

        // const matchesResponse: AxiosResponse = await axios.get(`${baseUrl}${endpoints.tournamentsByDates}/${response.data.tournaments[i].id}/matches`);

        // matchesResponse.data.forEach((item) => {
        //     result.push({
        //         date: item.date,
        //         firstParticipant: item.participant1.nickname,
        //         secondParticipant: item.participant2.nickname,
        //         firstScore: item.participant1.score,
        //         secondScore: item.participant2.score,
        //     });
        // });

        // const used: number = process.memoryUsage().heapUsed / 1024 / 1024;
        // console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        // }

        // console.log(`Prepared requests for each tournament for: ${currentDate}`);

        // const used: number = process.memoryUsage().heapUsed / 1024 / 1024;
        // console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

        // const tournamentsByDayResult: any[] = await Promise.allSettled(preparedRequests);

        // console.log(`Extracted data for each tournament for: ${currentDate}`);

        // tournamentsByDayResult.forEach((tournamentResults: any) => {

        //         tournamentResults.value.data.forEach((item) => {
        //             result.push({
        //                 date: item.date,
        //                 firstParticipant: item.participant1.nickname,
        //                 secondParticipant: item.participant2.nickname,
        //                 firstScore: item.participant1.score,
        //                 secondScore: item.participant2.score,
        //             });
        //         });
        // });

        // const usedAfter: number = process.memoryUsage().heapUsed / 1024 / 1024;
        // console.log(`Added to array. The script uses approximately ${Math.round(usedAfter * 100) / 100} MB`);

        await generateExcel(result, tournamentNames);
    }


}