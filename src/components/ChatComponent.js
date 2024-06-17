import React, {useEffect, useState} from "react";
import Message from "./MessageComponent";
import theme from "../utils/theme";
import { TextField, Button, Container, List, ListItem, Box, Typography, ThemeProvider, IconButton } from "@mui/material";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { animated, useSpring } from "react-spring";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {getUsername} from "../utils/api";

const Chat = ({socketRef, gameStateRef}) => {
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [username, setUsername] = useState("");
    const [messageText, setMessageText] = useState("");

    const springProps = useSpring({
        from: { opacity: 0, transform: "translateY(100%)" },
        to: { opacity: 1, transform: "translateY(0)" },
        config: { duration: 900 },
    });

    useEffect(() => {
        getUsername().then((response) => {
            setUsername(response.data);
        }).catch((error) => {
            console.error(error);
        });

        socketRef.current.socketListenChat((message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socketRef.current.socketRemoveChatListener();
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = {
            text: messageText,
            user: username || "Anonimo",
            timestamp: new Date().toLocaleString()
        };
        socketRef.current.socketSendMessage(message);
        setMessageText("");
    };

    const addEmoji = (emoji) => {
        setMessageText(prevMessageText => prevMessageText + emoji.native);
        setShowEmojiPicker(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <animated.div style={springProps}>
                <Container maxWidth="sm">
                    <Box mt={2} textAlign="left" display="flex" flexDirection="column" p={3} bgcolor="#262424" boxShadow={3} border={`3px solid  #ccc`} borderRadius={10} height="80vh">
                        <Typography variant="h4" component="h2" gutterBottom color="secondary">Chat</Typography>
                        <Box flex={1} overflow="auto" mb={2} style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #555' }}>
                            <List>
                                {messages.map((message, index) => (
                                    <ListItem key={index}>
                                        <Message msg={message} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <form onSubmit={handleSubmit}>
                            <Box display="flex" alignItems="center" position="relative">
                                <TextField
                                    name="message"
                                    label="Messaggio"
                                    variant="filled"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    margin="normal"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    InputLabelProps={{
                                        style: { color: 'white' },
                                    }}
                                    InputProps={{
                                        style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                    }}
                                />
                                <Box position="relative">
                                    <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ marginLeft: '10px' }}>
                                        <InsertEmoticonIcon style={{ color: 'white' }} />
                                    </IconButton>
                                    {showEmojiPicker && (
                                        <Box position="absolute" right="100%" bottom="100%" zIndex={1000}>
                                            <Picker data={data} onEmojiSelect={addEmoji} />
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                            <Box mt={2}>
                                <Button type="submit" variant="contained" color="secondary" disabled={gameStateRef.current !== 1}>Invia</Button>
                            </Box>
                        </form>
                    </Box>
                </Container>
            </animated.div>
        </ThemeProvider>
    );
};

export default Chat;
