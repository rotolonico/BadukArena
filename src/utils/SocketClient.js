import { io } from "socket.io-client";
import { isProd } from "./api.js";

const prodHost = '3.75.158.163:1234';
const testHost = 'http://localhost:1234';

const host = isProd ? prodHost : testHost;

class SocketClient {
    constructor() {
        this.socket = io(host);
        this.currentRoom = "";
    }

    disconnect() {
        this.socket.close();
    }

    socketSendMessage(message) {
        this.socket.emit("chat-message", message, this.currentRoom);
    }

    socketJoinRoom(room, cb) {
        this.socket.emit("join-room", room, cb);
        this.currentRoom = room;
    }

    socketLeaveRoom(cb) {
        this.socket.emit("leave-room", this.currentRoom, cb);
        this.currentRoom = "";
    }

    socketGameMove(data) {
        console.log("Sending game move", data);
        this.socket.emit("game-move", data, this.currentRoom);
    }

    socketListenChat(onMessage) {
        this.socket.on("chat-message", (message) => {
            onMessage(message);
        });
    }

    socketListenIllegalMove(onIllegalMove) {
        this.socket.on("game-invalid-move", (error) => {
            onIllegalMove(error)
        });
    }

    socketListenGameStart(onStart) {
        this.socket.on("game-start", (color) => {
            onStart(color);
        });
    }
    
    socketListenGameOver(onGameOver) {
        this.socket.on("game-over", (result) => {
            onGameOver(result);
        });
    }

    socketListenGameAborted(onGameAborted) {
        this.socket.on("game-aborted", () => {
            onGameAborted();
        });
    }

    socketListenMove(onMove) {
        this.socket.on("game-move", (move) => {
            onMove(move);
        });
    }

    socketRemoveAllGameListeners() {
        this.socket.removeAllListeners("game-move");
        this.socket.removeAllListeners("game-invalid-move");
        this.socket.removeAllListeners("game-start");
        this.socket.removeAllListeners("game-over");
        this.socket.removeAllListeners("game-aborted");
    }

    socketRemoveChatListener() {
        this.socket.removeAllListeners("chat-message");
    }
}

export default SocketClient;
