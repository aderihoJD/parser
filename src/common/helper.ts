import * as moment from "moment";
import { baseUrl, endpoints } from "./constants";

export const prepareGetAllTournamentsDataParams = (date: moment.Moment, page: number = 1): {
    url: string,
    params: Record<string, any>
} => {

    return {
        params: {
            page,
            dateFrom: `${date.format().substr(0, 4)}/${date.format().substr(5, 2)}/${date.format().substr(8, 2)} 05:00`,
            dateTo: `${date.format().substr(0, 4)}/${date.format().substr(5, 2)}/${date.format().substr(8, 2)} 20:59`,
        },
        url: `${baseUrl}${endpoints.tournamentsByDates}`
    };
}