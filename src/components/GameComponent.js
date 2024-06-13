import React, { useEffect, useState, useRef } from "react";
import { Typography, Paper, Box } from '@mui/material';
import Board from './BoardComponent';

const GameComponent = ({ yourColor, socketRef, gameStateRef }) => {
    const [board, setBoard] = useState(initialBoardState());
    const [currentPlayer, setCurrentPlayer] = useState('B');

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
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Go Game
            </Typography>
            <Typography variant="body1" component="p">
                You are {yourColor === "B" ? "black" : "white"}. It is {currentPlayer === "B" ? "black" : "white"}'s turn
            </Typography>
            <Box mt={2}>
                <Board board={board} onCellClick={handleCellClick} />
            </Box>
        </Paper>
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

export default GameComponent;
