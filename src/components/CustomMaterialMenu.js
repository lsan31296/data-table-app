import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { /*FaRegCopy, FaShareAlt, */ FaEllipsisV } from 'react-icons/fa';

export default function CustomMaterialMenu({ row }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        console.log("Row from Options: ", row);
        //console.log("Current Target: ", event.currentTarget);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleNameAndCusip = (event) => {
        var rowData = JSON.stringify({ account: row.account, bbg_cusip: row.bbg_cusip });
            navigator.clipboard.writeText(rowData)
            .then(() => {
                alert(`Account and BBG CUSIP copied to clipboard!`);
            });
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
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={handleNameAndCusip}>Name and CUSIP</MenuItem>
            <MenuItem onClick={handleClose}>Option 2</MenuItem>
            <MenuItem onClick={handleClose}>Option 3</MenuItem>
        </Menu>
    </div>
    );
}