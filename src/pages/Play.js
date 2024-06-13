import React, {useEffect, useState, useRef} from 'react';
import {getRooms, joinRoom, createRoom, deleteRoom} from "../utils/api";
import RoomComponent from "../components/RoomComponent";
import withAuth from "../withAuth";
import GameComponent from "../components/GameComponent";
import SocketClient from "../utils/SocketClient";
import ChatComponent from "../components/ChatComponent";

const Play = () => {

    const [rooms, setRooms] = useState([]);
    const [isCreateDisabled, setIsCreateDisabled] = useState(false);
    const [createdRoom, setCreatedRoom] = useState(null);
    const [inGame, setInGame] = useState(false);
    const [yourColor, setYourColor] = useState('B');

    const inGameRef = useRef(inGame);
    const socketRef = useRef(null);

    useEffect(() => {
        inGameRef.current = inGame;
    }, [inGame]);

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
            if (inGameRef.current) return;
            refreshRooms();
        }, 5000);

        socketRef.current.socketListenStart((color) => {
            setInGame(true);
            setYourColor(color);
        });

        return () => {
            clearInterval(intervalId);
            socketRef.current.disconnect();
        };
    }, []);


    const handleJoin = async (number) => {
        try {
            const res = await joinRoom(number);
            if (res.status === 200) {
                socketRef.current.socketJoinRoom(number, (msg) => {
                    console.log(msg)
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
                    console.log(msg)
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

    return (
        <>
            {!inGame && <>
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
            {inGame &&
                <>
                <GameComponent yourColor={yourColor} socketRef={socketRef}></GameComponent>
                <ChatComponent socketRef={socketRef}></ChatComponent>
                </>}
        </>
    );
}

export default withAuth(Play);
