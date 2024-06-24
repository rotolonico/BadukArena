import React, {useEffect, useState, useRef} from "react";
import {Typography, Box, useTheme} from '@mui/material';
import Board from '../components/play/game/Board';
import PlayerBox from "../components/play/game/PlayerBox";
import Chat from "../components/play/chat/Chat";
import TurnBox from "../components/play/game/TurnBox";

const Game = ({yourColor, socketRef, gameStateRef, opponentUsername, yourUsername}) => {
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
        <main className="game-container">
            <div className="board">
                <Board board={board} onCellClick={handleCellClick} />
            </div>
            <div className="playerboxOne">
                <PlayerBox username={yourUsername} color={yourColor} />
            </div>
            <div className="playerboxTwo">
                <PlayerBox username={opponentUsername} color={yourColor === 'B' ? 'W' : 'B'} />
            </div>
            <div className="turnbox">
                <TurnBox isYour={currentPlayer === yourColor} color={currentPlayer} gameStateRef={gameStateRef}/>
            </div>
            <div className="chat">
                <Chat socketRef={socketRef} />
            </div>
        </main>
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
