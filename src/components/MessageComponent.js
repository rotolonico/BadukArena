import React from 'react';
import {Typography, Box} from "@mui/material";

const Message = ({msg}) => {
    return (
        <Box p={1} my={1} borderRadius={5} bgcolor="rgba(255, 255, 255, 0.1)" style={{ listStyle: 'none' }}>
            <Typography variant="subtitle2" color="primary">{msg.user}</Typography>
            <Typography variant="body1" style={{ color: 'white' }}>{msg.text}</Typography>
            <Typography variant="caption" color="secondary">{msg.timestamp}</Typography>
        </Box>
    );
}

export default Message;