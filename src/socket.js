import { io } from "socket.io-client";

let socket;
let currentRoom = "";

const socketSendMessage = (message) => {
    socket.emit("chat-message", message, currentRoom);
}

const socketJoinRoom = (room, cb) => {
    socket = io("http://localhost:1234");
    socket.emit("join-room", room, cb);
    currentRoom = room;
}

const socketLeaveRoom = (room) => {
    socket?.close();
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

export { socketSendMessage, socketJoinRoom, socketGameMove, socketListenChat, socketLeaveRoom };
