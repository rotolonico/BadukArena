import React, {useEffect, useState} from 'react';
import {getRooms, joinRoom, createRoom, deleteRoom} from "../utils/api";
import RoomComponent from "../components/RoomComponent";
import {socketJoinRoom, socketLeaveRoom} from "../utils/socket";
import withAuth from "../withAuth";
import {socketListenStart} from "../utils/socket";
import GameComponent from "../components/GameComponent";

const Play = () => {

    const [rooms, setRooms] = useState([]);
    const [isCreateDisabled, setIsCreateDisabled] = useState(false);
    const [createdRoom, setCreatedRoom] = useState(null);
    const [inGame, setInGame] = useState(false);
    const [yourColor, setYourColor] = useState('B');

    useEffect(() => {
        
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
            if (inGame) return;
            refreshRooms();
            
        }, 5000);
        
        socketListenStart((color) => {
            setInGame(true);
            setYourColor(color);
        });

        return () => clearInterval(intervalId);
    }, [inGame]);

    const handleJoin = async (number) => {
        try {
            const res = await joinRoom(number);
            if (res.status === 200) {
                socketJoinRoom(number, (msg) => {
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
                socketJoinRoom(res.data.roomNumber, (msg) => {
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
                socketLeaveRoom((msg) => console.log(msg));
                setIsCreateDisabled(false);
                setCreatedRoom(null);
            }
        } catch (error) {
            console.log(`Error deleting room: ${error.message}`);
        }
    }
    
    console.log("Colorr " + yourColor);

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
            {inGame && <GameComponent yourColor={yourColor}></GameComponent>}
        </>
    );
}

export default withAuth(Play);
