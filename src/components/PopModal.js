//This component is responible displaying uspTrade data for a particular row (account and cusip) when
//first row option is selected.
import * as React from 'react';
import Box from '@mui/material/Box';
//import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { getUspTrade } from '../api';
import DataTable from 'react-data-table-component';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1400,
    bgcolor: 'background.paper', 
    border: '2px solid #000',
    boxShadow: 12,
    p: 4,
};

export default function PopModal({ data, isOpen, onClose }) {
    //console.log("From inside PopModal Component");
    //const [open, setOpen] = React.useState(false);
    //const handleOpen = () => setOpen(true);
    //const handleClose = () => setOpen(false);
    //const [data, setData] = React.useState(null);

    const columns = [
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

    /*
    React.useEffect(() => {
        const loadUspTrade = async() => {
            const uspTradeRes = await getUspTrade({ account: rowData.account, cusip: rowData.bbg_cusip});
            console.log("uspTradeRes: ", uspTradeRes);
            setData(uspTradeRes);
        };
        loadUspTrade();
    }, []);
    */

    /*
    if (!data) {
        return(
            <h1>Loading...</h1>
        )
    } else { */
    return (
        <div>
        {/*<Button onClick={handleOpen}>Open modal</Button> */}
        <Modal
            open={isOpen}
            onClose={onClose}
            //hideBackdrop
            //disableEnforceFocus
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {/*
                <Typography id="modal-modal-title" variant="h6" component="h2">Modal Title</Typography> 
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Data Table Here.
                </Typography>
                */}
                <Typography id="modal-modal-title" variant="h6" component="h2">Trade History</Typography>
                <div id="modal-modal-description">
                    <DataTable
                        columns={columns}
                        data={data}
                    />
                </div>

            </Box>
        </Modal>
        </div>
    );
    }
//}