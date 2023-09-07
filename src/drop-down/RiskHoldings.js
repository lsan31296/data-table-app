import React, { useState } from "react";
import { filterRiskAccounts, dollarFormatter, numberFormatter0, numberFormatter2, formatWeight, addDataIntoCache, removeUnwanteds, formatAccountName, fileNameConstructor, removeAndRenamObjectProps, dollarFormatter0, today, sqlDateToDateString, aggRowFilter } from "../utils/helperFunctions";
import { getRiskHoldings } from "../api";
import DataTable from "react-data-table-component";
//import ExpandedTable from "../data-table/ExpandedTable";
//import MultiSelectMenu from "./MultiSelectMenu";
import ExportCSV from "../ExportCSV";
import CustomMaterialMenu from "../components/CustomMaterialMenu";
import './RiskHoldings.css';
import SubHeaderComponent from "../data-table/SubHeaderComponent";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PopModal from "../components/PopModal";
import SingleSelectMenu from "./SingleSelectMenu";
import ExpandedDetailsTable from "../data-table/ExpandedDetailsTable";
import CustomLoader from "../components/CustomLoader";
//import CustomCell from "../components/CustomCell";

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
            aggMaGroupRowColor0: "#045787",
            aggMaGroupRowColor1: "#0776a6",
            aggMaGroupRowColor2: "#138bb0",
            aggMaGroupRowColor3: "#26a1c7",
            aggMaGroupRowColor4: "#9ad4e6",
            aggMaGroupRowColor5: "#b4eafa",
        },
        SD: {
            title: "Settlement Date",
            bannerColor: "#0b850d",
            aggMaGroupRowColor0: "#0e8c19",
            aggMaGroupRowColor1: "#139e16",
            aggMaGroupRowColor2: "#25c428",
            aggMaGroupRowColor3: "#40de43",
            aggMaGroupRowColor4: "#a4f5a6",
            aggMaGroupRowColor5: "#c9f0ca",
        },
        ID: {
            title: "Trade Date Intraday",
            bannerColor: "#590396",
            aggMaGroupRowColor0: "#540185",
            aggMaGroupRowColor1: "#6105a3",
            aggMaGroupRowColor2: "#770cc4",
            aggMaGroupRowColor3: "#9027db",
            aggMaGroupRowColor4: "#ce98f5",
            aggMaGroupRowColor5: "#e7cdfa",
        },
        LT: {
            title: "Lot-Level Trade Date",
            bannerColor: "#e37005",
            aggMaGroupRowColor0: "#8c4b0e",
            aggMaGroupRowColor1: "#994f09",
            aggMaGroupRowColor2: "#b3651d",
            aggMaGroupRowColor3: "#cc7e35",
            aggMaGroupRowColor4: "#e8c19e",
            aggMaGroupRowColor5: "#fae6d4",
    
        }
    }
    
    const initialHashTabState = {
        data: [],//resData for respective tab
        req: initialFormState,//bodyReq for respective tab
        tableStyle: dataTableStyles,
        dataTableTitle: "",
        currentRecords: [],
        pending: false,
    }
    const initialHashState = {
        tab0: initialHashTabState
    }

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
    //MODAL HANDLERS HERE
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
    const handleShowLoansModalOpen = (showLoansRes, title, showLoansModalColumns) => {
        setModalData(showLoansRes);
        setModalTitle(title);
        setModalColumns(showLoansModalColumns);
        setIsModalOpen(true);
    };
    const handleAccountDetailsModalOpen = (accountDetailsRes, title, accountDetailsModalColumns) => {
        setModalData(accountDetailsRes);
        setModalTitle(title);
        setModalColumns(accountDetailsModalColumns);
        setIsModalOpen(true);
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
    }
    //RISK HOLDINGS HANDLERS HERE
    const handleCloseButton = () => {
        //Wei's idea.
        document.getElementById('remove-tab-button').click();
    }
    const handleAddTabClick = async (event) => {
        console.log("Tab Index before adding tab: ", tabIndex);
        console.log("TabList Array Length Before: ", tabListArr.length)
        //Insert New Tab in hashMap to save dynamic state variables, set state
        hashMap[`tab${tabListArr.length+1}`] = {
            ...initialHashTabState,
            pending: true,
        };
        //hashMap[`tab${tabListArr.length+1}`].req.positionView = bodyReq.positionView;
        //hashMap[`tab${tabListArr.length+1}`].req.aoDate = bodyReq.aoDate;
        hashMap[`tab${tabListArr.length+1}`].req = {...bodyReq};
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
                    title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}> Risk Holdings: {hashMap[`tab${tabIndex+1}`].tableStyle[`${hashMap[`tab${tabIndex+1}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{sqlDateToDateString(hashMap[`tab${tabIndex+1}`].req.aoDate)}</h3> </div>}
                    subHeader subHeaderComponent={SubHeaderComponent}  
                    columns={columnHeaders}
                    data={hashMap[`tab${tabIndex+1}`].currentRecords}
                    highlightOnHover
                    striped
                    customStyles={customStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    expandableRows
                    //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                    expandableRowsComponent={ExpandedDetailsTable}
                    fixedHeader
                    //fixedHeaderScrollHeight="710px"
                    onRowDoubleClicked={handleDoubleClick}
                    pagination paginationPerPage={10000} 
                    paginationRowsPerPageOptions={[100, 200, 300, 400, 500, 1000, 10000]}
                    paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: "All" }}
                    progressPending={hashMap[`tab${tabIndex+1}`].pending}
                    progressComponent={<CustomLoader/>}
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
        if (tabIndex !== 0) {
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
    const handleTabOnSelect =async (index) => {
        console.log("Current selected index: ", index);
        setTabIndex(index);
        //console.log("Current Tab Index State: ", tabIndex);
        console.log("Current hashMap state after switching tabs: ", hashMap);
    };
    const handleSingleSelectChange = async (values, actionMeta) => {
        console.log("Single Select Values: ", values);
        setBodyReq({ ...bodyReq, accounts: values && values.value.length > 0 ? filterRiskAccounts([values], dropDownData) : bodyReq.accounts})
        //Potentially manipulate hashmap directly here
        setHashMap({
            ...hashMap,
            [`tab${tabIndex}`]: {
                ...hashMap[`tab${tabIndex}`],
                currentRecords: [], //Resets data that appears in table anytime there is a change in the form. 
                req: values && values.value.length > 0 ? {
                    ...hashMap[`tab${tabIndex}`].req,
                    accounts: [values.value] //Maps account name(s) to array with corresponding apxCode(s)
                } :
                {
                    ...hashMap[`tab${tabIndex}`].req,
                    //accounts: bodyReq.accounts
                },
                dataTableTitle: values && values.value.length > 0 ? formatAccountName(values.label) : "",
                pending: true,
            }
        })

        tabPanelArr[tabIndex-1] = 
        <TabPanel>
        <DataTable
        //Problem here, this is why it doesn't show proper header color.
                //title={<h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3>}
                title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>{values && values.value.length > 0 ? formatAccountName(values.label) : ""} Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{sqlDateToDateString(hashMap[`tab${tabIndex}`].req.aoDate)}</h3> </div>}
                subHeader subHeaderComponent={SubHeaderComponent}  
                columns={columnHeaders}
                data={[]}
                highlightOnHover
                striped
                customStyles={customStyles}
                conditionalRowStyles={conditionalRowStyles}
                expandableRows
                //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                expandableRowsComponent={ExpandedDetailsTable}
                fixedHeader
                //fixedHeaderScrollHeight="710px"
                onRowDoubleClicked={handleDoubleClick}
                pagination paginationPerPage={10000} 
                paginationRowsPerPageOptions={[100, 200, 300, 400, 500, 1000, 10000]}
                paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: "All" }}
                progressPending={hashMap[`tab${tabIndex}`].pending}
                progressComponent={<CustomLoader/>}
                //title={<h1 style={{ border: "red solid 2px"}}>Header</h1>}
                //subHeaderComponent={<h3 style={{ border: "green solid 2px" }}>SubHeader</h3>}
            />
        </TabPanel>;
        setTabPanelArr([...tabPanelArr]);
    }
    /*
    const handleMultiSelectChange = (values, actionMeta) => {
        //console.log("Action Meta:", actionMeta);
        console.log("Multi Select values: " , values);
        setBodyReq({ ...bodyReq, accounts: filterRiskAccounts(values, dropDownData) })
        setHashMap({
            ...hashMap,
            [`tab${tabIndex}`]: {
                ...hashMap[`tab${tabIndex}`],
                currentRecords: [], //Resets data that appears in table anytime there is a change in the form. 
                req: values.length > 0 ? {
                    ...hashMap[`tab${tabIndex}`].req,
                    accounts: filterRiskAccounts(values, dropDownData) //Maps account name(s) to array with corresponding apxCode(s)
                } :
                {
                    ...hashMap[`tab${tabIndex}`].req,
                    //accounts: bodyReq.accounts
                },
                dataTableTitle: values.length > 0 ? formatAccountName(values[0].label) : "" 
            }
        })

        tabPanelArr[tabIndex-1] = 
        <TabPanel>
        <DataTable
        //Problem here, this is why it doesn't show proper header color.
                //title={<h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3>}
                title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>{values.length > 0 ? formatAccountName(values[0].label) : ""} Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{sqlDateToDateString(hashMap[`tab${tabIndex}`].req.aoDate)}</h3> </div>}
                subHeader subHeaderComponent={SubHeaderComponent}  
                columns={columnHeaders}
                data={[]}
                highlightOnHover
                striped
                customStyles={customStyles}
                conditionalRowStyles={conditionalRowStyles}
                expandableRows
                //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                expandableRowsComponent={ExpandedDetailsTable}
                fixedHeader
                //fixedHeaderScrollHeight="710px"
                onRowDoubleClicked={handleDoubleClick}
                pagination paginationPerPage={10000} 
                paginationRowsPerPageOptions={[100, 200, 300, 400, 500, 1000, 10000]}
                paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: "All" }}
                //title={<h1 style={{ border: "red solid 2px"}}>Header</h1>}
                //subHeaderComponent={<h3 style={{ border: "green solid 2px" }}>SubHeader</h3>}
            />
        </TabPanel>;
        setTabPanelArr([...tabPanelArr]);
    };
    */
    const handleMenuClose = async (actionMeta, values) => {
            console.log("Body Request: ", bodyReq);
            console.log("Account list from MultiSelect: ", hashMap[`tab${tabIndex}`].req.accounts);
            console.log("hashMap: ", hashMap);
    };
    const handleDateChange = async ({target}) => {
        hashMap[`tab${tabIndex}`].pending = true;
        setBodyReq({...bodyReq, aoDate: target.value })
        setHashMap({
            ...hashMap,
            [`tab${tabIndex}`]: {
                ...hashMap[`tab${tabIndex}`],
                currentRecords: [],
                req: {
                    ...hashMap[`tab${tabIndex}`].req, 
                    aoDate: target.value //Set form aoDate to value of selected date from datepicker
                },
                pending: true,
            }
        })
        tabPanelArr[tabIndex-1] = 
            <TabPanel>
            <DataTable
            //Problem here, this is why it doesn't show proper header color.
                //title={<h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3>}
                title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>{hashMap[`tab${tabIndex}`].dataTableTitle} Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{sqlDateToDateString(hashMap[`tab${tabIndex}`].req.aoDate)}</h3> </div>}
                subHeader subHeaderComponent={SubHeaderComponent}  
                columns={columnHeaders}
                data={[]}
                highlightOnHover
                striped
                customStyles={customStyles}
                conditionalRowStyles={conditionalRowStyles}
                expandableRows
                //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                expandableRowsComponent={ExpandedDetailsTable}
                fixedHeader
                //fixedHeaderScrollHeight="710px"
                onRowDoubleClicked={handleDoubleClick}
                pagination paginationPerPage={10000} 
                paginationRowsPerPageOptions={[100, 200, 300, 400, 500, 1000, 10000]}
                paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: "All" }}
                progressPending={hashMap[`tab${tabIndex}`].pending}
                progressComponent={<CustomLoader/>}
                //title={<h1 style={{ border: "red solid 2px"}}>Header</h1>}
                //subHeaderComponent={<h3 style={{ border: "green solid 2px" }}>SubHeader</h3>}
                />
            </TabPanel>;
        
        setTabPanelArr([
            ...tabPanelArr,
        ])
    };
    const handleRadioButtonClick = async ({ target }) => {
        hashMap[`tab${tabIndex}`].pending = true;
        //Set condition here: If Intrday view is selected (ID), then...
        if (target.value === "ID") {
            console.log("ID Hit, ao_Date should be set to: ", today());
            //set the datepicker state variable to today's date
            setBodyReq({...bodyReq, positionView: target.value, aoDate: today() });
            //And set in hashMap for sending request
            setHashMap({
                ...hashMap,
                [`tab${tabIndex}`]: {
                    ...hashMap[`tab${tabIndex}`],
                    currentRecords: [],
                    req: {
                        ...hashMap[`tab${tabIndex}`].req, 
                        aoDate: today(), //Set form aoDate to value of selected date from datepicker
                        positionView: target.value
                    },
                    pending: true,
                }
            });
        } else {
            setBodyReq({...bodyReq, positionView: target.value });
            setHashMap({
                ...hashMap,
                [`tab${tabIndex}`]: {
                    ...hashMap[`tab${tabIndex}`],
                    currentRecords: [],
                    req: {
                        ...hashMap[`tab${tabIndex}`].req,
                        positionView: target.value,
                    },
                    pending: true,
                }
            })
        }

        tabPanelArr[tabIndex-1] = 
            <TabPanel>
            <DataTable
            //Problem here, this is why it doesn't show proper header color.
                    //title={<h3 style={{ color: "white" }}>Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3>}
                    title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>{hashMap[`tab${tabIndex}`].dataTableTitle} Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{sqlDateToDateString(hashMap[`tab${tabIndex}`].req.aoDate)}</h3> </div>}
                    subHeader subHeaderComponent={SubHeaderComponent}  
                    columns={columnHeaders}
                    data={[]}
                    highlightOnHover
                    striped
                    customStyles={customStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    expandableRows
                    //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                    expandableRowsComponent={ExpandedDetailsTable}
                    fixedHeader
                    //fixedHeaderScrollHeight="710px"
                    onRowDoubleClicked={handleDoubleClick}
                    pagination paginationPerPage={10000} 
                    paginationRowsPerPageOptions={[100, 200, 300, 400, 500, 1000, 10000]}
                    paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: "All" }}
                    progressPending={hashMap[`tab${tabIndex}`].pending}
                    progressComponent={<CustomLoader/>}
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

        hashMap[`tab${tabIndex}`].pending = true;
        setHashMap({
            ...hashMap,
            [`tab${tabIndex}`]: {
                ...hashMap[`tab${tabIndex}`],
                pending: true,
            }
        })
        console.log("Attempted to set pending to true.");
        console.log("Hit Search!. Tab Index: ", tabIndex)
        console.log("Hit Search: ", hashMap[`tab${tabIndex}`]);
        console.log("Body Req: ", bodyReq);
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
                    },
                    pending: true,
                }
            })
            console.log("Set hashmap pending to true and bodyReq.")
        }
        //let resData = await getRiskHoldings(bodyReq);
        //Function for deciding what sort orders get returned dependent on aggregate switch.
        const response = await getRiskHoldings(bodyReq);
        const resData = aggRowFilter(response, bodyReq.aggregateRows);

        //If a current tab is selected, set that tab's data array to response from getRiskHoldings API (resData)
        if (tabIndex >= 0) {
            setHashMap({
                ...hashMap,
                [`tab${tabIndex}`]: {
                    ...hashMap[`tab${tabIndex}`],
                    data: [...resData],
                    currentRecords: [...resData],
                    pending: false
                }
            })
        }
        console.log("Attempted to set pending to false.");
        if (tabIndex > 0) {
            tabPanelArr[tabIndex-1] = 
            <TabPanel>
                <DataTable
                    title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>{hashMap[`tab${tabIndex}`].dataTableTitle} Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{sqlDateToDateString(hashMap[`tab${tabIndex}`].req.aoDate)}</h3> </div>}
                    subHeader subHeaderComponent={SubHeaderComponent}  
                    columns={columnHeaders}
                    data={resData}
                    highlightOnHover
                    striped
                    customStyles={customStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    expandableRows
                    //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                    expandableRowsComponent={ExpandedDetailsTable}
                    fixedHeader
                    //fixedHeaderScrollHeight="710px"
                    onRowDoubleClicked={handleDoubleClick}
                    pagination paginationPerPage={10000} 
                    paginationRowsPerPageOptions={[100, 200, 300, 400, 500, 1000, 10000]}
                    paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: "All" }}
                    pending={hashMap[`tab${tabIndex}`].pending}
                    progressComponent={<CustomLoader/>}
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
    const handleAggSwitchChange = async({ target }) => {
        hashMap[`tab${tabIndex}`].pending = true;
        setHashMap({
            ...hashMap,
            [`tab${tabIndex}`]: {
                ...hashMap[`tab${tabIndex}`],
                //data: [],
                currentRecords: [],
                req: {
                    ...hashMap[`tab${tabIndex}`].req,
                    aggregateRows: target.checked ? target.value : "n"
                },
                pending: true,
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
                    title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>{hashMap[`tab${tabIndex}`].dataTableTitle} Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{sqlDateToDateString(hashMap[`tab${tabIndex}`].req.aoDate)}</h3> </div>}
                    subHeader subHeaderComponent={SubHeaderComponent}  
                    columns={columnHeaders}
                    data={[]}
                    highlightOnHover
                    striped
                    customStyles={customStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    expandableRows
                    //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                    expandableRowsComponent={ExpandedDetailsTable}
                    fixedHeader
                    //fixedHeaderScrollHeight="710px"
                    onRowDoubleClicked={handleDoubleClick}
                    pagination paginationPerPage={10000} 
                    paginationRowsPerPageOptions={[100, 200, 300, 400, 500, 1000, 10000]}
                    paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: "All" }}
                    progressPending={hashMap[`tab${tabIndex}`].pending}
                    progressComponent={<CustomLoader/>}
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
    const handleFilter = async ({target}) => {
        const newData = hashMap[`tab${tabIndex}`].data.filter((row) => {
            return row.bbg_cusip.toLowerCase().includes(target.value.toLowerCase())
        })
        setHashMap({
            ...hashMap,
            [`tab${tabIndex}`]: {
                ...hashMap[`tab${tabIndex}`],
                currentRecords: [...newData]
            }
        })
        if (tabIndex > 0) {
        tabPanelArr[tabIndex-1] = 
        <TabPanel>
            <DataTable
                title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>{hashMap[`tab${tabIndex}`].dataTableTitle} Risk Holdings: {hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{sqlDateToDateString(hashMap[`tab${tabIndex}`].req.aoDate)}</h3> </div>}
                subHeader subHeaderComponent={SubHeaderComponent}  
                columns={columnHeaders}
                data={newData}
                highlightOnHover
                striped
                customStyles={customStyles}
                conditionalRowStyles={conditionalRowStyles}
                expandableRows
                //expandOnRowClicked //NEEDED TO BE REMOVED IN ORDER TO ALLOW DOUBLE CLICK HANDLER TO OCCUR
                expandableRowsComponent={ExpandedDetailsTable}
                fixedHeader
                //fixedHeaderScrollHeight="710px"
                onRowDoubleClicked={handleDoubleClick}
                pagination paginationPerPage={10000} 
                paginationRowsPerPageOptions={[100, 200, 300, 400, 500, 1000, 10000]}
                paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: "All" }}
                progressPending={hashMap[`tab${tabIndex}`].pending}
                progressComponent={<CustomLoader/>}
                //title={<h1 style={{ border: "red solid 2px"}}>Header</h1>}
                //subHeaderComponent={<h3 style={{ border: "green solid 2px" }}>SubHeader</h3>}
            />
        </TabPanel>;
        setTabPanelArr([
            ...tabPanelArr,
        ]);
        }
    }

    //Set react-data table configurations here
    const columnHeaders = [
        //Currently account_name and ticker are not working when being called to the middle-tier from its database.
        /*
        { 
            name: "Sort Order", 
            selector: (row) => numberFormatter0.format(row.sortOrder),
            sortable: true,
            minWidth: "135px",
            center: true,
        },
        */
        {
            name: <div>Marketing Asset Group</div>,
            selector: (row) => row.marketingAssetGroup,
            center: true,
            compact: true,
            conditionalCellStyles: [
                {
                    when: (row) => (row.sortOrder !== 1 && hashMap[`tab${tabIndex}`].req.aggregateRows !== "n") || row.marketingAssetGroup === '-no data-',
                    style: {
                        color: "transparent"
                    }
                }
            ],
        },
        {
            name: <div>CS Group</div>,
            selector: (row) => row.carlton_SecurityGroup,
            center: true,
            compact: true,
            conditionalCellStyles: [
                {
                    when: (row) => (row.sortOrder !== 2 && hashMap[`tab${tabIndex}`].req.aggregateRows !== "n") || row.carlton_SecurityGroup === '-no data-',
                    style: {
                        color: "transparent"
                    }
                }
            ]
        },
        {
            name: <div>CS Type</div>,
            selector: (row) => row.carlton_SecurityType,
            compact: true,
            wrap: true,
            conditionalCellStyles: [
                {
                    when: (row) => (row.sortOrder !== 3 && hashMap[`tab${tabIndex}`].req.aggregateRows !== "n") || row.carlton_SecurityType === '-no data-',
                    style: {
                        color: "transparent"
                    }
                }
            ]
        },
        {
            name: <div>CS Sector</div>,
            selector: (row) => row.carlton_SecuritySector,
            compact: true,
            wrap: true,
            conditionalCellStyles: [
                {
                    when: (row) => (row.sortOrder !== 4 && hashMap[`tab${tabIndex}`].req.aggregateRows !== "n") || row.carlton_SecuritySector === '-no data-',
                    style: {
                        color: "transparent"
                    }
                }
            ]
        },
        {
            cell: row => 
            <div>
                <CustomMaterialMenu size="small" row={row} handleModalOption1Open={handleRecentTradeModalOpen} 
                    handleModalOption2Open={handleSecurityDetailModalOpen} handleModalOption3Open={handlePriceHistoryModalOpen}
                    handleModalOption4Open={handleShowLoansModalOpen} handleModalOption5Open={handleAccountDetailsModalOpen}
                />
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
            //minWidth: "125px",
            //center: true,
            wrap: true,
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
            name: <div>Orig Face</div>,
            selector: (row) => dollarFormatter0.format(row.orig_face),
            sortable: true,
            compact: true,
            center: true,
        },
        {
            name: <div>Curr Face</div>,
            selector: (row) => dollarFormatter0.format(row.curent_face),
            sortable: true,
            compact: true,
            //minWidth: "80px",
            center: true,
        },
        {
            name: <div>MKT Val</div>,
            selector: (row) => dollarFormatter0.format(row.mv),
            sortable: true,
            compact: true,
            //minWidth: '110px',
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
            name: <div>SP</div>,
            selector: (row) => row.carlton_SPRating,
            sortable: true,
            compact: true,
            minWidth: "40px",
            center: true,
            //maxWidth: "60px",
        },
        {
            name: <div>Fitch</div>,
            selector: (row) => row.carlton_FitchRating,
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: <div>KRD 6M</div>,
            selector: (row) => numberFormatter2.format(row.krD_6M),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: <div>KRD 1YR</div>,
            selector: (row) => numberFormatter2.format(row.krD_1YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: <div>KRD 2YR</div>,
            selector: (row) => numberFormatter2.format(row.krD_2YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: <div>KRD 3YR</div>,
            selector: (row) => numberFormatter2.format(row.krD_3YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: <div>KRD 5YR</div>,
            selector: (row) => numberFormatter2.format(row.krD_5YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: <div>KRD 7YR</div>,
            selector: (row) => numberFormatter2.format(row.krD_7YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: <div>KRD 10YR</div>,
            selector: (row) => numberFormatter2.format(row.krD_10YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: <div>KRD 20YR</div>,
            selector: (row) => numberFormatter2.format(row.krD_20YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: <div>KRD 30YR</div>,
            selector: (row) => numberFormatter2.format(row.krD_30YR),
            sortable: true,
            compact: true,
            minWidth: "50px",
            center: true,
        },
        {
            name: <div>Book G/L</div>,
            selector: (row) => numberFormatter0.format(row.book_gain_loss),
            sortable: true,
            compact: true,
            //minWidth: "80px",
            conditionalCellStyles: [
                {
                    when: (row) => row.book_gain_loss < 0,
                    style: { color: 'red' }
                }
            ],
            center: true,
        },
        {
            name: <div>DOD G/L</div>,
            selector: (row) => numberFormatter0.format(row.dod_gain_loss),
            sortable: true,
            compact: true,
            //minWidth: "80px",
            conditionalCellStyles: [
                {
                    when: (row) => row.dod_gain_loss < 0,
                    style: { color: 'red' }
                }
            ],
            center: true,
        },
        {
            name: <div>DOD Return</div>,
            selector: (row) => numberFormatter2.format(row.dod_return),
            sortable: true,
            compact: true,
            //minWidth: "90px",
            conditionalCellStyles: [
                {
                    when: (row) => row.dod_gain_loss < 0,
                    style: { color: 'red' }
                }
            ],
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
            when: row => row.sortOrder === 0,
            style: {
                fontWeight: 700,
                backgroundColor: hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].aggMaGroupRowColor0,
                color: "white"
            }
        },
        {
            when: row => (row.sortOrder === 1),//identifies the aggregate rows
            style: {
                backgroundColor: hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].aggMaGroupRowColor1,
                color: "white",
            }
        },
        {
            when: row => (row.sortOrder === 2),//identifies the aggregate rows
            style: {
                backgroundColor: hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].aggMaGroupRowColor2,
                color: "white",
            }
        },
        {
            when: row => (row.sortOrder === 3),//identifies the aggregate rows
            style: {
                backgroundColor: hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].aggMaGroupRowColor3,
                color: "white",
            }
        },
        {
            when: row => (row.sortOrder === 4),//identifies the aggregate rows
            style: {
                backgroundColor: hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].aggMaGroupRowColor4,
            }
        },
        {
            when: row => (row.sortOrder === 5),//identifies the aggregate rows
            style: {
                backgroundColor: hashMap[`tab${tabIndex}`].tableStyle[`${hashMap[`tab${tabIndex}`].req.positionView}`].aggMaGroupRowColor5,
            }
        },
    ]


    
    /* RENDERED ON UI */
    return (
        <div style={{ padding: "0px 2% 0% 2%", backgroundColor: "#F2F2F2",  /*border: "solid 2px green"*/ }}>

            <form id="risk-form" onSubmit={handleSearchButton}>

                <div id="input-group-container" className="input-group row" style={{ margin: "0px 0px"}}>

                    <div className="input-group-text col-4">
                    {/*<MultiSelectMenu name="multiSelect" required={true} rowsForSelect={rowsForSelect} handleMultiSelectChange={handleMultiSelectChange} handleMenuClose={handleMenuClose}/> */}
                    <SingleSelectMenu name="singleSelect" required={true} rowsForSelect={rowsForSelect} handleSingleSelectChange={handleSingleSelectChange} handleMenuClose={handleMenuClose} />
                    
                    <label htmlFor="aoDate"></label>
                    <input className="form-control" id="aoDate" type="date" name="aoDate" onChange={handleDateChange} value={hashMap[`tab${tabIndex}`].req.aoDate} pattern="\d{4}-\d{2}-\d{2}" placeholder="YYYY-MM-DD"/>
                    </div>

                    <div className="input-group-text col-4">
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

                    
                    <div className="input-group-text col-3">
        
                        <div className="form-check form-switch pe-2">
                            <input className="form-check-input" type="radio" id="noAggSwitch" name="aggRows" value="n" onChange={handleAggSwitchChange} defaultChecked/>
                            <label className="form-check-label" htmlFor="noAggSwitch">Do Not Aggregate</label>
                        </div>
                        {/*
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
                        */}
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="radio" id="secAggSwitch" name="aggRows" value="ys" onChange={handleAggSwitchChange}/>
                            <label className="form-check-label" htmlFor="secAggSwitch">Sector</label>
                        </div>
                    </div>

                    <div className="input-group-text col-1">
                            <button className="btn btn-sm btn-primary" id="search-button" type="submit">Run</button>
                            <ExportCSV csvData={hashMap[`tab${tabIndex}`].data} fileName={fileNameConstructor(hashMap, tabIndex)} />
                    </div>
                    
                </div>
            </form>
            {
                tabIndex >= 0 && 
                <div id="data-table-container">
                    <PopModal data={modalData} isOpen={isModalOpen} onClose={handleModalClose} columns={modalColumns} modalTitle={modalTitle}/>

                    <Tabs selectedIndex={tabIndex} onSelect={handleTabOnSelect}>
                        <TabList>
                            <Tab>Risk Holdings</Tab>
                            {tabListArr}
                            <input id="filter-bar" placeholder="Filter..." type="text" onChange={handleFilter}/>
                            <button className="btn btn-sm btn-danger" id="remove-tab-button" onClick={handleRemoveSelectedTabClick}>Remove Tab</button>
                            <button className="btn btn-sm btn-primary" id="add-tab-button" type="button" onClick={handleAddTabClick}>Add Tab</button>
                            
                        </TabList>
                        

                        <TabPanel>
                            <DataTable
                                title={<div style={{ display: "flex", justifyContent: "space-between"}}> <h3 style={{ color: "white" }}>{hashMap.tab0.dataTableTitle} Risk Holdings: {hashMap.tab0.tableStyle[`${hashMap.tab0.req.positionView}`].title} View</h3> <h3 style={{ color: 'white'}}>{sqlDateToDateString(hashMap.tab0.req.aoDate)}</h3> </div>}
                                subHeader subHeaderComponent={SubHeaderComponent}  
                                columns={columnHeaders}
                                data={hashMap.tab0.currentRecords}
                                highlightOnHover
                                striped
                                customStyles={customStyles}
                                conditionalRowStyles={conditionalRowStyles}
                                expandableRows
                                expandableRowsComponent={ExpandedDetailsTable}
                                fixedHeader //fixedHeaderScrollHeight="710px"
                                responsive
                                onRowDoubleClicked={handleDoubleClick}
                                pagination paginationPerPage={10000} 
                                paginationRowsPerPageOptions={[100, 200, 300, 400, 500, 1000, 10000]}
                                paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: "All" }}
                                progressPending = {hashMap.tab0.pending}
                                progressComponent={<CustomLoader/>}
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