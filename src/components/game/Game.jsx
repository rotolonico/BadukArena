import React, { useEffect, useState, useRef } from "react";
import { Typography, Box, useTheme } from '@mui/material';
import Board from './Board';

const Game = ({ yourColor, socketRef, gameStateRef }) => {
    const [board, setBoard] = useState(initialBoardState());
    const [currentPlayer, setCurrentPlayer] = useState('B');
    const theme = useTheme();

    const boardRef = useRef(board);
    const currentPlayerRef = useRef(currentPlayer);

    useEffect(() => {
        boardRef.current = board;
    }, [board]);

    useEffect(() => {
        currentPlayerRef.current = currentPlayer;
    }, [currentPlayer]);

    useEffect(() => {
        socketRef.current.socketListenMove((move) => {
            const [x, y] = move.split('-');
            const newBoard = boardRef.current.map((row, i) =>
                row.map((cell, j) => {
                    if (i === parseInt(x) && j === parseInt(y)) {
                        return currentPlayerRef.current;
                    }
                    return cell;
                })
            );
            setBoard(newBoard);
            setCurrentPlayer(currentPlayerRef.current === 'B' ? 'W' : 'B');
        });

        socketRef.current.socketListenIllegalMove((error) => {
            console.log(error);
        });

    }, []);

    const handleCellClick = (x, y) => {
        if (gameStateRef.current !== 1) return;
        const move = `${x}-${y}`;
        socketRef.current.socketGameMove(move);
    };

    return (
        <Box sx={{ flex: 2, backgroundColor: '#262424', color: 'white', padding: 4, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: 'white' }}>
                Go Game
            </Typography>
            <Typography variant="body1" component="p" sx={{ color: 'white', mb: 2 }}>
                You are {yourColor === "B" ? "black" : "white"}. It is {currentPlayer === "B" ? "black" : "white"}'s turn
            </Typography>
            <Box mt={2} sx={{ backgroundColor: 'white', padding: 2, borderRadius: 2 }}>
                <Board board={board} onCellClick={handleCellClick} />
            </Box>
        </Box>
    );
};

function initialBoardState() {
    return [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'W', 'B', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'B', 'W', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
    ];
}

export default Game;
