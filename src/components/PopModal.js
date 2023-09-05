//This component is responible displaying uspTrade data for a particular row (account and cusip) when
//first row option is selected.
import * as React from 'react';
import Box from '@mui/material/Box';
//import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
//import { getUspTrade } from '../api';
import DataTable from 'react-data-table-component';
import ExportCSV from '../ExportCSV';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    minHeight: '20%',
    bgcolor: 'background.paper', 
    border: '2px solid #000',
    boxShadow: 12,
    p: 4,
};

export default function PopModal({ data, isOpen, onClose, columns, modalTitle }) {
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
                    <Typography style={{ display: "flex", justifyContent: "space-between" }} id="modal-modal-title" variant="h6" component="h2">
                        {modalTitle}
                        {
                            data &&
                            <ExportCSV csvData={data} fileName={`${modalTitle} for ${data[0].cusip}`} />
                        }
                    </Typography>
                    <div id="modal-modal-description">
                        <DataTable
                            columns={columns}
                            data={data}
                            highlightOnHover
                            striped
                            fixedHeader
                            fixedHeaderScrollHeight='650px'
                        />
                    </div>
                </Box>
            </Modal>
        </div>
    );
    }
    

//}