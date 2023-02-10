const ExcelJS = require('exceljs');
const path = require('path');


import { IGroupedResult } from "../common/models"

export const generateExcel = async (data: IGroupedResult[]): Promise<void> => {

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

    const exportPath: string = path.resolve(__dirname, 'result.xlsx');

    await workBook.xlsx.writeFile(exportPath);
} 