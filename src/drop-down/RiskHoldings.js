import React, { useState } from "react";
import { filterRiskAccounts, today, dollarFormatter, numberFormatter, formatWeight, lastBusinessDay, addDataIntoCache} from "../utils/helperFunctions";
import { getRiskHoldings } from "../api";
import DataTable from "react-data-table-component";
import ExpandedTable from "../data-table/ExpandedTable";
import MultiSelectMenu from "./MultiSelectMenu";
import ExportCSV from "../ExportCSV";

//This component is responsible for displaying a drop down menu which may be used for sending requests,
//exporting selected accounts, etc.
function RiskHoldings({ tableData, dropDownData, handleSearch }) {
    //Initialize form inputs
    const initialFormState = {
        accounts: [],
        aoDate: lastBusinessDay(today()),
        positionView: "TD",
        aggregateRows: "n",
    };

    //Make state variable to track rows selected
    const [responseData, setResponseData] = useState(null);
    const [bodyReq, setBodyReq] = useState({...initialFormState});
    const rowsForSelect = dropDownData.map((account) => ({ 
        value: account.apx_portfolio_code,  
        label: account.name,
    }));
    const dataTableStyles = {
        TD: {
            title: "Trade Date",
            bannerColor: "#1B3668",
            aggMaGroupRowColor: "#9ad4e6"
        },
        SD: {
            title: "Settlement Date",
            bannerColor: "#0b850d",
            aggMaGroupRowColor: "#c1f7c2"
        },
        ID: {
            title: "Trade Date Intraday",
            bannerColor: "#e37005",
            aggMaGroupRowColor: "#edd2b9"
        },
        LT: {
            title: "Lot-Level Trade Date",
            bannerColor: "#590396",
            aggMaGroupRowColor: "#ce98f5"
        }
    }
    //Handler functions declared here
    const handleMultiSelectChange = (values, actionMeta) => {
        //console.log("Action Meta:", actionMeta);
        setResponseData(null);
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
        setResponseData(null);
        setBodyReq({...bodyReq, aoDate: target.value })
        //bodyReq.aoDate = target.value;
        //console.log("BodyReq Date: ", bodyReq);
    };
    const handleRadioButtonClick = ({ target }) => {
        setResponseData(null);
        setBodyReq({...bodyReq, positionView: target.value })
        //console.log("BodyReq View: ", bodyReq.positionView);
    };
    const handleSearchButton = async (event) => {
        event.preventDefault();
        console.log("Hit Search: ", bodyReq);
        //add coniditional for type of view from radio button
        const resData = await getRiskHoldings(bodyReq);
        setResponseData(resData);
        //If resData exists
        if (resData.length > 0) {
            //then add bodyReq json into cache name, resData into cache data
            await addDataIntoCache(JSON.stringify(bodyReq), "http://localhost:3000/", resData);
            console.log("Done data caching!");
        }
    };
    const handleAggSwitchChange = ({ target }) => {
        setResponseData(null);
        if (target.checked) {
            console.log("Checked");
            setBodyReq({ ...bodyReq, aggregateRows: target.value });
        } else {
            console.log("Not Checked");
            setBodyReq({ ...bodyReq, aggregateRows: "n" });
        }
        //console.log("Hit Agg Switch: ", bodyReq)
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
            selector: (row) => formatWeight(row.weight),
            sortable: true,
            maxWidth: "3px",
            compact: true,
        },
        { 
            name: "Marketing Asset Group", 
            selector: (row) => row.marketingAssetGroup, 
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
            format: (row) => numberFormatter.format(row.quantity),
        }, 
        {
            name: "Original Face",
            selector: (row) => row.orig_face,
            sortable: true,
            compact: true,
            maxWidth: "100px",
            format: (row) => dollarFormatter.format(row.orig_face),
        },
        {
            name: "MV Accrued",
            selector: (row) => row.mv_accrued,
            sortable: true,
            compact: true,
            maxWidth: "100px",
            format: (row) => dollarFormatter.format(row.mv_accrued),
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
    //Set conditional row styles for aggregate row
    const conditionalRowStyles = [
        {
            when: row => row.weight >= 0.9,
            style: {
                fontWeight: 700
            }
        },
        {
            when: row => row.weight < 0.9 && row.aggregate_rating === "" && row.sec_name === "",
            style: {
                backgroundColor: `${dataTableStyles[bodyReq.positionView].aggMaGroupRowColor}`
            }
        }
    ]

    /* RENDERED ON UI */
    return (
        <div style={{ padding: responseData ? "30px 4% 100px 4%" :"1% 4%" , backgroundColor: "#F2F2F2",  /*border: "solid 2px green"*/ }}>

            <form onSubmit={handleSearchButton}>
                <MultiSelectMenu rowsForSelect={rowsForSelect} handleMultiSelectChange={handleMultiSelectChange} handleMenuClose={handleMenuClose}/>
                
                <div className="input-group">
                    <label htmlFor="aoDate"></label>
                    <input className="form-control" id="aoDate" type="date" name="aoDate" onChange={handleDateChange} value={bodyReq.aoDate} pattern="\d{4}-\d{2}-\d{2}" placeholder="YYYY-MM-DD"/>
                    
                    <div className="input-group-text">
                        <div className="form-check pe-1">
                            <input className="form-check-input" type="radio" value="TD" name="RiskHoldingView" id="trade_date" onChange={handleRadioButtonClick}/>
                            <label className="form-check-label" htmlFor="trade_date">Trade Date</label>
                        </div>
                        <div className="form-check pe-1">
                            <input className="form-check-input" type="radio" value='SD' name="RiskHoldingView" id="settlement_date" onChange={handleRadioButtonClick}/>
                            <label className="form-check-label" htmlFor="settlement_date">Settlement Date</label>
                        </div>
                        <div className="form-check pe-1">
                            <input className="form-check-input" type="radio" value='ID' name="RiskHoldingView" id="intra_trade_date" onChange={handleRadioButtonClick}/>
                            <label className="form-check-label" htmlFor="intra_trade_date">Intraday</label>
                        </div>
                        <div className="form-check pe-1">
                            <input className="form-check-input" type="radio" value='LT' name="RiskHoldingView" id="lot_level_trade_date" onChange={handleRadioButtonClick}/>
                            <label className="form-check-label" htmlFor="lot_level_trade_date">Lot-Level</label>
                        </div>
                    </div>

                    <div className="input-group-text">
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="aggSwitch" name="aggRows" value="y" onChange={handleAggSwitchChange}/>
                            <label className="form-check-label" htmlFor="aggSwitch">Aggregate Rows</label>
                        </div>
                    </div>
                    
                    <button className="btn btn-primary" type="submit">Search</button>
                    <ExportCSV csvData={responseData} fileName={`Risk Holdings: ${dataTableStyles[bodyReq.positionView].title}`} />
                </div>  
            </form>
            {
                responseData && 
                <div>
                    <h3 style={{ backgroundColor: `${dataTableStyles[bodyReq.positionView].bannerColor}`, color: "white", padding: "1% 1%" }} >Risk Holdings: {dataTableStyles[bodyReq.positionView].title} View</h3>
                    <DataTable 
                        columns={columnHeaders}
                        data={responseData}
                        highlightOnHover
                        striped
                        customStyles={customStyles}
                        conditionalRowStyles={conditionalRowStyles}
                        expandableRows
                        expandOnRowClicked
                        expandableRowsComponent={ExpandedTable}
                        fixedHeader                        
                    />
                </div>
            }   
        </div> 
    )
    /*END OF RENDER */
}

export default RiskHoldings;