import React, { useEffect, useState, useRef } from "react";
import Board from './BoardComponent';
//import theme from "../utils/theme";
import {
    socketGameMove,
    socketListenMove,
    socketListenIllegalMove,
    socketListenGameOver,
    socketListenGameAborted,
    socketRemoveAllGameListeners
} from "../utils/socket";
import ChatComponent from "./ChatComponent";

const GameComponent = ({yourColor}) => {
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
        socketListenMove((move) => {
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

        socketListenIllegalMove((error) => {
            console.log(error);
        });

        socketListenGameOver((result) => {
            window.location.reload();
            alert(result === "B" ? "Black wins" : "White wins")
        });
        
        socketListenGameAborted(() => {
            window.location.reload();
            alert("Game Aborted")
        });
        
        return socketRemoveAllGameListeners;
    }, []);

    const handleCellClick = (x, y) => {
        const move = `${x}-${y}`;
        socketGameMove(move);
    };
    
    return (
        <div>
            <h1>Go Game</h1>
            <p>You are {yourColor === "B" ? "black" : "white"}. It is {currentPlayer === "B" ? "black" : "white"}'s turn</p>
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
