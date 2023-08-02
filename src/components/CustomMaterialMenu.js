import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { /*FaRegCopy, FaShareAlt, */ FaEllipsisV } from 'react-icons/fa';
import { getUspTrade } from '../api';
import PopModal from './PopModal';

export default function CustomMaterialMenu({ row, handleModalOption1Open, handleModalOption2Open}) {
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
        //Mock data, just need to implement middle-tier endpoint and call here for 'securityDetailRes'
        const securityDetailRes = [{ID: '41', Cusip: '31381K3Q0', Ticker: 'FN', Name: 'FN 463507', LastTradeableDate: null }];
        const title = 'Security Detail';
        const securityDetailModalColumns = [
            {
                name: 'ID',
                selector: (row) => row.ID,
                compact: true,
            },
            {
                name: 'CUSIP',
                selector: (row) => row.Cusip,
                compact: true,
            }, 
            {
                name: 'Ticker',
                selector: (row) => row.Ticker,
                compact: true
            },
            {
                name: 'Name',
                selector: (row) => row.Name,
                compact: true,
            },
            {
                name: 'LT Date',
                selector: (row) => row.LastTradeableDate,
                compact: true,
            },
        ]
        console.log("Selected modal option 'Security Detail'.");
        
        if (securityDetailRes.length === 0) {
            alert(`This security has no details to display.`);
        } else {
            handleModalOption2Open(securityDetailRes, title, securityDetailModalColumns);
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
            <MenuItem onClick={handleClose}>Price History</MenuItem>
        </Menu>
    </div>
    );
}