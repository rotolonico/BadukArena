import React, {useEffect, useState, useRef} from 'react';
import {getRooms, joinRoom, createRoom, deleteRoom} from "../utils/api";
import RoomComponent from "../components/RoomComponent";
import withAuth from "../withAuth";
import GameComponent from "../components/GameComponent";
import SocketClient from "../utils/SocketClient";
import ChatComponent from "../components/ChatComponent";

const Play = () => {
    
    const GameState = {
        NOT_STARTED: 0,
        STARTED: 1,
        FINISHED: 2
    }

    const [rooms, setRooms] = useState([]);
    const [isCreateDisabled, setIsCreateDisabled] = useState(false);
    const [createdRoom, setCreatedRoom] = useState(null);
    const [gameState, setGameState] = useState(GameState.NOT_STARTED);
    const [yourColor, setYourColor] = useState('B');
    const [result, setResult] = useState(null);

    const gameStateRef = useRef(gameState);
    const socketRef = useRef(null);

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {

        socketRef.current = new SocketClient();

        function refreshRooms() {
            getRooms()
                .then(roomsList => {
                    console.log("Refreshed rooms");
                    setRooms(roomsList.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
        
        refreshRooms();

        const intervalId = setInterval(() => {
            if (gameStateRef.current !== GameState.NOT_STARTED) return;
            refreshRooms();
        }, 5000);

        socketRef.current.socketListenGameStart((color) => {
            setGameState(GameState.STARTED);
            setYourColor(color);
        });

        socketRef.current.socketListenGameOver((rst) => {
            console.log("Game endend: " + rst.winner)
            console.log("Game endend: " + rst.isQuit)
            setGameState(GameState.FINISHED);
            setResult(rst);
        });
        
        socketRef.current.socketListenGameAborted(() => {
            window.location.reload();
        });

        return () => {
            clearInterval(intervalId);
            socketRef.current.socketRemoveAllGameListeners();
            socketRef.current.socketRemoveChatListener()
            socketRef.current.disconnect();
        };
    }, []);


    const handleJoin = async (number) => {
        try {
            const res = await joinRoom(number);
            if (res.status === 200) {
                socketRef.current.socketJoinRoom(number, (msg) => {
                    console.log(msg);
                });
            }
        } catch (error) {
            console.log(`Error joining room: ${error.message}`);
        }
    };

    const handleCreate = async () => {
        try {
            const res = await createRoom();
            if (res.status === 201) {
                setCreatedRoom({number: res.data.roomNumber, username: res.data.username});
                socketRef.current.socketJoinRoom(res.data.roomNumber, (msg) => {
                    console.log(msg);
                });
                setIsCreateDisabled(true);
            }
        } catch (error) {
            console.log(`Error creating room: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await deleteRoom(createdRoom.number);
            if (res.status === 200) {
                socketRef.current.socketLeaveRoom((msg) => console.log(msg));
                setIsCreateDisabled(false);
                setCreatedRoom(null);
            }
        } catch (error) {
            console.log(`Error deleting room: ${error.message}`);
        }
    }
    
    const handleNewGame = () => {
        window.location.reload();
    }

    return (
        <>
            {gameState === GameState.NOT_STARTED && <>
                <button type="button" onClick={handleCreate} disabled={isCreateDisabled}>Create Room</button>
                <h2>Available Rooms</h2>
                <ul>
                    {createdRoom && <li>
                        {createdRoom.username}
                        <button type="button" onClick={handleDelete} disabled={!isCreateDisabled}>Delete Room</button>
                    </li>}
                    {rooms?.map((r, i) => (
                        <RoomComponent key={i} number={r.number} roomCreator={r.roomCreator.username}
                                       handleJoin={handleJoin} disabledCondition={isCreateDisabled}/>
                    ))}
                </ul>
            </>}
            {gameState !== GameState.NOT_STARTED &&
                <>
                <GameComponent yourColor={yourColor} socketRef={socketRef} gameStateRef={gameStateRef}></GameComponent>
                <ChatComponent socketRef={socketRef} gameStateRef={gameStateRef}></ChatComponent>
                </>}
            {gameState === GameState.FINISHED &&
                <>
                    {result.isQuit && <p>{result.winner === "B" ? "black" : "white"} won because the other player aborted the game</p>}
                    {!result.isQuit && <p>{result.winner === "B" ? "black" : "white"} won</p>}
                    <button type="button" onClick={handleNewGame}>New Game</button>
                </>}
        </>
    );
}

export default withAuth(Play);
