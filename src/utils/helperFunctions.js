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
    minimumFractionDigits: 4,
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

export function formatWeight(weight) {
    return Number(weight).toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 2} );
}

export function formatSwitch(key, value) {
    switch(typeof(value)) {
        case 'boolean':
                return <input className="form-check-input" type="checkbox" value="" disabled checked={value === true ? true : false }/>;
        case 'string':
            if (key === "ao_date" || key === "original_trade_date") {
                return value.slice(0, 10);
            } else if(key === "account_name") {
                return formatAccountName(value);
            } else {
                return value || null;
            }
        case 'number':
                if (key === "weight") {
                    return formatWeight(value);
                } else if (["accrued", "orig_face", "curent_face", "price", "mv", "mv_accrued", ""].includes(key)) {
                    return dollarFormatter.format(value);
                } else {
                    return numberFormatter.format(value) || null;
                }
        default:
                return value;
    }
}

//FUNCTION THAT CALCULATES MOST RECENT BUSINESS DAY (EXCLUDES WEEKENDS AND HOLIDAYS)
export function lastBusinessDay(date) {
    const prevDate = new Date(date);
    const prevDayOfWeek = prevDate.getDay();
    const weekDayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const holidayArr2023 = [
        "2023-01-02",//New Years (celebrated on Sunday, observed Monday)
        "2023-01-16",//MLK Day
        "2023-02-20",//President's Day
        "2023-05-29",//Memorial Day
        "2023-06-19",//Juneteenth National Independence Day
        "2023-07-04",//Independence Day
        "2023-09-04",//Labor Day
        "2023-10-09",//Columbus Day
        "2023-11-11",//Veteran's Day (celebrate Saturday)
        "2023-11-23",//Thanksgiving Day
        "2023-12-25",//Christmas Day
    ]
    
    console.log("Previous Date Object: ", prevDate);
    console.log("Previous Day of Week: ", weekDayArr[prevDayOfWeek], prevDayOfWeek);

    if(prevDayOfWeek === 0 || prevDayOfWeek === 6) {
        console.log("Previous Date has fallen on a weekend!")
        return lastBusinessDay(asDateString(prevDate));
    } else if( holidayArr2023.includes(asDateString(prevDate)) ) {
        console.log("Previous Date has fallen on a Federal Holiday!")
        return lastBusinessDay(asDateString(prevDate));
    }

    return asDateString(prevDate);
}

//Function is responsible for adding requests into cache
export async function addDataIntoCache(cacheName, url, response) {
    const data = new Response(JSON.stringify(response));

    if ('caches' in window) {
        caches.open(cacheName).then((cache) => {
            cache.put(url, data);
            console.log("Data added into cache!");
        });
    }
}

export function formatAccountName(accountString) {
    const dashIndex = accountString.indexOf("-");
    return accountString.slice(dashIndex + 2);
}

const unwantedElements = ["CCM_INTERNAL_SMA", "CCMNX-Adjusted", "Alternative Impact Fund - Cash Sleeve", "Alternative Impact Fund - FI Sleeve", "Equity Impact Core Fund", "Equity IMact SMID Fund", "Test Acct"];
/*
* Helper function is going to be used to find the indeces of unwanted variable using 
* formatAccount_name().
* Will take in the dropDownData as a parameter, which is an array.
* Returns an array of unwanted indices.
*/
export function removeUnwanteds(data) {
    let array = [];
    data.forEach((object, index) => {
        if (!unwantedElements.includes(object.name)) {
            array.push(object);
        }
    });
    
    return array;
}