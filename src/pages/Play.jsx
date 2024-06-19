import React, { useEffect, useState, useRef } from 'react';
import { getRooms, joinRoom, createRoom, deleteRoom } from "../utils/api";
import RoomComponent from "../components/room/Room";
import withAuth from "../withAuth";
import Game from "../components/game/Game";
import SocketClient from "../utils/SocketClient";
import Chat from "../components/chat/Chat";
import { Button, Typography, List, makeStyles, ThemeProvider, createTheme, CssBaseline } from '@material-ui/core';
import { Box, ListItem } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 1200,
        backgroundColor: theme.palette.background.paper,
        margin: '0 auto',
        padding: '20px',
    },
    createButton: {
        marginBottom: '20px',
    },
    roomList: {
        listStyle: 'none',
        padding: 0,
    },
    roomItem: {
        marginBottom: '10px',
    },
}));

const theme = createTheme({
    typography: {
        fontFamily: [
            'Roboto',
            'Arial',
            'sans-serif',
        ].join(','),
    },
    palette: {
        primary: {
            main: '#262424',
        },
    },
});

const Play = () => {

    const GameState = {
        NOT_STARTED: 0,
        STARTED: 1,
        FINISHED: 2
    }

    const classes = useStyles();
    const [rooms, setRooms] = useState([]);
    const [isCreateDisabled, setIsCreateDisabled] = useState(false);
    const [createdRoom, setCreatedRoom] = useState(null);
    const [gameState, setGameState] = useState(GameState.NOT_STARTED);
    const [yourColor, setYourColor] = useState('B');
    const [result, setResult] = useState(null);

    const gameStateRef = useRef(gameState);
    const socketRef = useRef(null);

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        socketRef.current = new SocketClient();

        function refreshRooms() {
            getRooms()
                .then(roomsList => {
                    console.log("Refreshed rooms");
                    setRooms(roomsList.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }

        refreshRooms();

        const intervalId = setInterval(() => {
            if (gameStateRef.current !== GameState.NOT_STARTED) return;
            refreshRooms();
        }, 5000);

        socketRef.current.socketListenGameStart((color) => {
            setGameState(GameState.STARTED);
            setYourColor(color);
        });

        socketRef.current.socketListenGameOver((rst) => {
            console.log("Game ended: " + rst.winner)
            console.log("Game ended: " + rst.isQuit)
            setGameState(GameState.FINISHED);
            setResult(rst);
        });

        socketRef.current.socketListenGameAborted(() => {
            window.location.reload();
        });

        return () => {
            clearInterval(intervalId);
            socketRef.current.socketRemoveAllGameListeners();
            socketRef.current.socketRemoveChatListener()
            socketRef.current.disconnect();
        };
    }, []);

    const handleJoin = async (number) => {
        try {
            const res = await joinRoom(number);
            if (res.status === 200) {
                socketRef.current.socketJoinRoom(number, (msg) => {
                    console.log(msg);
                });
            }
        } catch (error) {
            console.log(`Error joining room: ${error.message}`);
        }
    };

    const handleCreate = async () => {
        try {
            const res = await createRoom();
            if (res.status === 201) {
                setCreatedRoom({ number: res.data.roomNumber, username: res.data.username });
                socketRef.current.socketJoinRoom(res.data.roomNumber, (msg) => {
                    console.log(msg);
                });
                setIsCreateDisabled(true);
            }
        } catch (error) {
            console.log(`Error creating room: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await deleteRoom(createdRoom.number);
            if (res.status === 200) {
                socketRef.current.socketLeaveRoom((msg) => console.log(msg));
                setIsCreateDisabled(false);
                setCreatedRoom(null);
            }
        } catch (error) {
            console.log(`Error deleting room: ${error.message}`);
        }
    }

    const handleNewGame = () => {
        window.location.reload();
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className={classes.root}>
                {gameState === GameState.NOT_STARTED && <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreate}
                        disabled={isCreateDisabled}
                        className={classes.createButton}
                    >
                        Create Room
                    </Button>
                    <Typography variant="h6" gutterBottom>
                        Available Rooms
                    </Typography>
                    <List className={classes.roomList}>
                        {createdRoom && (
                            <ListItem className={classes.roomItem}>
                                {createdRoom.username}
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleDelete}
                                    disabled={!isCreateDisabled}
                                >
                                    Delete Room
                                </Button>
                            </ListItem>
                        )}
                        {rooms?.map((r, i) => (
                            <RoomComponent
                                key={i}
                                number={r.number}
                                roomCreator={r.roomCreator.username}
                                handleJoin={handleJoin}
                                disabledCondition={isCreateDisabled}
                            />
                        ))}
                    </List>
                </>}
                {gameState !== GameState.NOT_STARTED &&
                    <Box display="flex" height="80vh">
                        <Box flex={2} pr={2} style={{ minWidth: '60%' }}>
                            <Game yourColor={yourColor} socketRef={socketRef} gameStateRef={gameStateRef} />
                        </Box>
                        <Box flex={1} pl={2} style={{ minWidth: '30%' }}>
                            <Chat socketRef={socketRef} gameStateRef={gameStateRef} />
                        </Box>
                    </Box>}
                {gameState === GameState.FINISHED &&
                    <>
                        {result.isQuit && <Typography>{result.winner === "B" ? "Black" : "White"} won because the other player aborted the game</Typography>}
                        {!result.isQuit && <Typography>{result.winner === "B" ? "Black" : "White"} won</Typography>}
                        <Button type="button" onClick={handleNewGame}>New Game</Button>
                    </>}
            </div>
        </ThemeProvider>
    );
}

export default withAuth(Play);
