import React, { useState } from "react";
import Select from "react-select";
import { fetchRiskAccounts } from "../api";
import multiSelectData from "../data-table/multiSelectData.json";

//This component is responsible for displaying a drop down menu which may be used for sending requests,
//exporting selected accounts, etc.

function DropwDownMenu({ tableData }) {
    //Make state variable to track rows selected
    const [selected, setSelected] = useState([]);
    const [responseData, setResponseData] = useState([]);
    //console.log(tableData)//data successfully pass down as prop

    const rowsForSelect = multiSelectData.map((account) => (
        { 
            value: account.apx_portfolio_code, 
            //label: account.issuer.slice(0, 12), 
            label: account.apx_portfolio_code,
        }
    ));

    const handleMultiSelectChange = (value, actionMeta) => {
        //console.log("Action Meta:", actionMeta);

        if (value.length >= 0) {
        //console.log(value);//produces an array of objects
        setSelected(value);
        /*
        console.log(`First Index Object:`, value[0]);
        console.log(`First Object Value property: ${value[0].value}`);
        */
        }
    }

    const handleMenuClose = async (value, actionMeta) => {
        console.log("Hit menu close");
        //console.log("Selected: ", selected);
        //Function send http request with parameters saved from state variable with updated values from 'handleMultiSelectChange()' 
        //http://localhost:5001/get-risk-accounts
        setResponseData(await fetchRiskAccounts(selected));
    }

    //console.log("Response: ", responseData);


    return (
        <Select
            isMulti
            name="issuers"
            options={rowsForSelect}
            className="basic-multi-select"
            classNamePrefix="select"
            theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: '#0d6efd',
                  primary: 'black',
                },
            })}
            styles={{
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  color: "black",
                }),
            }}
            onChange={handleMultiSelectChange}
            closeMenuOnSelect={false}
            onMenuClose={handleMenuClose}
        />
    )
}

export default DropwDownMenu;