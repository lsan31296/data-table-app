import React, { useState } from "react";
import { filterRiskAccounts, dollarFormatter, numberFormatter0, numberFormatter2, formatWeight, addDataIntoCache, removeUnwanteds, formatAccountName, fileNameConstructor, removeAndRenamObjectProps, dollarFormatter0 } from "../utils/helperFunctions";
import { getRiskHoldings } from "../api";
import DataTable from "react-data-table-component";
import ExpandedTable from "../data-table/ExpandedTable";
import MultiSelectMenu from "./MultiSelectMenu";
import ExportCSV from "../ExportCSV";
import CustomMaterialMenu from "../components/CustomMaterialMenu";
import './RiskHoldings.css';
import SubHeaderComponent from "../data-table/SubHeaderComponent";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PopModal from "../components/PopModal";

//This component is responsible for displaying a drop down menu which may be used for sending requests,
//exporting selected accounts, etc.
function RiskHoldings({ tableData, dropDownData, handleSearch, previousBD }) {
    //INITIAL FORM/HASHMAP STATES
    const initialFormState = {
        accounts: [],
        aoDate: previousBD,
        positionView: "TD",
        aggregateRows: "n",
    };
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
    const initialHashTabState = {
        data: [],//resData for respective tab
        req: initialFormState,//bodyReq for respective tab
        tableStyle: dataTableStyles
    }
    const initialHashState = {
        tab0: initialHashTabState
    }
        /*NEED TO DECLARE TAB VARIABLES HERE AS IT HOUSES DataTable component and all the data it needs*/
        const initialTabListState = [
        
        ];
        const initialTabPanelState = [
    
        ];
    //DECLARATION OF STATE VARIABLES
    const [tabListArr, setTabListArr] = useState([]);
    const [tabPanelArr, setTabPanelArr] = useState([]);
    /**
     * tabListArr is responsible for setting the names of the displayed tabs. This works in conjunction with...
     * tabPanelArr which is responsible for displaying the content of tabs from tabListArr. 
     * These two state variables are used as components of react-tabs package. 1 to 1 relationship. They must be equal in length.
     * 
     * Notice there are setTabListArr and setTabPanelArr. These are part of React's useState function. They are functions that must
     * be used to set their respective variables (tabListArr, tabPanelArr). You cannot mutate the state variables directly, is must be
     * updated by their set function. 
     * 
     * Example:
     * const [tabList, setTabList] = useState(['Tab1']);
     * setTabList([...tabList, 'Tab2']);
     * ---> Now after React processes this, tabList = ['Tab1', 'Tab2']. Using this same convention to set state for tabPanel
     * More Examples: https://www.npmjs.com/package/react-tabs , https://reactcommunity.org/react-tabs/
     */
    const [tabIndex, setTabIndex] = useState(0);
    const [bodyReq, setBodyReq] = useState({...initialFormState});
    const [hashMap, setHashMap] = useState({...initialHashState});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalColumns, setModalColumns] = useState([]);
    const rowsForSelect = removeUnwanteds(dropDownData).map((account, index) => (
        { 
            value: account.apx_portfolio_code,  
            label: account.name,
        }
    ));

    //HANDLER FUNCTIONS DECLARED HERE
    const handleRecentTradeModalOpen = (uspTradeRes, title, recentTradeModalColumns) => {
        setModalData(uspTradeRes);
        setModalTitle(title);
        setModalColumns(recentTradeModalColumns);
        setIsModalOpen(true);
    };
    const handleSecurityDetailModalOpen =  (securityDetailRes, title, securityDetailModal) => {
        setModalData(securityDetailRes);
        setModalTitle(title);
        setModalColumns(securityDetailModal);
        setIsModalOpen(true);
    };
    const handlePriceHistoryModalOpen = (priceHistoryRes, title, priceHistoryModalColumns) => {
        setModalData(priceHistoryRes);
        setModalTitle(title);
        setModalColumns(priceHistoryModalColumns);
        setIsModalOpen(true);
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
    }

    const handleCloseButton = () => {
        //Wei's idea.
        document.getElementById('remove-tab-button').click();
    }

    const handleAddTabClick = (event) => {
        console.log("Tab Index before adding tab: ", tabIndex);
        console.log("TabList Array Length Before: ", tabListArr.length)
        //Insert New Tab in hashMap to save dynamic state variables, set state
        hashMap[`tab${tabListArr.length+1}`] = initialHashTabState;
        setHashMap({
            ...hashMap,
        });
        //Insert New Tab, set state
        setTabListArr([
            ...tabListArr,
            <Tab>
                Risk Holdings #{tabListArr.length + 2} <button onClick={handleCloseButton} type="button" class="btn-close" aria-label="Close"></button>
            </Tab>
        ]);
        //Set tab index to newly created tab
        setTabIndex(tabListArr.length+1);
        console.log("TabIndex set to: ", tabListArr.length+1);
        console.log("TabList Array Length After: ", tabListArr.length);
        
        //Insert New Tab Panel
        setTabPanelArr([
            ...tabPanelArr,
            <TabPanel>
            <DataTable
                    //title={<h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex+1}`].tableStyle[`${hashMap[`tab${tabIndex+1}`].req.positionView}`].title} View</h3>}
                    title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex+1}`].tableStyle[`${hashMap[`tab${tabIndex+1}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{hashMap[`tab${tabIndex+1}`].req.aoDate}</h3> </div>}
                    subHeader subHeaderComponent={SubHeaderComponent}  
                    columns={columnHeaders}
                    data={hashMap[`tab${tabIndex+1}`].data}
                    highlightOnHover
                    striped
                    customStyles={customStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    expandableRows
                    //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                    expandableRowsComponent={ExpandedTable}
                    fixedHeader
                    fixedHeaderScrollHeight="710px"
                    onRowDoubleClicked={handleDoubleClick}
                    //title={<h1 style={{ border: "red solid 2px"}}>Header</h1>}
                    //subHeaderComponent={<h3 style={{ border: "green solid 2px" }}>SubHeader</h3>}
                />
            </TabPanel>
        ]);
        
        console.log("Tab Panel Array Length: ", tabPanelArr.length);
    };
    const handleRemoveSelectedTabClick = async (event) => {
        console.log("Clicked close button");
        console.log("TabListArr length: ", tabListArr);
        //If we current tab isn't the only remaining tab then,
        if (tabListArr.length > 0 && tabIndex !== 0) {
            //remove current tab panel and then from tab list
            console.log("Removed Tab Index: ", tabIndex);
            tabPanelArr.splice(tabIndex-1, 1);
            tabListArr.splice(tabIndex-1, 1);
            console.log("Spliced Tab Panel and List.");
            //Set state variable for both panel and list and hashMap
            await setTabPanelArr([...tabPanelArr]);
            await setTabListArr([...tabListArr]);
            console.log("Set Tab Panel and List states.")
            
            //Set current tab to last tab
            setTabIndex(tabPanelArr.length > 0 && tabIndex !== 0 ? tabIndex-1 : 0);
            console.log("TabIndex set to: ", tabPanelArr.length > 0 && tabIndex !== 0 ? tabIndex-1 : 0);
            console.log("hashMap before delete: ", hashMap);
            //delete hashMap[`tab${tabIndex}`];
            //console.log("Deleted hashMap Property.", hashMap);
            const newHashMap = removeAndRenamObjectProps(tabIndex, hashMap);
            await setHashMap({...newHashMap});
            console.log("Set hashMap state: ", newHashMap);
            //Change tab name in hashMap.

        } else {
            console.log(`TabList: `,tabListArr);
            tabListArr.forEach((element) => {console.log(element)});
            console.log(`TabPanel: `, tabPanelArr);
            console.log(`TabIndex: `, tabIndex);
            alert("You cannot close out your first or last tab.");
            return;
        }
    };
    const handleTabOnSelect = (index) => {
        console.log("Current selected index: ", index);
        setTabIndex(index);
        //console.log("Current Tab Index State: ", tabIndex);
        console.log("Current hashMap state after switching tabs: ", hashMap);
    };
    const handleMultiSelectChange = (values, actionMeta) => {
        //console.log("Action Meta:", actionMeta);
        console.log("Multi Select values: " , values);
        setBodyReq({ ...bodyReq, accounts: filterRiskAccounts(values, dropDownData) })
        setHashMap({
            ...hashMap,
            [`tab${tabIndex}`]: {
                ...hashMap[`tab${tabIndex}`],
                data: [], //Resets data that appears in table anytime there is a change in the form. 
                req: values.length > 0 ? {
                    ...hashMap[`tab${tabIndex}`].req,
                    accounts: filterRiskAccounts(values, dropDownData) //Maps account name(s) to array with corresponding apxCode(s)
                } :
                {
                    ...hashMap[`tab${tabIndex}`].req,
                    //accounts: bodyReq.accounts
                }
            }
        })

        tabPanelArr[tabIndex-1] = 
        <TabPanel>
        <DataTable
        //Problem here, this is why it doesn't show proper header color.
                //title={<h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3>}
                title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{hashMap[`tab${tabIndex}`].req.aoDate}</h3> </div>}
                subHeader subHeaderComponent={SubHeaderComponent}  
                columns={columnHeaders}
                data={[]}
                highlightOnHover
                striped
                customStyles={customStyles}
                conditionalRowStyles={conditionalRowStyles}
                expandableRows
                //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                expandableRowsComponent={ExpandedTable}
                fixedHeader
                fixedHeaderScrollHeight="710px"
                onRowDoubleClicked={handleDoubleClick}
                //title={<h1 style={{ border: "red solid 2px"}}>Header</h1>}
                //subHeaderComponent={<h3 style={{ border: "green solid 2px" }}>SubHeader</h3>}
            />
        </TabPanel>;
        setTabPanelArr([...tabPanelArr]);
    };
    const handleMenuClose = async (actionMeta, values) => {
            console.log("Body Request: ", bodyReq);
            console.log("Account list from MultiSelect: ", hashMap[`tab${tabIndex}`].req.accounts);
    };
    const handleDateChange = ({target}) => {
        setBodyReq({...bodyReq, aoDate: target.value })
        setHashMap({
            ...hashMap,
            [`tab${tabIndex}`]: {
                ...hashMap[`tab${tabIndex}`],
                data: [],
                req: {
                    ...hashMap[`tab${tabIndex}`].req, 
                    aoDate: target.value //Set form aoDate to value of selected date from datepicker
                }
            }
        })
        tabPanelArr[tabIndex-1] = 
            <TabPanel>
            <DataTable
            //Problem here, this is why it doesn't show proper header color.
                    //title={<h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3>}
                    title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{hashMap[`tab${tabIndex}`].req.aoDate}</h3> </div>}
                    subHeader subHeaderComponent={SubHeaderComponent}  
                    columns={columnHeaders}
                    data={[]}
                    highlightOnHover
                    striped
                    customStyles={customStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    expandableRows
                    //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                    expandableRowsComponent={ExpandedTable}
                    fixedHeader
                    fixedHeaderScrollHeight="710px"
                    onRowDoubleClicked={handleDoubleClick}
                    //title={<h1 style={{ border: "red solid 2px"}}>Header</h1>}
                    //subHeaderComponent={<h3 style={{ border: "green solid 2px" }}>SubHeader</h3>}
                />
            </TabPanel>;
        
        setTabPanelArr([
            ...tabPanelArr,
        ])
    };
    const handleRadioButtonClick = ({ target }) => {
        setBodyReq({...bodyReq, positionView: target.value })
        setHashMap({
            ...hashMap,
            [`tab${tabIndex}`]: {
                ...hashMap[`tab${tabIndex}`],
                data: [],
                req: {
                    ...hashMap[`tab${tabIndex}`].req,
                    positionView: target.value
                }
            }
        })
        tabPanelArr[tabIndex-1] = 
            <TabPanel>
            <DataTable
            //Problem here, this is why it doesn't show proper header color.
                    //title={<h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3>}
                    title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{hashMap[`tab${tabIndex}`].req.aoDate}</h3> </div>}
                    subHeader subHeaderComponent={SubHeaderComponent}  
                    columns={columnHeaders}
                    data={[]}
                    highlightOnHover
                    striped
                    customStyles={customStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    expandableRows
                    //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                    expandableRowsComponent={ExpandedTable}
                    fixedHeader
                    fixedHeaderScrollHeight="710px"
                    onRowDoubleClicked={handleDoubleClick}
                    //title={<h1 style={{ border: "red solid 2px"}}>Header</h1>}
                    //subHeaderComponent={<h3 style={{ border: "green solid 2px" }}>SubHeader</h3>}
                />
            </TabPanel>;
        
        setTabPanelArr([
            ...tabPanelArr,
        ])
    };
    const handleSearchButton = async (event) => {
        event.preventDefault();
        console.log("Hit Search!. Tab Index: ", tabIndex)
        console.log("Hit Search: ", hashMap[`tab${tabIndex}`].req);
        //IF search is hit and bodyReq.accounts is empty, stop process 
        if (bodyReq.accounts.length === 0) {
            alert("Must select an account value to search in drop down.");
            return;
        }

        //IF tab is switched, and no additional dropdown value is selected, account list for tab req is empty.
        //So check the following condition...
        if (hashMap[`tab${tabIndex}`].req.accounts.length === 0 && bodyReq.accounts.length > 0) {
            //then set accounts in hashMap to what is in bodyReq.accounts is as it was the last selection. 
            setHashMap({
                ...hashMap,
                [`tab${tabIndex}`]: {
                    ...hashMap[`tab${tabIndex}`],
                    req: {
                        //...hashMap[`tab${tabIndex}`].req,
                        //accounts: [...bodyReq.accounts]
                        ...bodyReq
                    } 
                }
            })
        }
        const resData = await getRiskHoldings(
            (hashMap[`tab${tabIndex}`].req.accounts.length === 0 && bodyReq.accounts.length > 0) ? bodyReq
            : bodyReq//hashMap[`tab${tabIndex}`].req
        );
        //If a current tab is selected, set that tab's data array to response from getRiskHoldings API (resData)
        if (tabIndex >= 0) {
            setHashMap({
                ...hashMap,
                [`tab${tabIndex}`]: {
                    ...hashMap[`tab${tabIndex}`],
                    data: [...resData]
                }
            })
        }
        if (tabIndex > 0) {
            tabPanelArr[tabIndex-1] = 
            <TabPanel>
            <DataTable
            //Problem here, this is why it doesn't show proper header color.
                    //title={<h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3>}
                    title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{hashMap[`tab${tabIndex}`].req.aoDate}</h3> </div>}
                    subHeader subHeaderComponent={SubHeaderComponent}  
                    columns={columnHeaders}
                    data={resData}
                    highlightOnHover
                    striped
                    customStyles={customStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    expandableRows
                    //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                    expandableRowsComponent={ExpandedTable}
                    fixedHeader
                    fixedHeaderScrollHeight="710px"
                    onRowDoubleClicked={handleDoubleClick}
                    //title={<h1 style={{ border: "red solid 2px"}}>Header</h1>}
                    //subHeaderComponent={<h3 style={{ border: "green solid 2px" }}>SubHeader</h3>}
                />
            </TabPanel>;
        
        setTabPanelArr([
            ...tabPanelArr,
        ]);    
    }

        //If resData exists
        if (resData.length > 0) {
            //then add bodyReq json into cache name, resData into cache data
            await addDataIntoCache(JSON.stringify(hashMap[`tab${tabIndex}`].req), "http://localhost:3000/", resData);
            console.log("Done data caching!");
        }
    };
    const handleAggSwitchChange = ({ target }) => {
        setHashMap({
            ...hashMap,
            [`tab${tabIndex}`]: {
                ...hashMap[`tab${tabIndex}`],
                data: [],
                req: {
                    ...hashMap[`tab${tabIndex}`].req,
                    aggregateRows: target.checked ? target.value : "n"
                }
            }
        })
        
        if (target.checked) {
            console.log("Checked");
            setBodyReq({ ...bodyReq, aggregateRows: target.value });
        } else {
            console.log("Not Checked");
            setBodyReq({ ...bodyReq, aggregateRows: "n" });
        }
        
        console.log("Hit Agg Switch: ", hashMap[`tab${tabIndex}`].req)
        tabPanelArr[tabIndex-1] = 
            <TabPanel>
            <DataTable
            //Problem here, this is why it doesn't show proper header color.
                    //title={<h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3>}
                    title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{hashMap[`tab${tabIndex}`].req.aoDate}</h3> </div>}
                    subHeader subHeaderComponent={SubHeaderComponent}  
                    columns={columnHeaders}
                    data={[]}
                    highlightOnHover
                    striped
                    customStyles={customStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    expandableRows
                    //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                    expandableRowsComponent={ExpandedTable}
                    fixedHeader
                    fixedHeaderScrollHeight="710px"
                    onRowDoubleClicked={handleDoubleClick}
                    //title={<h1 style={{ border: "red solid 2px"}}>Header</h1>}
                    //subHeaderComponent={<h3 style={{ border: "green solid 2px" }}>SubHeader</h3>}
                />
            </TabPanel>;
        
        setTabPanelArr([
            ...tabPanelArr,
        ])
    };
    const handleDoubleClick = (row, event) => {
        console.log("Double-clicked row: ", row.account, row.bbg_cusip);
        //open up context menu that has several options and access to data
        var rowData = JSON.stringify(row);
        navigator.clipboard.writeText(rowData)
        .then(() => {
            alert(`Row data copied to clipboard!`);
        });
    };

    //Set react-data table configurations here
    const columnHeaders = [
        //Currently account_name and ticker are not working when being called to the middle-tier from its database.
        { 
            name: "Account Name", 
            selector: (row) => formatAccountName(row.account_name),
            sortable: true,
            minWidth: "135px",
            center: true,
        },
        {
            cell: row => 
            <div>
                <CustomMaterialMenu size="small" row={row} handleModalOption1Open={handleRecentTradeModalOpen} handleModalOption2Open={handleSecurityDetailModalOpen} handleModalOption3Open={handlePriceHistoryModalOpen}/>
            </div>,
            allowOverFlow: true,
            button: true,
            minWidth: "40px",
            compact: true,
            center: true,
        },
        { 
            name: "BBG Cusip", 
            selector: (row) => row.bbg_cusip, 
            sortable: true,
            maxWidth: "10px",
            compact: true,
            center: true,
        },
        {
            name: "Sec Name",
            selector: (row) => row.sec_name,
            sortable: true,
            compact: true,
            minWidth: "125px",
            center: true,
        },
        {
            name: "Coupon",
            selector: (row) => row.coupon,
            sortable: true,
            compact: true,
            minWidth: "70px",
            format: (row) => numberFormatter2.format(row.coupon),
            center: true,
        },
        {
            name: "Maturity",
            selector: (row) => row.maturity,
            sortable: true,
            compact: true,
            minWidth: "80px",
            center: true,
        },
        {
            name: "Price",
            selector: (row) => dollarFormatter.format(row.price),
            sortable: true,
            minWidth: "50px",
            compact: true,
            center: true,
        },
        {
            name: "Wght",
            selector: (row) => formatWeight(row.weight),
            sortable: true,
            minWidth: "65px",
            compact: true,
            center: true,
        },
        {
            name: "Orig Face",
            selector: (row) => row.orig_face,
            sortable: true,
            compact: true,
            minWidth: "80px",
            format: (row) => dollarFormatter0.format(row.orig_face),
            center: true,
        },
        {
            name: "Curr Face",
            selector: (row) => dollarFormatter0.format(row.curent_face),
            sortable: true,
            compact: true,
            minWidth: "80px",
            center: true,
        },
        {
            name: "MKT Val",
            selector: (row) => dollarFormatter0.format(row.mv),
            sortable: true,
            compact: true,
            minWidth: '110px',
            center: true,
        },
        {
            name: "Factor",
            selector: (row) => numberFormatter2.format(row.factor),
            sortable: true,
            compact: true,
            minWidth: "60px",
            center: true,
        },
        {
            name: "DUR",
            selector: (row) => numberFormatter2.format(row.dur),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: "DUR Cont",
            selector: (row) => numberFormatter2.format(row.durCont),
            sortable: true,
            compact: true,
            minWidth: "80px",
            center: true,
        },
        {
            name: "YTW",
            selector: (row) => numberFormatter2.format(row.ytw),
            sortable: true,
            compact: true,
            minWidth: "60px",
            center: true,
        },
        {
            name: "YTW Cont",
            selector: (row) => numberFormatter2.format(row.ytwCont),
            sortable: true,
            compact: true,
            minWidth: "85px",
            center: true,
        },
        {
            name: "DxS",
            selector: (row) => numberFormatter0.format(row.dxS),
            sortable: true,
            compact: true,
            minWidth: "75px",
            center: true,
        },
        {
            name: "CONVX",
            selector: (row) => numberFormatter2.format(row.cnvx),
            sortable: true,
            compact: true,
            minWidth: "79px",
            center: true,
        },
        {
            name: "WAL",
            selector: (row) => numberFormatter2.format(row.wal),
            sortable: true,
            compact: true,
            minWidth: "60px",
            center: true,
        },
        {
            name: "OAS",
            selector: (row) => numberFormatter0.format(row.oas),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: "Agg RTG",
            selector: (row) => row.aggregate_rating,
            sortable: true,
            compact: true,
            minWidth: "75px",
            center: true,
        },
        {
            name: "Moody",
            selector: (row) => row.carlton_MoodyRating,
            sortable: true,
            compact: true,
            minWidth: "65px",
            center: true,
        },
        {
            name: "SP",
            selector: (row) => row.carlton_SPRating,
            sortable: true,
            compact: true,
            minWidth: "30px",
            center: true,
            //maxWidth: "60px",
        },
        {
            name: "Fitch",
            selector: (row) => row.carlton_FitchRating,
            sortable: true,
            compact: true,
            minWidth: "40px",
            center: true,
        },
        {
            name: "6M",
            selector: (row) => numberFormatter2.format(row.krD_6M),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: "1YR",
            selector: (row) => numberFormatter2.format(row.krD_1YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: "2YR",
            selector: (row) => numberFormatter2.format(row.krD_2YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: "3YR",
            selector: (row) => numberFormatter2.format(row.krD_3YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: "5YR",
            selector: (row) => numberFormatter2.format(row.krD_5YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: "7YR",
            selector: (row) => numberFormatter2.format(row.krD_7YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: "10YR",
            selector: (row) => numberFormatter2.format(row.krD_10YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: "20YR",
            selector: (row) => numberFormatter2.format(row.krD_20YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: "30YR",
            selector: (row) => numberFormatter2.format(row.krD_30YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: "Book G/L",
            selector: (row) => numberFormatter0.format(row.book_gain_loss),
            sortable: true,
            compact: true,
            minWidth: "80px",
            conditionalCellStyles: [
                {
                    when: (row) => row.book_gain_loss < 0,
                    style: { color: 'red' }
                }
            ],
            center: true,
        },
        {
            name: "DOD G/L",
            selector: (row) => numberFormatter0.format(row.dod_gain_loss),
            sortable: true,
            compact: true,
            minWidth: "80px",
            conditionalCellStyles: [
                {
                    when: (row) => row.dod_gain_loss < 0,
                    style: { color: 'red' }
                }
            ],
            center: true,
        },
        {
            name: "Orig Trd Date",
            selector: (row) => row.original_trade_date.slice(0,10),
            sortable: true,
            compact: true,
            minWidth: "120px",
            center: true,
        },
    ];
    const customStyles = {
        header : {
            style: {
                backgroundColor: hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].bannerColor || "black"
            }
        },
        subHeader: {
            style: {
                minHeight: "45px"
            }
        },
        headRow: {
            style: {
                fontSize: "14px",
                color: "#1B3668",
                wordBreak: "break-word",
                minHeight: "45px"
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
            when: row => row.weight < 0.99 && row.aggregate_rating === "" && row.sec_name === "",//identifies the aggregate rows
            style: {
                backgroundColor: hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].aggMaGroupRowColor
            }
        },
    ]


    
    /* RENDERED ON UI */
    return (
        <div style={{ padding: hashMap[`tab${tabIndex}`].data.length > 0 ? "30px 4% 100px 4%" :"1% 4%", backgroundColor: "#F2F2F2",  /*border: "solid 2px green"*/ }}>

            <form onSubmit={handleSearchButton}>
                <MultiSelectMenu name="multiSelect" required={true} rowsForSelect={rowsForSelect} handleMultiSelectChange={handleMultiSelectChange} handleMenuClose={handleMenuClose}/>
                
                <div className="input-group">
                    <label htmlFor="aoDate"></label>
                    <input className="form-control" id="aoDate" type="date" name="aoDate" onChange={handleDateChange} value={hashMap[`tab${tabIndex}`].req.aoDate} pattern="\d{4}-\d{2}-\d{2}" placeholder="YYYY-MM-DD"/>
                    
                    <div className="input-group-text">
                        <div className="form-check pe-2">
                            <input className="form-check-input" type="radio" value="TD" name="RiskHoldingView" id="trade_date" onChange={handleRadioButtonClick} defaultChecked/>
                            <label className="form-check-label" htmlFor="trade_date">Trade Date</label>
                        </div>
                        <div className="form-check pe-2">
                            <input className="form-check-input" type="radio" value='SD' name="RiskHoldingView" id="settlement_date" onChange={handleRadioButtonClick}/>
                            <label className="form-check-label" htmlFor="settlement_date">Settlement Date</label>
                        </div>
                        <div className="form-check pe-2">
                            <input className="form-check-input" type="radio" value='ID' name="RiskHoldingView" id="intra_trade_date" onChange={handleRadioButtonClick}/>
                            <label className="form-check-label" htmlFor="intra_trade_date">Intraday</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" value='LT' name="RiskHoldingView" id="lot_level_trade_date" onChange={handleRadioButtonClick}/>
                            <label className="form-check-label" htmlFor="lot_level_trade_date">Lot-Level</label>
                        </div>
                    </div>

                    <div className="input-group-text">
                        <div className="form-check form-switch pe-2">
                            <input className="form-check-input" type="radio" id="noAggSwitch" name="aggRows" value="n" onChange={handleAggSwitchChange} defaultChecked/>
                            <label className="form-check-label" htmlFor="noAggSwitch">No Aggregates</label>
                        </div>
                        <div className="form-check form-switch pe-2">
                            <input className="form-check-input" type="radio" id="aggSwitch" name="aggRows" value="y" onChange={handleAggSwitchChange}/>
                            <label className="form-check-label" htmlFor="aggSwitch">Aggregate</label>
                        </div>
                        <div className="form-check form-switch pe-2">
                            <input className="form-check-input" type="radio" id="groupAggSwitch" name="aggRows" value="yg" onChange={handleAggSwitchChange}/>
                            <label className="form-check-label" htmlFor="groupAggSwitch">Group</label>
                        </div>
                        <div className="form-check form-switch pe-2">
                            <input className="form-check-input" type="radio" id="typeAggSwitch" name="aggRows" value="yt" onChange={handleAggSwitchChange}/>
                            <label className="form-check-label" htmlFor="typeAggSwitch">Type</label>
                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="radio" id="secAggSwitch" name="aggRows" value="ys" onChange={handleAggSwitchChange}/>
                            <label className="form-check-label" htmlFor="secAggSwitch">Sector</label>
                        </div>
                    </div>
                    
                    <button className="btn btn-primary" type="submit">Search</button>
                    <ExportCSV csvData={hashMap[`tab${tabIndex}`].data} fileName={fileNameConstructor(hashMap, tabIndex)} />
                </div>  
            </form>
            {
                tabIndex >= 0 && 
                <div>
                    <PopModal data={modalData} isOpen={isModalOpen} onClose={handleModalClose} columns={modalColumns} modalTitle={modalTitle}/>

                    <Tabs selectedIndex={tabIndex} onSelect={handleTabOnSelect}>
                        <TabList>
                            <Tab>Risk Holdings</Tab>
                            {tabListArr}
                            <button className="btn btn-sm btn-danger" id="remove-tab-button" onClick={handleRemoveSelectedTabClick}>Remove Tab</button>
                            <button className="btn btn-sm btn-primary" id="add-tab-button" type="button" onClick={handleAddTabClick}>Add Tab</button>
                        </TabList>
                        

                        <TabPanel>
                        <DataTable
                            title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>Risk Holdings: {hashMap.tab0.tableStyle[`${hashMap.tab0.req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{hashMap.tab0.req.aoDate}</h3> </div>}
                            subHeader subHeaderComponent={SubHeaderComponent}  
                            columns={columnHeaders}
                            data={hashMap.tab0.data}
                            highlightOnHover
                            striped
                            customStyles={customStyles}
                            conditionalRowStyles={conditionalRowStyles}
                            expandableRows
                            expandableRowsComponent={ExpandedTable}
                            fixedHeader
                            fixedHeaderScrollHeight="710px"
                            onRowDoubleClicked={handleDoubleClick}
                        />
                        </TabPanel>
                        {tabPanelArr}

                    </Tabs>
                </div>
            }   
        </div> 
    )
    /*END OF RENDER */
}

export default RiskHoldings;