import React from 'react';
import { Box, Typography } from "@mui/material";

const TurnBox = ({isYour, color}) => {
    const backgroundColor = color === 'B' ? '#262424' : 'white';
    const textColor = color === 'B' ? 'white' : 'black';

    return (
        <Box sx={{ width: '100%', height: 100, background: backgroundColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant='h6' color={textColor}>{isYour ? "It's your turn!" : "It's your opponents turn."}</Typography>
        </Box>
    );
}

export default TurnBox;