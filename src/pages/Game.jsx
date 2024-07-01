import React, {useEffect, useRef, useState} from "react";
import {useTheme} from '@mui/material';
import Board from '../components/game/Board';
import PlayerBox from "../components/game/PlayerBox";
import Chat from "../components/game/Chat";
import TurnBox from "../components/game/TurnBox";
import placeStone from "../static/sounds/place_stone.mp3"


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

            const {x, y, captures} = moveData;


            const newBoard = boardRef.current.map((row, i) =>
                row.map((cell, j) => {

                    // If this is the move that was made, update the cell to the current player's color
                    if (i === parseInt(x) && j === parseInt(y)) {
                        return currentPlayerRef.current;
                    }

                    // Else, keep the current cell value
                    return cell;
                }));

            // If a capture was made, update the board to remove the captured stones
            captures.forEach((capture) => {
                    const x = capture[0];
                    const y = capture[1];
                    newBoard[x][y] = ' ';
                }
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
