import React, { useEffect, useState } from "react";
import Message from "./MessageComponent.js";
import theme from "./theme";
import { io } from "socket.io-client";
import {TextField, Button, Container, List, ListItem, Box, Typography, ThemeProvider} from "@mui/material";
import { animated, useSpring } from "react-spring";
import {joinRoom} from "./api";


const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    const springProps = useSpring({
        from: { opacity: 0, transform: "translateY(100%)" },
        to: { opacity: 1, transform: "translateY(0)" },
        config: { duration: 900 },
    });

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

    const handleJoin = async (e) => {
        try {
            const room = e.target.form.elements.room.value;
            const res = await joinRoom(room);
            if (res.status === 200 || res.status === 201) {
                socket.emit("join-room", room, (msg) => {
                    setMessages((prevMessages) => [...prevMessages, msg]);
                });
            }
        }catch (error) {
            setMessages((prevMessages) => [...prevMessages, `Error joining room: ${error.message}`]);
        }
    };

    return (
        <ThemeProvider theme={theme}>
        <animated.div style={springProps}>
       <Container maxWidth="sm">
           <Box mt={5} textAlign="center" display="flex" flexDirection="column" p={3} bgcolor="#262424" boxShadow={3} border={`3px solid  #ccc`}  borderRadius={10}>
               <Typography variant="h4" component="h2" gutterBottom color="secondary" >Chat</Typography>
               <form onSubmit={handleSubmit}>
                     <TextField
                         name="room"
                         label="Room"
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
                     <TextField
                         name="message"
                         label="Message"
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
