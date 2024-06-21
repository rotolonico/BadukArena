import React from 'react';
import { Box, Typography } from "@mui/material";

const PlayerBox = ({username, color, marginRight}) => {
    const gradientColor = color === 'B' ? 'black' : 'white';

    return (
        <Box marginRight={marginRight} sx={{ width: 200, height: 200, borderRadius: '10%', background: `linear-gradient(0deg, ${gradientColor} 0%, rgba(255,255,255,0) 100%)` }}>
            <Typography variant='h6'>{username}</Typography>
        </Box>
    );
}

export default PlayerBox;