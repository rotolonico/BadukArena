import { io } from "socket.io-client";

let socket;
let currentRoom = "";

socket = io("http://localhost:1234");

const socketSendMessage = (message) => {
    socket.emit("chat-message", message, currentRoom);
}

const socketJoinRoom = (room, cb) => {
    socket.emit("join-room", room, cb);
    currentRoom = room;
}

const socketLeaveRoom = (room) => {
    socket.emit("leave-room", room);
    currentRoom = "";
}

const socketGameMove = (data) => {
    socket.emit("game-move", data, currentRoom);
}

const socketListenChat = (onMessage) => {
    socket.on("chat-message", (message) => {
        onMessage(message);
    });
}

const socketListenIllegalMove = (onIllegalMove) => {
    socket.on("game-invalid-move", (error) => {
        onIllegalMove(error)
    });
}

const socketListenMove = (onMove) => {
    socket.on("game-move", (move) => {
        onMove(move);
    });
}

export { socketSendMessage, socketJoinRoom, socketGameMove, socketListenChat, socketLeaveRoom,socketListenIllegalMove ,socketListenMove};
