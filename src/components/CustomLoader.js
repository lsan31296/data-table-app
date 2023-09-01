import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export default function CustomLoader() {
    return (
        <div style={{ padding: "10px 10px 10px 10px"}}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography>Standing By</Typography>
                <CircularProgress />
            </Box>
        </div>
        
    );
}