//This component is responsible for displaying account based on account id and open_date

import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { getAccountDate } from "../api";

function AccountDateTable() {
    const initialFormState = {
        id: "",
        open_date: ""
    }
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [accountData, setAccountData] = useState(initialFormState);
    const [apiResponse, setApiResponse] = useState(null);
    //const [params, setParams] = useState();


    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Successfully Submitted!", accountData)
        const response = await getAccountDate(accountData);
        //console.log(response);
        setApiResponse(response);
        setIsSubmitted(true);
        console.log(apiResponse);
    };

    const handleChange = ({ target }) => {
        setAccountData({
            ...accountData,
            [target.name]: target.value,
        })
        //console.log(accountData)
    }

    const handleClear = ({ target }) => {
        setIsSubmitted(false);
        setAccountData(initialFormState);
    }
    /*
    useEffect(() => {
        getAccountDate([accountData.id, accountData.open_date]).then((response) => console.log(response));
    }, [isSubmitted]);
    */
    
    const columnHeaders = null;


    return (
        <main>
            <h1>Account Search</h1>
            <form onSubmit={handleSubmit}>
                <div className="row account-date-row mx-2">
                    <div className="col form-group">
                        <label className="form-label" htmlFor="id">
                            Account ID 
                        </label>
                        <input className="form-control" placeholder="Place ID here" id="id" name="id" value={accountData.id} onChange={handleChange} required={true} />
                    </div>
                    <div className="col form-group">
                        <label className="form-label" htmlFor="open_date">
                            Open Date
                        </label>
                        <input className="form-control" placeholder="YYYY-MM-DD" id="open_date" name="open_date" value={accountData.open_date} onChange={handleChange} required={true} />
                    </div>
                </div>
                    <button type="submit" className="btn btn-primary ms-3">Submit</button>
                    <button type="button" className=" btn btn-secondary ms-1" onClick={handleClear}>Clear Fields</button>
            </form>
            
            {
                isSubmitted && 
                <DataTable 
                columns={columnHeaders}
                />
            }
        </main>
        
    )
}

export default AccountDateTable;