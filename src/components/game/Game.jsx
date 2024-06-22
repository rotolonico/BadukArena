import React, {useEffect, useState, useRef} from "react";
import {Typography, Box, useTheme} from '@mui/material';
import Board from './Board';
import PlayerBox from "../PlayerBox";
import Chat from "../chat/Chat";
import TurnBox from "../TurnBox";

const Game = ({yourColor, socketRef, gameStateRef, opponentUsernameRef, yourUsernameRef}) => {
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
        <Box display="flex" flexDirection="row" alignItems="center">
            <Box mt={2} sx={{backgroundColor: 'white', padding: 2, borderRadius: 2}}>
                <Board board={board} onCellClick={handleCellClick}/>
            </Box>
            <Box display="flex" flexDirection="column">
                <Box mt={2} textAlign="left" display="flex" flexDirection="column" p={3} bgcolor="#262424" boxShadow={3}
                     border={`3px solid  #ccc`} borderRadius={10} height="80vh" sx={{flex: 1, pl: 2, minWidth: '30%'}}>
                    <Box display="flex" flexDirection="row" sx={{flex: 1, pl: 2}}>
                        <PlayerBox username={yourUsernameRef.current} color={yourColor} marginRight={2}/>
                        <PlayerBox username={opponentUsernameRef.current} color={yourColor === 'B' ? 'W' : 'B'}/>
                    </Box>
                    <Box display="flex" flexDirection="row" sx={{flex: 1, pl: 2}}>
                        <TurnBox isYour={currentPlayer === yourColor} color={currentPlayer}/>
                    </Box>
                    <Box sx={{flex: 1, pl: 2}}>
                        <Chat socketRef={socketRef} gameStateRef={gameStateRef}/>
                    </Box>
                </Box>
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
