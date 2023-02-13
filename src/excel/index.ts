const ExcelJS = require('exceljs');
const path = require('path');
import * as fs from 'fs';


import { IGroupedResult } from "../common/models"

export const generateExcel = async (data: IGroupedResult[], tournamentNames: string[]): Promise<void> => {

    const resultDirectoryPath: string = `${__dirname}/../../results`;

    const workBook = new ExcelJS.Workbook();
    const workSheet = workBook.addWorksheet('Results');

    workSheet.columns = [
        { key: 'date', header: 'Date' },
        { key: 'firstParticipant', header: 'First player' },
        { key: 'secondParticipant', header: 'Second player' },
        { key: 'firstTeam', header: 'First player team' },
        { key: 'secondTeam', header: 'Second player team' },
        { key: 'firstScore', header: 'First player score' },
        { key: 'secondScore', header: 'Second player score' },
        { key: 'tournamentName', header: 'Tournament' },
    ];

    data.forEach((item: IGroupedResult) => {
        workSheet.addRow(item);
    });

    tournamentNames.forEach((tournamentName: string) => {

        let tournamentWorkSheet = workBook.addWorksheet(tournamentName);
        
        tournamentWorkSheet.columns = [
            { key: 'date', header: 'Date' },
            { key: 'firstParticipant', header: 'First player' },
            { key: 'secondParticipant', header: 'Second player' },
            { key: 'firstTeam', header: 'First player team' },
            { key: 'secondTeam', header: 'Second player team' },
            { key: 'firstScore', header: 'First player score' },
            { key: 'secondScore', header: 'Second player score' },
            { key: 'tournamentName', header: 'Tournament' },
        ];

        data.filter((matchItem: IGroupedResult) => 
            matchItem.tournamentName.indexOf('202') === tournamentName.length + 1 && matchItem.tournamentName.includes(tournamentName)).forEach((filteredMatchItem: IGroupedResult) => {
                tournamentWorkSheet.addRow(filteredMatchItem);
            });
    
    });

    if (!fs.existsSync(resultDirectoryPath)) {
        fs.mkdirSync(resultDirectoryPath);
    }

    const exportPath: string = path.resolve(resultDirectoryPath, 'result.xlsx');

    await workBook.xlsx.writeFile(exportPath);
} 