/* This file represents the API we would be using to fetch our data from */
import data from './data-table/data.json';

export async function fetchData() {
    return data;
}