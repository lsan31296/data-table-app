/* This file represents the API we would be using to fetch our data from */
import data from './data-table/data.json';
import multiData from './data-table/multiSelectData.json';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/"

//Defines the default headers for these function to work with 'json-server'
const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append('Origin','http://localhost:3000');




/**
 * Fetch 'json' from the specified URL and handle error status codes and ignore 'AbortError's'
 * 
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
        if (payload.error) {
            return Promise.reject({ message: payload.error });
        }
        return payload.data;
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error(error.stack);
            throw error;
        }
        return Promise.resolve(onCancel);
    }
}

/**
 * 
 * @returns 
 */
export async function fetchData() {
    return data;
}

export async function getAccountDate(params, signal) {
    const url = new URL(`${API_BASE_URL}/get-account-date`);
    Object.entries(params).forEach(([key, value]) => 
        url.searchParams.append(key, value.toString())
    );
    console.log("URL:", url)
    return await fetchJson(url, { headers, signal }, [])
}

/**
 * This function will be used to send an HTTP request to fetch risk accounts names'
 * @param {*} array 
 * Array of apx codes in the following shape:
 * [
    {
      "value": "CRAIX",
      "label": "CRAIX"
    },
    {
      "value": "MaryReynoldsBabcock",
      "label": "MaryReynoldsBabcock"
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
export async function fetchRiskAccounts(arrayOfApxCodes) {
    const json = multiData;
    //match arrayOfApxCodes in json and return name
    const result = arrayOfApxCodes.map((code) => {
        let name = "";

        for (let i=0; i < json.length; i++) {
            if (code.value === json[i].apx_portfolio_code) {
                name = json[i].name;
                break;
            }
        }

        return name;
    });

    return result;
}