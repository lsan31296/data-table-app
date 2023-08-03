import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { /*FaRegCopy, FaShareAlt, */ FaEllipsisV } from 'react-icons/fa';
import { getUspTrade, getSecurityDetail, getPriceHistory } from '../api';

export default function CustomMaterialMenu({ row, handleModalOption1Open, handleModalOption2Open, handleModalOption3Open}) {
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
                selector: (row) => row.trade_date.slice(0,10),
                compact: true,
            },
            {
                name: "Settle Date",
                selector: (row) => row.settle_date.slice(0,10),
                compact: true,
            },
            {
                name: "Transaction Type",
                selector: (row) => row.trans_type,
                compact: true,
            }, 
            {
                name: "Account",
                selector: (row) => row.account,
                compact: true,
                minWidth: "60px",
            }, 
            {
                name: "Advent Portfolio ID",
                selector: (row) => row.advPortfolioId,
                compact: true,
                minWidth: "120px",
            },
            {
                name: "Advent Security ID",
                selector: (row) => row.advSecurityId,
                compact: true,
                minWidth: "120px",
            },
            {
                name: "Security Name",
                selector: (row) => row.sec_name,
                compact: true,
                minWidth: "86px"
            },
            {
                name: "Pool Name",
                selector: (row) => row.pool_name,
                compact: true,
                minWidth: "86px",
            },
            {
                name: "CUSIP",
                selector: (row) => row.cusip,
                compact: true,
                minWidth: "90px",
            },
            {
                name: "Symbol",
                selector: (row) => row.symbol,
                compact: true,
            },
            {
                name: "Original Face",
                selector: (row) => row.orig_face,
                compact: true,
            },
            {
                name: "Current Face",
                selector: (row) => row.curr_face,
                compact: true,
            },
            {
                name: "Price",
                selector: (row) => row.price,
                compact: true,
                minWidth: "75px",
            },
            {
                name: "Accrued",
                selector: (row) => row.accrued,
                compact: true,
                minWidth: "80px",
            },
            {
                name: "Net Money",
                selector: (row) => row.net_money,
                compact: true,
            },
            {
                name: "Dealer",
                selector: (row) => row.dealer,
                compact: true,
            },
        ];

        if (uspTradeRes.length === 0) {
            alert(`This cusip does not have an USP Trade data.`);
        } else {
            //Insert modal here!
            //setOpenModal(true);
            handleModalOption1Open(uspTradeRes, title, recentTradeModalColumns);
        }
        /*
        var rowData = JSON.stringify({ account: row.account, bbg_cusip: row.bbg_cusip });
        navigator.clipboard.writeText(rowData)
        .then(() => {
            alert(`Account and BBG CUSIP copied to clipboard!`);
        });
        */
    };
    const handleModalClickSecurityDetail = async(event) => {       
        const securityDetailRes = await getSecurityDetail({ cusip: row.bbg_cusip});
        const title = 'Security Detail';
        const securityDetailModalColumns = [
            {
                name: 'ID',
                selector: (row) => row.id,
                compact: true,
                minWidth: '60px',
            },
            {
                name: 'CUSIP',
                selector: (row) => row.cusip,
                compact: true,
                minWidth: '80px'
            }, 
            {
                name: 'Ticker',
                selector: (row) => row.ticker,
                compact: true
            },
            {
                name: 'Name',
                selector: (row) => row.name,
                compact: true,
                maxWidth: '150px'
            },
            {
                name: 'LT Date',
                selector: (row) => row.lastTradeableDate,
                compact: true,
            },
            {
                name: 'Last Price',
                selector: (row) => row.lastPrice,
                compact: true,
            },
            {
                name: 'Issuer',
                selector: (row) => row.issuer,
                compact: true,
            },
            {
                name: 'Sec Type',
                selector: (row) => row.security_typ,
                compact: true,
            },
            {
                name: 'GICS Industry Group',
                selector: (row) => row.gics_industry_group,
                compact: true,
                minWidth: '150px'
            },
            {
                name: 'GICS Sec',
                selector: (row) => row.gics_sector,
                compact: true,
            },
            {
                name: 'BICS 2 Ind Group Name',
                selector: (row) => row.bics_level_2_industry_group_name,
                compact: true,
                minWidth: '160px',
            },
            {
                name: 'EXCH Code',
                selector: (row) => row.exch_code,
                compact: true,
            },
            {
                name: 'Primary EXCH Name',
                selector: (row) => row.primary_exchange_name,
                compact: true,
                minWidth: '120px'
            },
            {
                name: 'Ind Group',
                selector: (row) => row.industry_group,
                compact: true,
            },
            {
                name: 'Country',
                selector: (row) => row.country,
                compact: true,
            },
            {
                name: 'Market Sec Des',
                selector: (row) => row.market_sector_des,
                compact: true,
            },
            {
                name: '144A Flag',
                selector: (row) => row.one_four_four_a_flag,
                compact: true,
            },
            {
                name: 'Muni Issue Szie',
                selector: (row) => row.muni_issue_size,
                compact: true,
            },
            {
                name: 'Mtg Agency Backed',
                selector: (row) => row.mtg_is_agency_backed,
                compact: true,
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
                selector: (row) => row.aoDate,
                compact: true,
            },
            {
                name: 'CUSIP',
                selector: (row) => row.cusip,
                compact: true,
            },
            {
                name: 'PriceValue',
                selector: (row) => row.priceValue,
                compact: true,
            }
        ];
        
        if (priceHistoryRes.length === 0) {
            alert(`This CUSIP has no Price History.`);
        } else {
            handleModalOption3Open(priceHistoryRes, title, priceHistoryModalColumns);
        }
    }


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
            <MenuItem onClick={handleModalClickRecentTrade}>Recent Trade</MenuItem>
            <MenuItem onClick={handleModalClickSecurityDetail}>Security Detail</MenuItem>
            <MenuItem onClick={handleModalClickPriceHistory}>Price History</MenuItem>
        </Menu>
    </div>
    );
}