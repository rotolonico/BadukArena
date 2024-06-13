import {io} from "socket.io-client";

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

const socketLeaveRoom = (cb) => {
    socket.emit("leave-room", currentRoom, cb);
    currentRoom = "";
}

const socketGameMove = (data) => {
    console.log("Sending game move", data);
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

const socketListenStart = (onStart) => {
    socket.on("game-start", (color) => {
        onStart(color);
    });
}

const socketListenMove = (onMove) => {
    socket.on("game-move", (move) => {
        onMove(move);
    });
}

const socketRemoveAllGameListeners = () => {
    socket.removeAllListeners("game-move");
    socket.removeAllListeners("game-invalid-move");
    socket.removeAllListeners("game-start");
    socket.removeAllListeners("game-over");
    socket.removeAllListeners("game-aborted");
}

const socketListenGameOver = (onGameOver) => {
    socket.on("game-over", (result) => {
        onGameOver(result);
    });
}

const socketListenGameAborted = (onGameAborted) => {
    socket.on("game-aborted", () => {
        onGameAborted();
    });

}

export {
    socketSendMessage,
    socketJoinRoom,
    socketGameMove,
    socketListenChat,
    socketLeaveRoom,
    socketListenIllegalMove,
    socketListenMove,
    socketListenStart,
    socketListenGameOver,
    socketListenGameAborted,
    socketRemoveAllGameListeners
};
