import React, { useEffect, useState } from "react";
import Board from './BoardComponent';
import theme from "./theme";
import { socketGameMove } from "./socket";
import ChatComponent from "./ChatComponent";

const GameComponent = () => {
    const [board, setBoard] = useState([
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'W', 'B', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'B', 'W', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
    ]);


    const [currentPlayer, setCurrentPlayer] = useState('B');

    useEffect(() => {

    }, []);

    const handleCellClick = (x, y) => {
        const move = `${x}-${y}`;
        socketGameMove(move);
    };

    return (
        <div>
            <ChatComponent></ChatComponent>
            <h1>Go Game</h1>
            <p>Current Player: {currentPlayer}</p>
            <Board board={board} onCellClick={handleCellClick} />
        </div>
    );
};

export default GameComponent;
