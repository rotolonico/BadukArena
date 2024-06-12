import React, {useEffect, useState} from 'react';
import {getRooms, joinRoom, createRoom, deleteRoom} from "../utils/api";
import RoomComponent from "../components/RoomComponent";
import {socketJoinRoom, socketLeaveRoom} from "../utils/socket";
import withAuth from "../withAuth";

const Play = () => {

    const [rooms, setRooms] = useState([]);
    const [isCreateDisabled, setIsCreateDisabled] = useState(false);
    const [createdRoom, setCreatedRoom] = useState(null);

    useEffect(() => {
        getRooms()
            .then(roomsList => {
                setRooms(roomsList.data);
            })
            .catch(error => {
                console.error(error);
            });
        const intervalId = setInterval(() => {
            getRooms()
                .then(roomsList => {
                    console.log("Refreshed rooms");
                    setRooms(roomsList.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

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

    const handleCreate = async (e) => {
        e.preventDefault()
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

    return (
        <>
            <button type="button" onClick={handleCreate} disabled={isCreateDisabled}>Create Room</button>
            <h2>Available Rooms</h2>
            <ul>
                {createdRoom && <li>
                    {createdRoom.username}
                    <button type="button" onClick={handleDelete} disabled={!isCreateDisabled}>Delete Room</button>
                </li>}
                {rooms?.map((r, i) => (
                    <RoomComponent key={i} number={r.number} roomCreator={r.roomCreator.username} handleJoin={handleJoin} disabledCondition={isCreateDisabled}/>
                ))}
            </ul>
        </>
    );
}

export default withAuth(Play);
