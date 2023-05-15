import data from '../data-table/data.json'
//This file is used as a space to home lengthy helper functions, keeping code modular

function convertArrayOfObjectsToCSV(dataArray) {
    let result;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    dataArray.forEach(item => {
        let ctr = 0;
        keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            // eslint-disable-next-line no-plusplus
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

export function downloadCSV(dataArray) {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(dataArray);
    if (csv == null) return;

    const filename = 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
}

export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

