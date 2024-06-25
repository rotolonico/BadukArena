import React, { useEffect, useState } from "react";
import Message from "./Message";
import theme from "../../../utils/theme";
import { TextField, Button, Container, List, ListItem, Box, Typography, ThemeProvider, IconButton } from "@mui/material";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import { animated, useSpring } from "react-spring";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { getUsername } from "../../../utils/api";
import '../../../static/styles.css';

const Chat = ({ socketRef }) => {
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
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (messageText === "") return;
        const message = {
            text: messageText,
            user: username || "Anonimo"
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
                    <Box mt={2} textAlign="center" display="flex" flexDirection="column" p={3} bgcolor="#262424" boxShadow={3} borderRadius={10} height="60vh">
                        <Typography variant="h4" component="h2" gutterBottom color="white">Chat</Typography>
                        <Box flex={1} overflow="auto" mb={2} className="scrollbar">
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
                                    rows={1.2}
                                    margin="normal"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    InputLabelProps={{
                                        style: { color: 'white' },
                                    }}
                                    InputProps={{
                                        style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '2px'
                                        },
                                    }}
                                    className="scrollbar"
                                />
                                <Box position="relative" display="flex" alignItems="center">
                                    <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ marginLeft: '10px' }}>
                                        <InsertEmoticonIcon style={{ color: 'white' }} />
                                    </IconButton>
                                    {showEmojiPicker && (
                                        <Box position="absolute" right="100%" bottom="100%" zIndex={1000}>
                                            <Picker data={data} onEmojiSelect={addEmoji} />
                                        </Box>
                                    )}
                                </Box>
                                <IconButton type="submit" style={{ marginLeft: '10px', color:"white" }}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </form>
                    </Box>
                </Container>
            </animated.div>
        </ThemeProvider>
    );
};

export default Chat;
