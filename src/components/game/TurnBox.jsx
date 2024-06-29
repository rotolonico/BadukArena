import React from 'react';
import { Box, Typography } from "@mui/material";
import { AccessTime, HourglassEmpty, CheckCircleOutline } from '@mui/icons-material';

const TurnBox = ({ isYour, color, gameState }) => {
    const backgroundColor = color === 'B' ? '#262424' : 'white';
    const textColor = color === 'B' ? 'white' : 'black';
    const borderColor = color === 'B' ? 'white' : '#262424';

    const getIcon = () => {
        if (gameState === 2) {
            return <CheckCircleOutline style={{ color: textColor, fontSize: '1.5rem' }} />;
        } else {
            return isYour ?
                <AccessTime style={{ color: textColor, fontSize: '1.5rem' }} /> :
                <HourglassEmpty style={{ color: textColor, fontSize: '1.5rem' }} />;
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Box sx={{
                width: '300px',
                height: 80,
                borderRadius: '10px',
                background: backgroundColor,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${borderColor}`,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                }
            }}>
                {getIcon()}
                <Typography variant='h6' color={textColor} sx={{ mt: 1 }}>
                    {gameState === 2 ? "Game Over!" : isYour ? "It's your turn!" : "It's your opponent's turn."}
                </Typography>
            </Box>
        </Box>
    );
}

export default TurnBox;
