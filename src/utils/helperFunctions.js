import data from '../data-table/data.json'
import dayjs from "dayjs";
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

export function fileNameConstructor(hashMap, tabIndex) {
    const tabObj = hashMap[`tab${tabIndex}`];
    const view = tabObj.tableStyle[`${tabObj.req.positionView}`].title;
    const aggChoiceString = tabObj.req.aggregateRows;
    const accountArr = tabObj.req.accounts;
    //console.log("hashMap accounts", accountArr);
    let aggView;
    let accountList = "";


    switch(aggChoiceString) {
        case 'n':
            aggView = 'NoAgg'
            break;
        case 'y':
            aggView = 'AggByMarketAssetGRoup'
            break;
        case 'yg':
            aggView = 'AggByCarltonSecGroup'
            break;
        case 'yt':
            aggView = 'AggByCarltonSecType'
            break;
        case 'ys':
            aggView = 'AggByCarltonSecSector'
            break;
        default:
            console.log(`Not a valid aggregate choice: ${aggChoiceString}`);
    }

    if(accountArr.length > 0) {
        if(accountArr.length === 1) {
            accountList = accountArr[0];
        } else {
            accountList = accountArr.join(",");
        }
    }
    //console.log("Account List after forEach logic: ", accountList);
    let title = `Risk Holdings ${view}_${tabObj.req.aoDate}_${aggView}_for(${accountList})`;
    return title;
}

export const dollarFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

export const dollarFormatter0 = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: '0'
})

export const numberFormatter0 = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})

export const numberFormatter2 = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
export function asDateString(newDate) {
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
            if (key === "ao_date" || key === "original_trade_date" || key.includes("date")) {
                return value.slice(0, 10);
            } else if(key === "account_name") {
                return formatAccountName(value);
            } else {
                return value || <input className="form-check-input" type="checkbox" value="" disabled checked={value === true ? true : false }/>;;
            }
        case 'number':
                if (key === "weight") {
                    return formatWeight(value);
                } else if (["accrued", "orig_face", "curent_face", "price", "mv", "mv_accrued", ""].includes(key)) {
                    return dollarFormatter.format(value);
                } else {
                    return numberFormatter2.format(value) || null;
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

const unwantedElements = ["CCM_INTERNAL_SMA", "CCMNX-Adjusted", "Alternative Impact Fund - Cash Sleeve", "Alternative Impact Fund - FI Sleeve", "Equity Impact Core Fund", "Equity IMact SMID Fund", "Test Acct", "All CCM Accounts"];
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

/**
 * This function is used to remove a certain tab from an ordered hashMap. It then renames
 * every property after the deleted tab to maintain order.
 * @param {Integer} tabIndexToRemove
 * The index of the tab you'd like to remove. Starts from 0.
 * @param {Object} hash 
 * Object used as a hashMap to save necessary state data for a particular tab.
 * For Example:
 * hashMap = {
 *  tab0: {
 *      data: [],
 *      req: {...},
 *      tableStyle: {...}
 *  },
 *  tab1: {...},
 *  ...
 * }
 * @returns 
 */
export function removeAndRenamObjectProps(tabIndexToRemove, hash) {
    if (Object.entries(hash).length-1 === tabIndexToRemove) {
        delete hash[`tab${tabIndexToRemove}`];
        return hash;
    }

    const tempHash = {...hash};
    const tempHashLength = Object.entries(tempHash).length;

    for(let i=tabIndexToRemove; i<tempHashLength; i++) {
        if (i === tempHashLength-1) {
            delete tempHash[`tab${i}`]
            break;
        }
        tempHash[`tab${i}`] = {...tempHash[`tab${i+1}`]};
    }

    return tempHash;
}

export function dateFormatter(date) {
    if(date.includes('0001-01-01')) {
        return "";
    } else {
        return date.slice(0,10);
    }
}

export function sqlDateToDateString(date) {
    if(date === "") return;
    return dayjs(date).format("MM/DD/YYYY");
}

export function aggRowFilter(resData, aggregateRows) {
    let newResData = [];
    switch (aggregateRows) {
        case "n"://No Aggregate Rows
            newResData = resData;
            break;
        case "y"://Aggregate by Marketing Asset Group
            newResData = resData.filter((row) => row.sortOrder === 0 || row.sortOrder === 1 || row.sortOrder === 100);
            break;
        case "yg"://Agregate by Carlton Security Group
            newResData = resData.filter((row) => row.sortOrder === 0 || row.sortOrder === 1 || row.sortOrder === 2
            || row.sortOrder === 100);
            break;
        case "yt"://Aggregate by Carlton Security Type
            newResData = resData.filter((row) => row.sortOrder === 0 || row.sortOrder === 1 || row.sortOrder === 2 
            || row.sortOrder === 3 || row.sortOrder === 100);
            break;
        case "ys"://Aggregate by Carlton Security Sector
            newResData = resData.filter((row) => row.sortOrder === 0 || row.sortOrder === 1 || row.sortOrder === 2 
            || row.sortOrder === 3 || row.sortOrder === 4 || row.sortOrder === 100);
            break;
        default:
            console.log(`Ran out of Aggregate Row options for: ${aggregateRows}`);
    }

    return newResData;
}

export function moveElementInArray(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

export const dateSorterMMDDYYY = (rowA, rowB) => {
    const a = sqlDateToDateString(dateFormatter(rowA.aoDate));
    const b = sqlDateToDateString(dateFormatter(rowB.aoDate));

    let aa = a.split('/');
    let bb = b.split('/');
    console.log(`Comparing a: ${aa} to b: ${bb}.`);
    console.log(`${aa[2] - bb[2]}, ${aa[1] - bb[1]}, ${aa[0] - bb[0]}`);

    return aa[2] - bb[2] || aa[0] - bb[0] || aa[1] - bb[1];
}