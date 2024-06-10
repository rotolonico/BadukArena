import React, { useEffect, useState } from "react";
import Message from "./MessageComponent.js";
import theme from "../utils/theme";
import { socketListenChat, socketSendMessage, socketJoinRoom, socketLeaveRoom } from "../utils/socket";
import { TextField, Button, Container, List, ListItem, Box, Typography, ThemeProvider, IconButton } from "@mui/material";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { animated, useSpring } from "react-spring";
import { joinRoom } from "../utils/api";
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [username, setUsername] = useState("User"); // Hardcoded username for example

    const springProps = useSpring({
        from: { opacity: 0, transform: "translateY(100%)" },
        to: { opacity: 1, transform: "translateY(0)" },
        config: { duration: 900 },
    });

    useEffect(() => {
        return () => {
            socketLeaveRoom();
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const input = e.target.elements.message;
        const message = {
            text: input.value,
            user: username,
            timestamp: new Date().toLocaleString()
        };
        input.value = "";
        socketSendMessage(message);
    };

    const handleJoin = async (e) => {
        try {
            const room = e.target.form.elements.room.value;
            const res = await joinRoom(room);
            if (res.status === 200 || res.status === 201) {
                socketJoinRoom(room, (msg) => {
                    setMessages((prevMessages) => [...prevMessages, msg]);
                });
                socketListenChat((msg) => {
                    setMessages((prevMessages) => [...prevMessages, msg]);
                });
            }
        } catch (error) {
            setMessages((prevMessages) => [...prevMessages, { text: `Error joining room: ${error.message}`, user: 'System', timestamp: new Date().toLocaleString() }]);
        }
    };

    const addEmoji = (emoji) => {
        const input = document.querySelector('input[name="message"]');
        input.value += emoji.native;
        setShowEmojiPicker(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <animated.div style={springProps}>
                <Container maxWidth="sm">
                    <Box mt={5} textAlign="center" display="flex" flexDirection="column" p={3} bgcolor="#262424" boxShadow={3} border={`3px solid  #ccc`} borderRadius={10}>
                        <Typography variant="h4" component="h2" gutterBottom color="secondary">Chat</Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                name="room"
                                label="Stanza"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    style: { color: 'white' },
                                }}
                                InputProps={{
                                    style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                    classes: {
                                        root: 'textfield-root',
                                        focused: 'textfield-focused',
                                    },
                                    className: 'chat-textfield',
                                }}
                            />
                            <Box display="flex" alignItems="center">
                                <TextField
                                    name="message"
                                    label="Messaggio"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    margin="normal"
                                    InputLabelProps={{
                                        style: { color: 'white' },
                                    }}
                                    InputProps={{
                                        style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                        classes: {
                                            root: 'textfield-root',
                                            focused: 'textfield-focused',
                                        },
                                        className: 'chat-textfield',
                                    }}
                                />
                                <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ marginLeft: '10px' }}>
                                    <InsertEmoticonIcon style={{ color: 'white' }} />
                                </IconButton>
                            </Box>
                            {showEmojiPicker && (
                                <Picker
                                    onSelect={addEmoji}
                                    style={{ position: 'absolute', bottom: '50px', right: '10px', zIndex: 1000 }}
                                />
                            )}
                            <Box mt={2}>
                                <Button type="submit" variant="contained" color="secondary">Invia</Button>
                                <Button type="button" onClick={handleJoin} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>Entra nella stanza</Button>
                            </Box>
                        </form>
                        <List>
                            {messages.map((message, index) => (
                                <ListItem key={index}>
                                    <Message msg={message} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Container>
            </animated.div>
        </ThemeProvider>
    );
};

export default Chat;
