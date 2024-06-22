import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { timeAgoFromDate } from "../../utils/dateUtils";

const Message = ({ msg }) => {
    const [timeAgo, setTimeAgo] = useState("just now");

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgo(timeAgoFromDate(msg.timestamp));
        }, 60000);

        return () => clearInterval(interval);
    }, [msg.timestamp]);

    return (
        <Box p={1} my={1} borderRadius={5} bgcolor="rgba(255, 255, 255, 0.1)" style={{ listStyle: 'none', minWidth: '20%', maxWidth: '80%', wordBreak: 'break-word' }}>
            <Typography variant="subtitle2" color="secondary">{msg.user}</Typography>
            <Typography variant="body1" style={{ color: 'white' }}>{msg.text}</Typography>
            <Typography variant="caption" color="secondary">{timeAgo}</Typography>
        </Box>
    );
}

export default Message;
