import React, { useEffect, useState, useRef } from "react";
import Board from './BoardComponent';
//import theme from "../utils/theme";

const GameComponent = ({yourColor, socketRef}) => {
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
        console.log("GameComponent useEffect",socketRef.current);
        socketRef.current.socketListenMove((move) => {  console.log("SONO NEL LISTEN MOVE");
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

        socketRef.current.socketListenGameOver((result) => {
            window.location.reload();
            alert(result === "B" ? "Black wins" : "White wins")
        });

        socketRef.current.socketListenGameAborted(() => {
            window.location.reload();
            alert("Game Aborted")
        });
        
        return () => {socketRef.current.socketRemoveAllGameListeners()};
    }, []);

    const handleCellClick = (x, y) => {
        const move = `${x}-${y}`;
        socketRef.current.socketGameMove(move);
    };
    
    return (
        <div>
            <h1>Go Game</h1>
            <p>You are {yourColor === "B" ? "black" : "white"}. It is {currentPlayer === "B" ? "black" : "white"}'s turn</p>
            <Board board={board} onCellClick={handleCellClick} />
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
