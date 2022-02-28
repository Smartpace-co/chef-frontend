import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
    providedIn: 'root'
})
export class ExcelService {
    constructor() { }
    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, { dateNF: 'YYYY-MM-DD' });
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }


    public exportMuliSheetExcelFile(json: any[], sheet2Json: any[], firstSheetName, SecondSheetName, excelFileName: string): void {

        /* create a new blank workbook */
        var wb = XLSX.utils.book_new();

        /* create a worksheet for books */
        var wsBooks = XLSX.utils.json_to_sheet(json);

        /* Add the worksheet to the workbook */
        XLSX.utils.book_append_sheet(wb, wsBooks, firstSheetName);

        /* create a worksheet for person details */
        var wsPersonDetails = XLSX.utils.json_to_sheet(sheet2Json);

        /* Add the worksheet to the workbook */
        XLSX.utils.book_append_sheet(wb, wsPersonDetails, SecondSheetName);

        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }
}
