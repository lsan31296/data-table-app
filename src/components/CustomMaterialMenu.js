import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { /*FaRegCopy, FaShareAlt, */ FaEllipsisV } from 'react-icons/fa';
import { getUspTrade, getSecurityDetail, getPriceHistory, getShowLoans, getAccountDetails } from '../api';
import { dateFormatter, dateSorterMMDDYYY, dollarFormatter, dollarFormatter0, formatWeight, numberFormatter2, sqlDateToDateString } from '../utils/helperFunctions';
import CustomCell from './CustomCell';

export default function CustomMaterialMenu({ row, handleModalOption1Open, handleModalOption2Open, handleModalOption3Open, handleModalOption4Open, handleModalOption5Open}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    //const [openModal, setOpenModal] = React.useState(false);
    //const [option1Data, setOption1Data] = React.useState(null)


    const handleClick = (event) => {
        console.log("Row from Options: ", row);
        //console.log("Current Target: ", event.currentTarget);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleModalClickRecentTrade = async (event) => {
        const uspTradeRes = await getUspTrade({ account: row.account, cusip: row.bbg_cusip});
        const title = 'Recent Trade History';
        const recentTradeModalColumns = [
            {
                name: "Trade Date",
                selector: (row) => sqlDateToDateString(dateFormatter(row.trade_date)),
                compact: true,
                reorder: true,
            },
            {
                name: "Settle Date",
                selector: (row) => sqlDateToDateString(dateFormatter(row.settle_date)),
                compact: true,
                reorder: true,
            },
            {
                name: "Transaction Type",
                selector: (row) => row.trans_type,
                compact: true,
                reorder: true,
            }, 
            {
                name: "Account",
                selector: (row) => row.account,
                compact: true,
                reorder: true,
                minWidth: "60px",
            }, 
            {
                name: "Advent Portfolio ID",
                selector: (row) => row.advPortfolioId,
                compact: true,
                reorder: true,
                minWidth: "120px",
            },
            {
                name: "Advent Security ID",
                selector: (row) => row.advSecurityId,
                compact: true,
                reorder: true,
                minWidth: "120px",
            },
            {
                name: "Security Name",
                selector: (row) => row.sec_name,
                compact: true,
                reorder: true,
                minWidth: "86px",
                wrap: true,
            },
            {
                name: "Pool Name",
                selector: (row) => row.pool_name,
                compact: true,
                reorder: true,
                minWidth: "86px",
                wrap: true, 
            },
            {
                name: "CUSIP",
                selector: (row) => row.cusip,
                compact: true,
                reorder: true,
                minWidth: "90px",
            },
            {
                name: "Symbol",
                selector: (row) => row.symbol,
                compact: true,
                reorder: true,
            },
            {
                name: "Original Face",
                selector: (row) => dollarFormatter0.format(row.orig_face),
                compact: true,
                reorder: true,
            },
            {
                name: "Current Face",
                selector: (row) => dollarFormatter0.format(row.curr_face),
                compact: true,
                reorder: true,
            },
            {
                name: "Price",
                selector: (row) => dollarFormatter.format(row.price),
                compact: true,
                reorder: true,
                minWidth: "75px",
            },
            {
                name: "Accrued",
                selector: (row) => dollarFormatter.format(row.accrued),
                compact: true,
                reorder: true,
                minWidth: "80px",
            },
            {
                name: "Net Money",
                selector: (row) => dollarFormatter.format(row.net_money),
                compact: true,
                reorder: true,
            },
            {
                name: "Dealer",
                selector: (row) => row.dealer,
                compact: true,
                reorder: true,
                wrap: true,
            },
        ];

        if (uspTradeRes.length === 0) {
            alert(`No recent trade has been located for this CUSIP.`);
        } else {
            //Insert modal here!
            //setOpenModal(true);
            handleModalOption1Open(uspTradeRes, title, recentTradeModalColumns);
        }
    };
    const handleModalClickSecurityDetail = async(event) => {       
        const securityDetailRes = await getSecurityDetail({ cusip: row.bbg_cusip});
        const title = 'Security Detail';
        const securityDetailModalColumns = [
            {
                name: 'ID',
                selector: (row) => row.id,
                compact: true,
                reorder: true,
                minWidth: '60px',
            },
            {
                name: 'CUSIP',
                selector: (row) => row.cusip,
                compact: true,
                reorder: true,
                minWidth: '80px'
            }, 
            {
                name: 'Ticker',
                selector: (row) => row.ticker,
                compact: true,
                reorder: true
            },
            {
                name: 'Name',
                selector: (row) => row.name,
                compact: true,
                reorder: true,
                maxWidth: '150px',
                wrap: true,
            },
            {
                name: 'LT Date',
                selector: (row) => sqlDateToDateString(dateFormatter(row.lastTradeableDate)),
                compact: true,
                reorder: true,
            },
            {
                name: 'Last Price',
                selector: (row) => dollarFormatter.format(row.lastPrice),
                compact: true,
                reorder: true,
            },
            {
                name: 'Issuer',
                selector: (row) => row.issuer,
                compact: true,
                reorder: true,
                wrap: true,
            },
            {
                name: 'Sec Type',
                selector: (row) => row.security_typ,
                compact: true,
                reorder: true,
            },
            {
                name: 'GICS Industry Group',
                selector: (row) => row.gics_industry_group,
                compact: true,
                reorder: true,
                minWidth: '150px'
            },
            {
                name: 'GICS Sec',
                selector: (row) => row.gics_sector,
                compact: true,
                reorder: true,
            },
            {
                name: 'BICS 2 Ind Group Name',
                selector: (row) => row.bics_level_2_industry_group_name,
                compact: true,
                reorder: true,
                minWidth: '160px',
            },
            {
                name: 'EXCH Code',
                selector: (row) => row.exch_code,
                compact: true,
                reorder: true,
            },
            {
                name: 'Primary EXCH Name',
                selector: (row) => row.primary_exchange_name,
                compact: true,
                reorder: true,
                minWidth: '120px'
            },
            {
                name: 'Ind Group',
                selector: (row) => row.industry_group,
                compact: true,
                reorder: true,
                wrap: true,
            },
            {
                name: 'Country',
                selector: (row) => row.country,
                compact: true,
                reorder: true,
            },
            {
                name: 'Market Sec Des',
                selector: (row) => row.market_sector_des,
                compact: true,
                reorder: true,
            },
            {
                name: '144A Flag',
                selector: (row) => row.one_four_four_a_flag,
                compact: true,
                reorder: true,
            },
            {
                name: 'Muni Issue Size',
                selector: (row) => row.muni_issue_size,
                compact: true,
                reorder: true,
            },
            {
                name: 'Mtg Agency Backed',
                selector: (row) => row.mtg_is_agency_backed,
                compact: true,
                reorder: true,
                minWidth: '110px'
            }
        ]

        if (securityDetailRes.length === 0) {
            alert(`This security has no details to display.`);
        } else {
            handleModalOption2Open(securityDetailRes, title, securityDetailModalColumns);
        }
    }
    const handleModalClickPriceHistory = async(event) => {
        //Mock data, just need to implement middle-tier endpoint and call here for 'priceHistoryRes' 
        //const priceHistoryRes = [{ aoDate: '2023-08-02', cusip: '00091XAA5', priceValue: '100.003'}];
        const priceHistoryRes = await getPriceHistory({ cusip: row.bbg_cusip });
        const title = 'Price History';
        const priceHistoryModalColumns = [
            {
                name:'AO Date',
                selector: (row) => sqlDateToDateString(dateFormatter(row.aoDate)),
                compact: true,
                reorder: true,
                sortable: true,
                sortFunction: dateSorterMMDDYYY,
            },
            {
                name: 'CUSIP',
                selector: (row) => row.cusip,
                compact: true,
                reorder: true,
            },
            {
                name: 'PriceValue',
                selector: (row) => dollarFormatter.format(row.priceValue),
                compact: true,
                reorder: true,
                sortable: true,
            }
        ];
        
        if (priceHistoryRes.length === 0) {
            alert(`This CUSIP has no Price History.`);
        } else {
            handleModalOption3Open(priceHistoryRes, title, priceHistoryModalColumns);
        }
    };
    const handleModalClickShowLoans = async(event) => {
        const showLoansRes = await getShowLoans({ cusip: row.bbg_cusip });
        const title = 'Show Loans';
        const showLoansModalColumns = [
            {
                name: 'Cusip',
                selector: (row, index) => {
                    if (!row.cusip) {
                        showLoansModalColumns[0].omit = true;
                        return;
                    }
                    return row.cusip
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Loan ID',
                selector: (row) => {
                    if (!row.loandId) {
                        showLoansModalColumns[1].omit = true;
                        return;
                    }
                    return row.loandId;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Issuer',
                selector: (row) => {
                    if(!row.issuer) {
                        showLoansModalColumns[2].omit = true;
                        return;
                    }
                    return row.issuer;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: 'Security Name',
                selector: (row,index) => {
                    if (!row.securityName) {
                        showLoansModalColumns[3].omit = true;
                        return;
                    }
                    return row.securityName;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: 'Rehab',
                selector: (row,index) => {
                    if (!row.rehab) {
                        showLoansModalColumns[4].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.rehab === true ? true : false }/>;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Affordable',
                selector: (row,index) => {
                    if (!row.affordable) {
                        showLoansModalColumns[5].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.affordable === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Arts cul',
                selector: (row,index) => {
                    if (!row.artsCul) {
                        showLoansModalColumns[6].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.artsCul === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Dis Rec',
                selector: (row,index) => {
                    if (!row.disRec) {
                        showLoansModalColumns[7].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.disRec === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Educ',
                selector: (row,index) => {
                    if (!row.educ) {
                        showLoansModalColumns[8].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.educ === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Dis Rec',
                selector: (row,index) => {
                    if (!row.disRec) {
                        showLoansModalColumns[9].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.disRec === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'EntDev',
                selector: (row,index) => {
                    if (!row.entDev) {
                        showLoansModalColumns[10].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.entDev === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Green',
                selector: (row,index) => {
                    if (!row.green) {
                        showLoansModalColumns[11].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.green === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Gender',
                selector: (row,index) => {
                    if (!row.gender) {
                        showLoansModalColumns[12].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.gender === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Gov',
                selector: (row,index) => {
                    if (!row.gov) {
                        showLoansModalColumns[13].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.gov === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Healthy',
                selector: (row,index) => {
                    if (!row.healthy) {
                        showLoansModalColumns[14].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.healthy === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Human Empathy',
                selector: (row,index) => {
                    if (!row.humEmp) {
                        showLoansModalColumns[15].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.humEmp === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Minority',
                selector: (row,index) => {
                    if (!row.minority) {
                        showLoansModalColumns[16].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.minority === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Revit',
                selector: (row,index) => {
                    if (!row.revit) {
                        showLoansModalColumns[17].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.revit === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Rural',
                selector: (row,index) => {
                    if (!row.rural) {
                        showLoansModalColumns[18].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.rural === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Seniors',
                selector: (row,index) => {
                    if (!row.seniors) {
                        showLoansModalColumns[19].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.seniors === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Agricultural',
                selector: (row,index) => {
                    if (!row.agr) {
                        showLoansModalColumns[20].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.agr === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'TOD',
                selector: (row,index) => {
                    if (!row.tod) {
                        showLoansModalColumns[21].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.tod === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Economic',
                selector: (row,index) => {
                    if (!row.economic) {
                        showLoansModalColumns[22].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.economic === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Faith',
                selector: (row,index) => {
                    if (!row.faith) {
                        showLoansModalColumns[23].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.faith === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'mCares',
                selector: (row,index) => {
                    if (!row.mCares) {
                        showLoansModalColumns[24].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.mCares === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'COVID',
                selector: (row,index) => {
                    if (!row.covid) {
                        showLoansModalColumns[25].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.covid === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>mCares Initiative</div>,
                selector: (row,index) => {
                    if (!row.mCaresInitiative) {
                        showLoansModalColumns[26].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.mCaresInitiative === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>COVID Initiative</div>,
                selector: (row,index) => {
                    if (!row.covidInitiative) {
                        showLoansModalColumns[27].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.covidInitiative === true ? true : false }/>
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Security ID',
                selector: (row,index) => {
                    if (!row.securityId) {
                        showLoansModalColumns[28].omit = true;
                        return;
                    }
                    return row.securityId;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Number',
                selector: (row,index) => {
                    if (!row.number) {
                        showLoansModalColumns[29].omit = true;
                        return;
                    }
                    return row.number;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Rate',
                selector: (row,index) => {
                    if (!row.rate) {
                        showLoansModalColumns[30].omit = true;
                        return;
                    }
                    return formatWeight(row.rate);
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Amount',
                selector: (row,index) => {
                    if (!row.amount) {
                        showLoansModalColumns[31].omit = true;
                        return;
                    }
                    return dollarFormatter0.format(row.amount);
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'FICO',
                selector: (row,index) => {
                    if (!row.fico) {
                        showLoansModalColumns[32].omit = true;
                        return;
                    }
                    return row.fico;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Term',
                selector: (row,index) => {
                    if (!row.term) {
                        showLoansModalColumns[33].omit = true;
                        return;
                    }
                    return row.term;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'LTV',
                selector: (row,index) => {
                    if (!row.ltv) {
                        showLoansModalColumns[34].omit = true;
                        return;
                    }
                    return row.ltv;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Occupancy',
                selector: (row,index) => {
                    if (!row.occupancy) {
                        showLoansModalColumns[35].omit = true;
                        return;
                    }
                    return row.occupancy;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: 'Security Type',
                selector: (row,index) => {
                    if (!row.securityType) {
                        showLoansModalColumns[36].omit = true;
                        return;
                    }
                    return row.securityType;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: 'Address',
                selector: (row,index) => {
                    if (!row.address) {
                        showLoansModalColumns[37].omit = true;
                        return;
                    }
                    return row.address;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: 'City ID',
                selector: (row,index) => {
                    if (!row.cityId) {
                        showLoansModalColumns[38].omit = true;
                        return;
                    }
                    return row.cityId;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'City',
                selector: (row,index) => {
                    if (!row.city) {
                        showLoansModalColumns[39].omit = true;
                        return;
                    }
                    return row.city;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'State ID',
                selector: (row,index) => {
                    if (!row.stateId) {
                        showLoansModalColumns[40].omit = true;
                        return;
                    }
                    return row.stateId;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'State',
                selector: (row,index) => {
                    if (!row.state) {
                        showLoansModalColumns[41].omit = true;
                        return;
                    }
                    return row.state;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: <div>State County Code</div>,
                selector: (row,index) => {
                    if (!row.stateCountyCode) {
                        showLoansModalColumns[42].omit = true;
                        return;
                    }
                    return row.stateCountyCode;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Class Code',
                selector: (row,index) => {
                    if (!row.classCode) {
                        showLoansModalColumns[43].omit = true;
                        return;
                    }
                    return row.classCode;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'County',
                selector: (row,index) => {
                    if (!row.county) {
                        showLoansModalColumns[44].omit = true;
                        return;
                    }
                    return row.county;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: 'Is PPC',
                selector: (row,index) => {
                    if (!row.isPPC) {
                        showLoansModalColumns[45].omit = true;
                        return;
                    }
                    return row.isPPC;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Zip Code',
                selector: (row,index) => {
                    if (!row.zipCode) {
                        showLoansModalColumns[46].omit = true;
                        return;
                    }
                    return row.zipCode;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Annual Income',
                selector: (row,index) => {
                    if (!row.annualIncome) {
                        showLoansModalColumns[47].omit = true;
                        return;
                    }
                    return dollarFormatter.format(row.annualIncome);
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'MSA Number',
                selector: (row,index) => {
                    if (!row.msaNumber) {
                        showLoansModalColumns[48].omit = true;
                        return;
                    }
                    return row.msaNumber;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Percent Median',
                selector: (row,index) => {
                    if (!row.percentMedian) {
                        showLoansModalColumns[49].omit = true;
                        return;
                    }
                    return row.percentMedian;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'MFI ID',
                selector: (row,index) => {
                    if (!row.mfiId) {
                        showLoansModalColumns[50].omit = true;
                        return;
                    }
                    return row.mfiId;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Census Tract',
                selector: (row,index) => {
                    if (!row.censusTract) {
                        showLoansModalColumns[51].omit = true;
                        return;
                    }
                    return row.censusTract;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'LI Ratio',
                selector: (row,index) => {
                    if (!row.liRatio) {
                        showLoansModalColumns[52].omit = true;
                        return;
                    }
                    return row.liRatio;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>CCM Percent Of MF</div>,
                selector: (row,index) => {
                    if (!row.ccmPercentOfMf) {
                        showLoansModalColumns[53].omit = true;
                        return;
                    }
                    return row.ccmPercentOfMf;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Expr 1',
                selector: (row,index) => {
                    if (!row.expr1) {
                        showLoansModalColumns[54].omit = true;
                        return;
                    }
                    return row.expr1;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Race',
                selector: (row,index) => {
                    if (!row.race) {
                        showLoansModalColumns[55].omit = true;
                        return;
                    }
                    return row.race;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: 'Ethnicity',
                selector: (row,index) => {
                    if (!row.ethnicity) {
                        showLoansModalColumns[56].omit = true;
                        return;
                    }
                    return row.ethnicity;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: <div>FFIEC MSA Code</div>,
                selector: (row,index) => {
                    if (!row.ffiecMsaCode) {
                        showLoansModalColumns[57].omit = true;
                        return;
                    }
                    return row.ffiecMsaCode;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC County Code</div>,
                selector: (row,index) => {
                    if (!row.ffiecCountyCode) {
                        showLoansModalColumns[58].omit = true;
                        return;
                    }
                    return row.ffiecCountyCode;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC Census Tract</div>,
                selector: (row,index) => {
                    if (!row.ffiecCensusTract) {
                        showLoansModalColumns[59].omit = true;
                        return;
                    }
                    return row.ffiecCensusTract;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC County Name</div>,
                selector: (row,index) => {
                    if (!row.ffiecCountyName) {
                        showLoansModalColumns[60].omit = true;
                        return;
                    }
                    return row.ffiecCountyName;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC Income Level</div>,
                selector: (row,index) => {
                    if (!row.ffiecIncomeLevel) {
                        showLoansModalColumns[61].omit = true;
                        return;
                    }
                    return row.ffiecIncomeLevel;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC Distressed</div>,
                selector: (row,index) => {
                    if (!row.ffiecDistressed) {
                        showLoansModalColumns[62].omit = true;
                        return;
                    }
                    return row.ffiecDistressed;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC MFI</div>,
                selector: (row,index) => {
                    if (!row.ffiecMfi) {
                        showLoansModalColumns[63].omit = true;
                        return;
                    }
                    return row.ffiecMfi;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC Tract Percent Minority</div>,
                selector: (row,index) => {
                    if (!row.ffiecTractPercentMinority) {
                        showLoansModalColumns[64].omit = true;
                        return;
                    }
                    return row.ffiecTractPercentMinority;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC Percent Poverty</div>,
                selector: (row,index) => {
                    if (!row.ffiecPercentPoverty) {
                        showLoansModalColumns[65].omit = true;
                        return;
                    }
                    return row.ffiecPercentPoverty;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC State Code</div>,
                selector: (row,index) => {
                    if (!row.ffiecStateCode) {
                        showLoansModalColumns[66].omit = true;
                        return;
                    }
                    return row.ffiecStateCode;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC MSA MFI Percent</div>,
                selector: (row,index) => {
                    if (!row.ffiecMsamfiPercent) {
                        showLoansModalColumns[67].omit = true;
                        return;
                    }
                    return row.ffiecMsamfiPercent;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC State</div>,
                selector: (row,index) => {
                    if (!row.ffiecState) {
                        showLoansModalColumns[68].omit = true;
                        return;
                    }
                    return row.ffiecState;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC Zipo Code</div>,
                selector: (row,index) => {
                    if (!row.ffiecZipoCode) {
                        showLoansModalColumns[69].omit = true;
                        return;
                    }
                    return row.ffiecZipoCode;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Walk Score',
                selector: (row,index) => {
                    if (!row.walkScore) {
                        showLoansModalColumns[70].omit = true;
                        return;
                    }
                    return row.walkScore;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Walk Score Description</div>,
                selector: (row,index) => {
                    if (!row.walkScoreDescription) {
                        showLoansModalColumns[71].omit = true;
                        return;
                    }
                    return row.walkScoreDescription;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: 'Bike Score',
                selector: (row,index) => {
                    if (!row.bikeScore) {
                        showLoansModalColumns[72].omit = true;
                        return;
                    }
                    return row.bikeScore;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Bike Score Description</div>,
                selector: (row,index) => {
                    if (!row.bikeScoreDescription) {
                        showLoansModalColumns[73].omit = true;
                        return;
                    }
                    return row.bikeScoreDescription;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: 'Transit Score',
                selector: (row,index) => {
                    if (!row.transitScore) {
                        showLoansModalColumns[74].omit = true;
                        return;
                    }
                    return row.transitScore;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Transit Score Description</div>,
                selector: (row,index) => {
                    if (!row.transitScoreDescription) {
                        showLoansModalColumns[75].omit = true;
                        return;
                    }
                    return row.transitScoreDescription;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: 'Latitude',
                selector: (row,index) => {
                    if (!row.latitude) {
                        showLoansModalColumns[76].omit = true;
                        return;
                    }
                    return numberFormatter2.format(row.latitude);
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Longitude',
                selector: (row,index) => {
                    if (!row.longitude) {
                        showLoansModalColumns[77].omit = true;
                        return;
                    }
                    return numberFormatter2.format(row.longitude);
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Gender 2',
                selector: (row,index) => {
                    if (!row.gender2) {
                        showLoansModalColumns[78].omit = true;
                        return;
                    }
                    return row.gender2;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Race 2',
                selector: (row,index) => {
                    if (!row.race2) {
                        showLoansModalColumns[79].omit = true;
                        return;
                    }
                    return row.race2;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Ethnicity 2',
                selector: (row,index) => {
                    if (!row.ethnicity2) {
                        showLoansModalColumns[80].omit = true;
                        return;
                    }
                    return row.ethnicity2;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Pool Number',
                selector: (row,index) => {
                    if (!row.poolNumber) {
                        showLoansModalColumns[81].omit = true;
                        return;
                    }
                    return row.poolNumber;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Expr 2',
                selector: (row,index) => {
                    if (!row.expr2) {
                        showLoansModalColumns[82].omit = true;
                        return;
                    }
                    return row.expr2;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Orig Amount',
                selector: (row,index) => {
                    if (!row.originalAmount) {
                        showLoansModalColumns[83].omit = true;
                        return;
                    }
                    return row.originalAmount;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Curr Factor',
                selector: (row,index) => {
                    if (!row.currentFactor) {
                        showLoansModalColumns[84].omit = true;
                        return;
                    }
                    return row.currentFactor;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Curr Amount',
                selector: (row,index) => {
                    if (!row.currentAmount) {
                        showLoansModalColumns[85].omit = true;
                        return;
                    }
                    return row.currentAmount;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Property Name',
                selector: (row,index) => {
                    if (!row.propertyName) {
                        showLoansModalColumns[86].omit = true;
                        return;
                    }
                    return row.propertyName;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: 'Issue Date',
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.issueDate))) {
                        showLoansModalColumns[87].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.issueDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Maturity Date',
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.maturityDate))) {
                        showLoansModalColumns[88].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.maturityDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Affordable ID',
                selector: (row,index) => {
                    if (!row.affordableId) {
                        showLoansModalColumns[89].omit = true;
                        return;
                    }
                    return row.affordableId;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FHA Case Number</div>,
                selector: (row,index) => {
                    if (!row.fhaCasNumber) {
                        showLoansModalColumns[90].omit = true;
                        return;
                    }
                    return row.fhaCasNumber;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Acknowledge Unaffordable</div>,
                selector: (row,index) => {
                    if (!row.acknowledgeUnaffordable) {
                        showLoansModalColumns[91].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.acknowledgeUnaffordable === true ? true : false }/>;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Unaffordable Comment</div>,
                selector: (row,index) => {
                    if (!row.unaffordableComment) {
                        showLoansModalColumns[92].omit = true;
                        return;
                    }
                    return row.unaffordableComment;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Unaffordable Overriding User ID</div>,
                selector: (row,index) => {
                    if (!row.unaffordableOverridingUserId) {
                        showLoansModalColumns[93].omit = true;
                        return;
                    }
                    return row.unaffordableOverridingUserId;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'MFI',
                selector: (row,index) => {
                    if (!row.mfi) {
                        showLoansModalColumns[94].omit = true;
                        return;
                    }
                    return row.mfi;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Units A',
                selector: (row,index) => {
                    if (!row.unitsA) {
                        showLoansModalColumns[95].omit = true;
                        return;
                    }
                    return row.unitsB;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Units B',
                selector: (row,index) => {
                    if (!row.unitsB) {
                        showLoansModalColumns[96].omit = true;
                        return;
                    }
                    return row.unitsB;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Non CRA Qualified</div>,
                selector: (row,index) => {
                    if (!row.nonCraQualified) {
                        showLoansModalColumns[97].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.nonCraQualified === true ? true : false }/>;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Contract',
                selector: (row,index) => {
                    if (!row.contract) {
                        showLoansModalColumns[98].omit = true;
                        return;
                    }
                    return row.contract;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Contract Start Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.contractStartDate))) {
                        showLoansModalColumns[99].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.contractStartDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Contract End Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.contractEndDate))) {
                        showLoansModalColumns[100].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.contractEndDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Create Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.createDate))) {
                        showLoansModalColumns[101].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.createDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC Looked Up</div>,
                selector: (row,index) => {
                    if (!row.ffiecLookedUp) {
                        showLoansModalColumns[102].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.ffiecLookedUp === true ? true : false }/>;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Recap Loan',
                selector: (row,index) => {
                    if (!row.recapLoan) {
                        showLoansModalColumns[103].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.recapLoan === true ? true : false }/>;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Tracker Loan ID</div>,
                selector: (row,index) => {
                    if (!row.trackerLoanId) {
                        showLoansModalColumns[104].omit = true;
                        return;
                    }
                    return row.trackerLoanId;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'General Text',
                selector: (row,index) => {
                    if (!row.generalText) {
                        showLoansModalColumns[105].omit = true;
                        return;
                    }
                    return row.generalText;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Google Address</div>,
                selector: (row,index) => {
                    if (!row.googleAddress) {
                        showLoansModalColumns[106].omit = true;
                        return;
                    }
                    return row.googleAddress;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: <div>Tracker Loan ID</div>,
                selector: (row,index) => {
                    if (!row.trackerLoanId) {
                        showLoansModalColumns[107].omit = true;
                        return;
                    }
                    return row.trackerLoanId;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Google Looked Up</div>,
                selector: (row,index) => {
                    if (!row.googleLookedUp) {
                        showLoansModalColumns[108].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.googleLookedUp === true ? true : false }/>;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Difficult Development Area</div>,
                selector: (row,index) => {
                    if (!row.difficultDevelopmentArea) {
                        showLoansModalColumns[109].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.difficultDevelopmentArea === true ? true : false }/>;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Rural Census Tract and MSA</div>,
                selector: (row,index) => {
                    if (!row.ruralCensusTractAndMsa) {
                        showLoansModalColumns[110].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.ruralCensusTractAndMsa === true ? true : false }/>;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Persistent Poverty County</div>,
                selector: (row,index) => {
                    if (!row.persistentPovertyCounty) {
                        showLoansModalColumns[111].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.persistentPovertyCounty === true ? true : false }/>;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>FFIEC Lookup Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.ffiecLookupDate))) {
                        showLoansModalColumns[112].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.ffiecLookupDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Walk Score Lookup Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.walkScoreLookupDate))) {
                        showLoansModalColumns[113].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.walkScoreLookupDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Recap Lookup Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.recapLookupDate))) {
                        showLoansModalColumns[114].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.recapLookupDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Difficult Dev Area Lookup Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.difficultDevelopmentAreaLookupDate))) {
                        showLoansModalColumns[115].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.difficultDevelopmentAreaLookupDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Persistent Poverty County Lookup Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.persistentPovertyCountyLookupDate))) {
                        showLoansModalColumns[116].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.persistentPovertyCountyLookupDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Geo Coded Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.geoCodedDate))) {
                        showLoansModalColumns[117].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.geoCodedDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Census Data Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.censusDataDate))) {
                        showLoansModalColumns[118].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.censusDataDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Rural Census Tract and MSA Lookup Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.ruralCensusTractAndMsaLookupDate))) {
                        showLoansModalColumns[119].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.ruralCensusTractAndMsaLookupDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Units C',
                selector: (row,index) => {
                    if (!row.unitsC) {
                        showLoansModalColumns[120].omit = true;
                        return;
                    }
                    return row.unitsC;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Units D',
                selector: (row,index) => {
                    if (!row.unitsD) {
                        showLoansModalColumns[121].omit = true;
                        return;
                    }
                    return row.unitsD;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Expr 3',
                selector: (row,index) => {
                    if (!row.expr3) {
                        showLoansModalColumns[122].omit = true;
                        return;
                    }
                    return row.expr3;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'MSA Code',
                selector: (row,index) => {
                    if (!row.msaCode) {
                        showLoansModalColumns[123].omit = true;
                        return;
                    }
                    return row.msaCode;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'MSA Name',
                selector: (row,index) => {
                    if (!row.msaName) {
                        showLoansModalColumns[124].omit = true;
                        return;
                    }
                    return row.msaName;
                },
                compact: true,
                reorder: true,
                center: true,
                wrap: true,
            },
            {
                name: 'Source',
                selector: (row,index) => {
                    if (!row.source) {
                        showLoansModalColumns[125].omit = true;
                        return;
                    }
                    return row.source;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Year',
                selector: (row,index) => {
                    if (!row.year) {
                        showLoansModalColumns[126].omit = true;
                        return;
                    }
                    return row.year;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Use As Current</div>,
                selector: (row,index) => {
                    if (!row.useAsCurrent) {
                        showLoansModalColumns[127].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.useAsCurrent === true ? true : false }/>;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Record Type',
                selector: (row,index) => {
                    if (!row.recordType) {
                        showLoansModalColumns[128].omit = true;
                        return;
                    }
                    return row.recordType;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Property ID',
                selector: (row,index) => {
                    if (!row.propertyId) {
                        showLoansModalColumns[129].omit = true;
                        return;
                    }
                    return row.propertyId;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Expr 4',
                selector: (row,index) => {
                    if (!row.expr4) {
                        showLoansModalColumns[130].omit = true;
                        return;
                    }
                    return row.expr4;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Affordable Address</div>,
                selector: (row,index) => {
                    if (!row.affordableAddress) {
                        showLoansModalColumns[131].omit = true;
                        return;
                    }
                    return row.affordableAddress;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Affordable City',
                selector: (row,index) => {
                    if (!row.affordableCity) {
                        showLoansModalColumns[132].omit = true;
                        return;
                    }
                    return row.affordableCity;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Affordable State',
                selector: (row,index) => {
                    if (!row.affordableState) {
                        showLoansModalColumns[133].omit = true;
                        return;
                    }
                    return row.affordableState;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Affordable Zip',
                selector: (row,index) => {
                    if (!row.affordableZip) {
                        showLoansModalColumns[134].omit = true;
                        return;
                    }
                    return row.affordableZip;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Affordable County Code</div>,
                selector: (row,index) => {
                    if (!row.affordableCountyCode) {
                        showLoansModalColumns[135].omit = true;
                        return;
                    }
                    return row.affordableCountyCode;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Affordable County</div>,
                selector: (row,index) => {
                    if (!row.affordableCounty) {
                        showLoansModalColumns[136].omit = true;
                        return;
                    }
                    return row.affordableCounty;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Total Units',
                selector: (row,index) => {
                    if (!row.totalUnits) {
                        showLoansModalColumns[137].omit = true;
                        return;
                    }
                    return row.totalUnits;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Tracs Overall Expiration Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.tracsOverallExpirationDate))) {
                        showLoansModalColumns[138].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.tracsOverallExpirationDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Tracs Status Name</div>,
                selector: (row,index) => {
                    if (!row.tracsStatusName) {
                        showLoansModalColumns[139].omit = true;
                        return;
                    }
                    return row.tracsStatusName;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Assisted Units Count</div>,
                selector: (row,index) => {
                    if (!row.assistedUnitsCount) {
                        showLoansModalColumns[140].omit = true;
                        return;
                    }
                    return row.assistedUnitsCount;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'HUD ID',
                selector: (row,index) => {
                    if (!row.hudId) {
                        showLoansModalColumns[141].omit = true;
                        return;
                    }
                    return row.hudId;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'N Units',
                selector: (row,index) => {
                    if (!row.nUnits) {
                        showLoansModalColumns[142].omit = true;
                        return;
                    }
                    return row.nUnits;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'LI Units',
                selector: (row,index) => {
                    if (!row.liUnits) {
                        showLoansModalColumns[143].omit = true;
                        return;
                    }
                    return row.liUnits;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Year Allocation</div>,
                selector: (row,index) => {
                    if (!row.yrAlloc) {
                        showLoansModalColumns[144].omit = true;
                        return;
                    }
                    return row.yrAlloc;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Custom',
                selector: (row,index) => {
                    if (!row.custom) {
                        showLoansModalColumns[145].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.custom === true ? true : false }/>;;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Is Legacy',
                selector: (row,index) => {
                    if (!row.isLegacy) {
                        showLoansModalColumns[146].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.isLegacy === true ? true : false }/>;;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Is Rolled Up</div>,
                selector: (row,index) => {
                    if (!row.isRolledUp) {
                        showLoansModalColumns[147].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.isRolledUp === true ? true : false }/>;;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Is Dated Mismatched</div>,
                selector: (row,index) => {
                    if (!row.isDateMismatch) {
                        showLoansModalColumns[148].omit = true;
                        return;
                    }
                    return <input className="form-check-input" type="checkbox" value="" disabled checked={row.isDateMismatch === true ? true : false }/>;;
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: <div>Tracs Effective Date</div>,
                selector: (row,index) => {
                    if (!sqlDateToDateString(dateFormatter(row.tracsEffectiveDate))) {
                        showLoansModalColumns[149].omit = true;
                        return;
                    }
                    return sqlDateToDateString(dateFormatter(row.tracsEffectiveDate));
                },
                compact: true,
                reorder: true,
                center: true,
            },
            {
                name: 'Contract Number',
                selector: (row,index) => {
                    if (!row.contractNumber) {
                        showLoansModalColumns[150].omit = true;
                        return;
                    }
                    return row.contractNumber;
                },
                compact: true,
                reorder: true,
                center: true,
            },
        ];
        
        if (showLoansRes.length === 0) {
            alert(`No underlying loans has been found for this CUSIP.`);
        } else {
            handleModalOption4Open(showLoansRes, title, showLoansModalColumns);
        }
    };
    const handleModalClickAccountDetails = async(event) => {
        const accountDetailsRes = await getAccountDetails({ apxPortfolioCode: row.account });
        const title = 'Account Details';
        const accountDetailsModalColumns = [
            {
                name: "ID",
                selector: (row) => row.id,
                compact: true,
                reorder: true,
            },
            {
                name: "Name",
                selector: (row) => row.name,
                compact: true,
                reorder: true,
                wrap: true,
            },
            {
                name: "Number",
                selector: (row) => row.number,
                compact: true,
                reorder: true,
            },
            {
                name: "Ticker",
                selector: (row) => row.ticker,
                compact: true,
                reorder: true,
            },
            {
                name: "APX Portfolio Code",
                selector: (row) => row.apxPortfolioCode,
                compact: true,
                reorder: true,
                wrap: true,
                minWidth: "140px"
            },
            {
                name: "Open Date",
                selector: (row) => sqlDateToDateString(dateFormatter(row.openDate)),
                compact: true,
                reorder: true,
            },
            {
                name: "Close Date",
                selector: (row) => sqlDateToDateString(dateFormatter(row.closeDate)),
                compact: true,
                reorder: true,
            },
            {
                name: "Custodian ID",
                selector: (row) => row.custodianId,
                compact: true,
                reorder: true,
            },
            {
                name: "IMA ID",
                selector: (row) => row.imaId,
                compact: true,
                reorder: true,
            },
            {
                name: "Composite Affiliation ID",
                selector: (row) => row.compositeAffiliationId,
                compact: true,
                reorder: true,
            },
            {
                name: "Tracker ID",
                selector: (row) => row.trackerId,
                compact: true,
                reorder: true,
            },
            {
                name: "APX Portfolio ID",
                selector: (row) => row.apxPortfolioId,
                compact: true,
                reorder: true,
            },
            {
                name: "Delivery Instructions",
                selector: (row) => row.deliveryInstructions,
                minWidth: '200px',
                cell: (row) => <CustomCell cellData={row.deliveryInstructions} /> ,
                compact: true,
                reorder: true,
            },
            {
                name: "Fax Number",
                selector: (row) => row.faxNumber,
                compact: true,
                reorder: true,
            },
            {
                name: "Fax Cover To",
                selector: (row) => row.faxCoverTo,
                compact: true,
                reorder: true,
                wrap: true,
            },
            {
                name: "Fax Phone",
                selector: (row) => row.faxPhone,
                compact: true,
                reorder: true,
                wrap: true,
            },
            {
                name: "Fax Cover Subject",
                selector: (row) => row.faxCoverSubject,
                compact: true,
                reorder: true,
                wrap: true,
            },
            {
                name: "Fax Cover Body",
                selector: (row) => row.faxCoverBody,
                compact: true,
                reorder: true,
                wrap: true,
            },
            {
                name: "APX Custodian",
                selector: (row) => row.apxCustodian,
                compact: true,
                reorder: true,
            },
            {
                name: "MGR Code",
                selector: (row) => row.mgrCode,
                compact: true,
                reorder: true,
            },
        ]

        if (accountDetailsRes.length === 0) {
            alert(`This account has no details to show!`);
        } else {
            handleModalOption5Open(accountDetailsRes, title, accountDetailsModalColumns);
        }
    };

    return (
    <div style={{ minWidth: "25px"}}>
        <Button style={{ minWidth: "30px"}}
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
        >
            <FaEllipsisV />
        </Button>
        
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            //keepMounted
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={handleModalClickAccountDetails} >Account Details</MenuItem>
            <MenuItem onClick={handleModalClickRecentTrade}>Recent Trades</MenuItem>
            <MenuItem onClick={handleModalClickSecurityDetail}>Security Detail</MenuItem>
            <MenuItem onClick={handleModalClickPriceHistory}>Price History</MenuItem>
            <MenuItem onClick={handleModalClickShowLoans}>Underlying Loans</MenuItem>            
        </Menu>
    </div>
    );
}