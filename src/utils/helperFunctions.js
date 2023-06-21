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

export const dollarFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

export const numberFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
})

export function filterRiskAccounts(arrayOfRiskAccounts, json) {
    //const json = multiData;
    //match arrayOfApxCodes in json and return name
    const result = arrayOfRiskAccounts.map((account) => {
        let apxCode = "";

        for (let i=0; i < json.length; i++) {
            if (account.value === json[i].apx_portfolio_code) {
                apxCode = json[i].apx_portfolio_code;
                break;
            }
        }

        return apxCode;
    });

    return result;//SHOULD BE EDITED TO MAKE A CALL TO API `GET-RISK-HOLDINGS`
}
/**
 * Formats a Date object to YYYY-MM-DD
 * Not exported because the UI should generally avoid working directly with Date instances.
 * @param {Date Object} newDate 
 * instance of a date object
 * @returns {string}
 * specified date in the format YYYY-MM-DD
 */
function asDateString(newDate) {
    return `${newDate.getFullYear().toString(10)}-${(newDate.getMonth() + 1).toString(10).padStart(2, "0")}-${newDate.getDate().toString(10).padStart(2, "0")}`;
}

/**
 * Used to create today's date in the following format.
 * @returns {string}
 * today's date in the format YYYY-MM-DD
 */
export function today() {
    return asDateString(new Date());
}

export function yesterday(currentDate) {
    let [year, month, day] = currentDate.split("-");
    month -=1;
    const date = new Date(year, month, day);
    date.setMonth(date.getMonth());
    date.setDate(date.getDate() - 1);
    return asDateString(date);
}


export function splitTableIntoFour(dataRows) {
    let first, second, third, fourth;
    let m, n, o;

    m = Math.ceil(dataRows.length / 4);
    n = Math.ceil((2 * dataRows.length) / 4);
    o = Math.ceil((3 * dataRows.length) / 4);

    first = dataRows.slice(0, m);
    second = dataRows.slice(m, n);
    third = dataRows.slice(n, o);
    fourth = dataRows.slice(o, dataRows.length);

    return [first, second, third, fourth];
}