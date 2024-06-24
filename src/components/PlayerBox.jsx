import React from 'react';
import { Box, Typography } from "@mui/material";

const PlayerBox = ({username, color, marginRight}) => {
    console.log("A " + username + " " + color + " " + marginRight);
    const backgroundColor = color === 'B' ? '#262424' : 'white';
    const textColor = color === 'B' ? 'white' : 'black';

    return (
        <Box marginRight={marginRight} sx={{ width: '100%', height: 100, borderRadius: '5%', background: backgroundColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant='h6' color={textColor}>{username}</Typography>
        </Box>
    );
}

export default PlayerBox;