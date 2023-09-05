/* This file represents the API we would be using to fetch our data from */
import data from './data-table/data.json';
//import multiData from './data-table/multiSelectData.json';

/* UNCOMMENT FIRST LINE FOR DEV, UNCOMMENT SECOND LINE FOR PUSHING BUILD INTO PRODUCTION */
//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const API_BASE_URL = "http://ccm-web01:5000";

//Defines the default headers for these function to work with 'json-server'
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch 'json' from the specified URL and handle error status codes and ignore 'AbortError's'
 * @param URL
 * the url for the request
 * @param options
 * any options for fetch
 * @param onCancel
 * value to return if fetch call is aborted. Default value is defined
 * @returns {Promise<Error|any>}
 * a promise that resolves to the 'json' data or an error
 * If the response is not in the 200 - 399 range the promise is rejected
 */
async function fetchJson(URL, options, onCancel) {
    try {
        const response = await fetch(URL, options);
        if (response.status === 204) {
            return null;
        }

        const payload = await response.json();
        console.log("Payload: ", payload);
        if (payload.error) {
            return Promise.reject({ message: payload.error });
        }
        return payload;
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error(error.stack);
            throw error;
        }
    }
    return Promise.resolve(onCancel);
}

/**
 * Test API call
 * @returns 
 */
export async function fetchData() {
    return data;
}

/**
 * Used for the middle-tier's `get-account-date` api
 * @param {*} params 
 * Any parameters that should go into the query string when making the call to server. 
 * such as, id = 12 and open_date = 2019-03-26 will be turned into a query string.
 * @param {*} signal 
 * Optional signal for a new AbortController if a cancel button is involved.
 * @returns {Array[Object]}
 * May return and array of one or more account object with various related data fields
 */
export async function getAccountDate(params, signal) {
    const url = new URL(`${API_BASE_URL}/get-account-date`);
    Object.entries(params).forEach(([key, value]) => 
        url.searchParams.append(key, value.toString())
    );
    const options = {
        headers,
    }
    //console.log("URL:", url)
    return await fetchJson(url, options)
}

/**
 * Use to get all accounts from middle-tier's `get-accounts' api
 * @param {*} signal 
 * Options signal for a new AortController if a cancel button is involved.
 * @returns {Array[Objects]}
 * All json data in an array of objects
 */
export async function getAllAccounts(signal) {
    const url = `${API_BASE_URL}/get-accounts`;
    return await fetchJson(url, signal, []);
}

/**
 * This function will be used to send an HTTP request to fetch risk accounts names'
 * @param {*} signal 
 * Optional signal for AbortController if necessary.
 * [
    {
    "value": "CRAIX",
    "label": ""//Full Name
    },
    {
    "value": "MaryReynoldsBabcock",
    "label": ""//Full Name
    },
 * ] 
 * @returns {Array.prototype} 
 * [
    {
    "name": "(CRAIX) - CCM Community Impact Bond Fund",
    "apx_portfolio_code": "CRAIX"
    },
    {
    "name": "(MRBF) - The Mary Reynolds Babcock Foundation",
    "apx_portfolio_code": "MaryReynoldsBabcock"
    },
 * ] 
 * 
 */
export async function fetchAllRiskAccounts(signal) {
    const url = `${API_BASE_URL}/get-risk-accounts`;
    return await fetchJson(url, signal);
}

export async function getRiskHoldings(params, signal) {
    const url = new URL(`${API_BASE_URL}/get-risk-holdings`);
    const options = {
        method: "POST",
        headers,
        body: JSON.stringify(params),
        signal,
    }
    return await fetchJson(url, options);
}

export async function getBusinessDay(params) {
    //console.log("Params: ", params);
    const url = new URL(`${API_BASE_URL}/get-next-business-day`);
    Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
    );
    return await fetchJson(url, {headers}, []);
}
/**
 * Returns data regarding a particular trade specified by account and cusip.
 * @param {*} params
 * Object containing key and value pair(s) set to parameter and value of parameter, respectively. 
 * @returns {JSON}
 * JSON of response from HTTP request. Should have 24 fields regarding that particular trade for that account.
 */
export async function getUspTrade(params) {
    //console.log("Params: ", params);
    const url = new URL(`${API_BASE_URL}/get-usp-trades`);
    Object.entries(params).forEach(([key, value]) => 
        url.searchParams.append(key, value.toString())
    );
    //console.log(url);
    return await fetchJson(url, {headers}, []);
}

export async function getSecurityDetail(params) {
    const url = new URL(`${API_BASE_URL}/get-security-detail`);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString())
    });
    return await fetchJson(url, {headers}, []);
}

export async function getPriceHistory(params) {
    const url = new URL(`${API_BASE_URL}/get-price-history`);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString())
    });
    return await fetchJson(url, {headers}, []);
}

export async function getShowLoans(params) {
    const url = new URL(`${API_BASE_URL}/get-show-loans`);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString())
    });
    return await fetchJson(url, {headers}, []);
}

export async function getAccountDetails(params) {
    const url = new URL(`${API_BASE_URL}/get-account-details`);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString())
    })
    return await fetchJson(url, {headers}, []);
}