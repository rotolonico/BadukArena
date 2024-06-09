import React, {useEffect, useState} from 'react';
import {getRooms} from "./api";
import RoomComponent from "./RoomComponent";

const Play = () => {

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        getRooms()
            .then(roomsList => {
                setRooms(roomsList.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <form>
            <table>
                <thead>
                <tr>
                    <th>Room Number</th>
                    <th>Players</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {rooms?.map((room, index) => (
                    <RoomComponent key={index} number={room.number} roomCreator={room.roomCreator.username} />
                ))}
                </tbody>
            </table>
        </form>
    );
}

export default Play;
