import React from 'react';
import {Box, Typography} from "@mui/material";


const PlayerBox = ({username, color}) => {
    const backgroundColor = color === 'B' ? '#262424' : 'white';
    const textColor = color === 'B' ? 'white' : 'black';

    return (
        <Box sx={{
            width: '100%',
            height: 100,
            borderRadius: '10px',
            background: backgroundColor,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${textColor}`,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease-in-out',
            margin: '20px 0',  // Margine sopra e sotto
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
            }
        }}>
            <Typography variant='h6' color={textColor}>{username}</Typography>
        </Box>
    );
}

export default PlayerBox;