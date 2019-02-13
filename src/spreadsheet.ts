//
// Sheet manipulation
//
function getSpreadSheet(sheetName: string) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(sheetName);
}

const getNextRow = (sheet) => {
  return sheet.getLastRow() + 1;
}

//export {
//  getSpreadSheet,
//  getNextRow
//}
//
//export const runTest = () => {
//  Logger.log('3333321111')
//}
//
