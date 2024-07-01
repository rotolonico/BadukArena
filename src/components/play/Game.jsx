import React, {useEffect, useState, useRef} from "react";
import {useTheme} from '@mui/material';
import Board from './Board';
import PlayerBox from "./PlayerBox";
import Chat from "./Chat";
import TurnBox from "./TurnBox";
import placeStone from "../../static/sounds/place_stone.mp3"


const Game = ({yourColor, socketRef, gameState, opponentUsername, yourUsername}) => {
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
        socketRef.current.socketListenMove((moveData) => {

            const parsedMove = JSON.parse(moveData);
            const {x, y, captures} = parsedMove;
            const newBoard = boardRef.current.map((row, i) =>
                row.map((cell, j) => {
                    if (i === parseInt(x) && j === parseInt(y)) {
                        return currentPlayerRef.current;
                    }
                    
                    if (captures.some((c) => {
                        return c[0] === i && c[1] === j
                    })) return ' ';
                    
                    return cell;
                })
            );
            setBoard(newBoard);
            setCurrentPlayer(currentPlayerRef.current === 'B' ? 'W' : 'B');
            document.getElementById('gameMove').play();
        });

        socketRef.current.socketListenIllegalMove((error) => {
            console.log(error);
        });

    }, []);

    const handleCellClick = (x, y) => {
        if (gameState !== 1) return;
        const move = `${x}-${y}`;
        socketRef.current.socketGameMove(move);
    };

    return (
        <main className="game-container">
            <div className="board">
                <Board board={board} onCellClick={handleCellClick}/>
            </div>
            <div className="playerboxOne">
                <PlayerBox username={yourUsername} color={yourColor}/>
            </div>
            <div className="playerboxTwo">
                <PlayerBox username={opponentUsername} color={yourColor === 'B' ? 'W' : 'B'}/>
            </div>
            <div className="turnbox">
                <TurnBox isYour={currentPlayer === yourColor} color={currentPlayer} gameState={gameState}/>
            </div>
            <div className="chat">
                <Chat socketRef={socketRef}/>
            </div>
            <audio id="gameMove">
                <source src={placeStone} type="audio/mp3"/>
            </audio>
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
