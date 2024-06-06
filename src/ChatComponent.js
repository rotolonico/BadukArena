import React, { useEffect, useState } from "react";
import Message from "./MessageComponent.js";
import { io } from "socket.io-client";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket= io("http://localhost:1234");
        setSocket(newSocket);

        newSocket.on("chat-message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => newSocket.close();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const input = e.target.elements.message;
        const message = input.value;
        const room = e.target.elements.room.value;
        input.value = "";
        socket.emit("chat-message", message, room);
    };

    const handleJoin = (e) => {
        const form = e.target.form;
        const room = form.elements.room.value;
        socket.emit("join-room", room, (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <ul>
                <li key="messagekey">
                    <input type="text" name="message" placeholder="Enter your message" />
                    <button type="submit">Send</button>
                </li>
                <li key="roomkey">
                    <input type="text" name="room" placeholder="Enter your room" />
                    <button type="button" onClick={handleJoin}>Join</button>
                </li>
                {messages.map((message, index) => (
                    <Message key={index} msg={message} />
                ))}
            </ul>
        </form>
    );
};

export default Chat;
