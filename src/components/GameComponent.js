import React, { useEffect, useState } from "react";
import Board from './BoardComponent';
//import theme from "../utils/theme";
import { socketGameMove, socketListenMove, socketListenIllegalMove} from "../utils/socket";
import ChatComponent from "./ChatComponent";

const GameComponent = () => {
    const [board, setBoard] = useState(initialBoardState());


    const [currentPlayer, setCurrentPlayer] = useState('B');

    useEffect(() => {
        socketListenMove((move) => {
            const [x, y] = move.split('-');
            const newBoard = board.map((row, i) =>
                row.map((cell, j) => {
                    if (i === parseInt(x) && j === parseInt(y)) {
                        return currentPlayer;
                    }
                    return cell;
                })
            );
            setBoard(newBoard);
            console.log(newBoard);
            console.log(currentPlayer);
            setCurrentPlayer(currentPlayer === 'B' ? 'W' : 'B');
        });

        socketListenIllegalMove((error) => {
            alert(error);
        });

    }, []);

    const handleCellClick = (x, y) => {
        const move = `${x}-${y}`;
        socketGameMove(move);
    };

    return (
        <div>
            <h1>Go Game</h1>
            <p>Current Player: {currentPlayer}</p>
            <Board board={board} onCellClick={handleCellClick} />
            <ChatComponent></ChatComponent>
        </div>
    );
};

function initialBoardState(){
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
