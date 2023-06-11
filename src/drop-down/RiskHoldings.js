import React, { useState } from "react";
import { filterRiskAccounts, today, yesterday, formatter } from "../utils/helperFunctions";
import { getRiskHoldings } from "../api";
import DataTable from "react-data-table-component";
import ExpandedTable from "../data-table/ExpandedTable";
import MultiSelectMenu from "./MultiSelectMenu";
//NEED helper function for autocalculating yesterday's date.


//This component is responsible for displaying a drop down menu which may be used for sending requests,
//exporting selected accounts, etc.
function RiskHoldings({ tableData, dropDownData }) {
    //Initialize form inputs
    const initialFormState = {
        accounts: [],
        ao_date: yesterday(today()),
    };

    //Make state variable to track rows selected
    const [responseData, setResponseData] = useState(null);
    const [bodyReq, setBodyReq] = useState({...initialFormState});
    const rowsForSelect = dropDownData.map((account) => ({ 
        value: account.apx_portfolio_code,  
        label: account.name,
    }));

    //Handler functions declared here
    const handleMultiSelectChange = (values, actionMeta) => {
        //console.log("Action Meta:", actionMeta);
        if (values.length > 0) {
            //setSelected(values);//produces an array of objects
            setBodyReq({ ...bodyReq, accounts: filterRiskAccounts(values, dropDownData) })
        }
    };
    const handleMenuClose = async (actionMeta) => {
        if (bodyReq.accounts.length > 0) {
            console.log("Hit menu close");
            //console.log(selected)
            //const accountsArr = filterRiskAccounts(selected, dropDownData);
            console.log("Accounts Array: ", bodyReq.accounts);
            //if (accountsArr.length > 0) {
                //bodyReq.accounts =  [...accountsArr];
                console.log("Body Request: ", bodyReq);
                //setResponseData(await getRiskHoldings(bodyReq));
            //}
        }
    };
    const handleDateChange = ({target}) => {
        //console.log(target.value);
        setBodyReq({...bodyReq, ao_date: target.value })
        //bodyReq.ao_date = target.value;
        console.log("BodyReq Date: ", bodyReq);
    };
    const handleSearch = async (event) => {
        event.preventDefault();
        console.log("Hit Search");
        setResponseData(await getRiskHoldings(bodyReq));
    };

    //Set react-data table configurations here
    const columnHeaders = [
        { 
            name: "Account", 
            selector: (row) => row.account,
            sortable: true,
            maxWidth: "20px",
        },
        {
          name: "As Of Date",
          selector: (row) => row.ao_date,
          sortable: true,
          compact: true,
          maxWidth: "80px",
          format: (row) => row.ao_date.slice(0, 10),
        },
        { 
            name: "BBG Cusip", 
            selector: (row) => row.bbg_cusip, 
            sortable: true,
            maxWidth: "10px",
            compact: true,
        },
        {
          name: "Weight",
          selector: (row) => row.weight.toFixed(4),
          sortable: true,
          maxWidth: "3px",
          compact: true,
        },
        { 
            name: "Marketing Asset Group", 
            selector: (row) => row.MarketingAssetGroup, 
            sortable: true,
            minWidth: "170px",
            compact: true,
        },
        { 
            name: "Security Group", 
            selector: (row) => row.carlton_SecurityGroup, 
            sortable: true,
            compact: true,
            minWidth: "30px",
        },
        {
          name: "Security Type",
          selector: (row) => row.carlton_SecurityType,
          sortable: true,
          compact: true,
          minWidth: "141px",
        },
        {
          name: "Security Sector",
          selector: (row) => row.carlton_SecuritySector,
          sortable: true,
          compact: true,
          minWidth: "141px",
        },
        {
          name: "Tracker Security Type",
          selector: (row) => row.tracker_security_type,
          sortable: true,
          compact: true,
          minWidth: "151px",
        },
        {
          name: "Security Name",
          selector: (row) => row.sec_name,
          sortable: true,
          compact: true,
          minWidth: "160px",
          //format: (row) => row.sec_name,
        },
        {
          name: "Agg. Rating",
          selector: (row) => row.aggregate_rating,
          sortable: true,
          compact: true,
          maxWidth: "40px",

        },
        {
            name: "Quantity",
            selector: (row) => row.quantity,
            sortable: true,
            compact: true,
            maxWidth: "100px",
            format: (row) => formatter.format(row.quantity),
        }, 
        {
           name: "Original Face",
           selector: (row) => row.orig_face,
           sortable: true,
           compact: true,
           maxWidth: "100px",
           format: (row) => formatter.format(row.orig_face),
        },
        {
            name: "MV Accrued",
            selector: (row) => row.mv_accrued,
            sortable: true,
            compact: true,
            maxWidth: "100px",
            format: (row) => formatter.format(row.mv_accrued),
        },
        {
            name: "Holding Group",
            selector: (row) => row.holding_group,
            sortable: true,
            compact: true,
            minWidth: "100px",
        }
      ];
    const customStyles = {
        headRow: {
            style: {
                fontSize: "14px",
                color: "#1B3668",
                wordBreak: "break-word",
            },
        },
        headCells: {
            style: {
                paddingLeft: "2px",
            }
        },
        cells: {
            style: {
                paddingRight: "2px",
                paddingLeft: "2px"
            }
        },
        rows: {
            style: {
                fontSize: "13px",
                minHeight: "20px",
            }
        }
    }

    /* RENDERED ON UI */
    return (
        <div style={{ padding: "1% 4%", backgroundColor: "#F2F2F2", /*border: "solid 2px green"*/ }}>

            <form onSubmit={handleSearch}>
              
                <MultiSelectMenu rowsForSelect={rowsForSelect} handleMultiSelectChange={handleMultiSelectChange} handleMenuClose={handleMenuClose}/>
                <div className="input-group">
                    <label htmlFor="ao_date"></label>
                    <input className="form-control" id="ao_date" type="date" name="ao_date" onChange={handleDateChange} value={bodyReq.ao_date} pattern="\d{4}-\d{2}-\d{2}" placeholder="YYYY-MM-DD"/>
                    <button className="btn btn-primary" type="submit">Search</button>
                </div>  
            </form>
            {
                responseData && 
                <div>
                    <h3 style={{ backgroundColor: "#1B3668", color: "white", padding: "1% 1%" }} >Risk Holdings Account Details</h3>
                    <DataTable 
                        columns={columnHeaders}
                        data={responseData}
                        highlightOnHover
                        striped
                        customStyles={customStyles}
                        expandableRows
                        expandOnRowClicked
                        expandableRowsComponent={ExpandedTable}                        
                    />
                </div>
            }   
        </div> 
    )
    /*END OF RENDER */
}

export default RiskHoldings;