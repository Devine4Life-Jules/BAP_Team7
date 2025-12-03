const XLSX = require('xlsx');
const workbook = XLSX.readFile('./projecten.xlsx');
const sheetName = 'Uitleg voor studenten';
const worksheet = workbook.Sheets[sheetName];

const range = XLSX.utils.decode_range(worksheet['!ref']);

console.log('Sheet range:', worksheet['!ref']);
console.log('\n=== All content from "Uitleg voor studenten" tab ===\n');

for (let R = range.s.r; R <= range.e.r; ++R) {
    let row = '';
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({r: R, c: C});
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
            const value = String(cell.v).substring(0, 200); // Limit length
            row += value + ' | ';
        }
    }
    if (row.trim()) {
        console.log('Row', (R + 1) + ':', row);
    }
}
