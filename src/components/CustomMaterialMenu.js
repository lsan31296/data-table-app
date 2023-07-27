import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { /*FaRegCopy, FaShareAlt, */ FaEllipsisV } from 'react-icons/fa';
import { getUspTrade } from '../api';
import PopModal from './PopModal';

export default function CustomMaterialMenu({ row, handleModalOpen}) {
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
    const handleUSPTradeModal = async (event) => {
        const uspTradeRes = await getUspTrade({ account: row.account, cusip: row.bbg_cusip});
        if (uspTradeRes.length === 0) {
            alert(`This cusip does not have an USP Trade data.`);
        } else {
            //Insert modal here!
            //setOpenModal(true);
            handleModalOpen(uspTradeRes);
        }
        /*
        var rowData = JSON.stringify({ account: row.account, bbg_cusip: row.bbg_cusip });
        navigator.clipboard.writeText(rowData)
        .then(() => {
            alert(`Account and BBG CUSIP copied to clipboard!`);
        });
        */
    };
    //const handleModalClose = () => setOpenModal(false);


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
            <MenuItem onClick={handleUSPTradeModal}>USP Trade</MenuItem>
            <MenuItem onClick={handleClose}>Option 2</MenuItem>
            <MenuItem onClick={handleClose}>Option 3</MenuItem>
        </Menu>
    </div>
    );
}