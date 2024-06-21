import React, { useEffect, useState, useRef } from 'react';
import { getRooms, joinRoom, createRoom, deleteRoom } from "../utils/api";
import Room from "../components/Room";
import withAuth from "../withAuth";
import Game from "../components/game/Game";
import SocketClient from "../utils/SocketClient";
import Chat from "../components/chat/Chat";
import PlayerBox from "../components/PlayerBox";
import { Button, Typography, List, makeStyles, ThemeProvider, CssBaseline, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import theme from "../utils/theme";
import { Box } from "@mui/material";

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
    const [opponentUsername, setOpponentUsername] = useState('');
    const [yourUsername, setYourUsername] = useState('');
    const [result, setResult] = useState(null);
    const [selectedColor, setSelectedColor] = useState(' ');

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

        socketRef.current.socketListenGameStart((data) => {
            setGameState(GameState.STARTED);
            setYourColor(data.color);
            setOpponentUsername(data.opponentUsername);
            setYourUsername(data.playerUsername);
        });

        socketRef.current.socketListenGameOver((rst) => {
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

    const handleColorChange = (event) => {
        setSelectedColor(event.target.value);
    };

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
            const res = await createRoom(selectedColor);
            if (res.status === 201) {
                setCreatedRoom({ number: res.data.roomNumber, username: res.data.username, color: selectedColor});
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
                    <Box display="flex" justifyContent="right" alignItems="center" gap='20px'>
                        <FormControl variant="outlined" style={{ marginBottom: '16px', minWidth: 120 }}>
                            <InputLabel id="color-select-label">Color</InputLabel>
                            <Select
                                labelId="color-select-label"
                                value={selectedColor}
                                onChange={handleColorChange}
                                label="Color"
                            >
                                <MenuItem value=" ">Random</MenuItem>
                                <MenuItem value="B">Black</MenuItem>
                                <MenuItem value="W">White</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreate}
                            disabled={isCreateDisabled}
                            className={classes.createButton}
                        >
                            Create Room
                        </Button>
                    </Box>
                    <Typography variant="h6" gutterBottom>
                        Available Rooms
                    </Typography>
                    <List className={classes.roomList}>
                        {createdRoom && (
                            <Room
                                isOwn={true}
                                roomCreator={createdRoom.username}
                                handleDelete={handleDelete}
                                disabledCondition={!isCreateDisabled}
                                color={createdRoom.color}
                            />
                        )}
                        {rooms?.map((r, i) => (
                            <Room
                                key={i}
                                number={r.number}
                                roomCreator={r.roomCreator.username}
                                handleJoin={handleJoin}
                                disabledCondition={isCreateDisabled}
                                color={r.creatorWantedColor}
                            />
                        ))}
                    </List>
                </>}
                {gameState !== GameState.NOT_STARTED &&
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <Box sx={{ flex: 1, pr: 2, minWidth: '60%' }}>
                            <Game yourColor={yourColor} socketRef={socketRef} gameStateRef={gameStateRef} />
                        </Box>
                        <Box display="flex" flexDirection="column">
                            <Box display="flex" flexDirection="row" sx={{ flex: 1, pl: 2, minWidth: '30%' }}>
                                <PlayerBox username={yourUsername} color={yourColor} marginRight={2}/>
                                <PlayerBox username={opponentUsername} color={yourColor === 'B' ? 'W' : 'B'} />
                            </Box>
                            <Box sx={{ flex: 1, pl: 2, minWidth: '30%' }}>
                                <Chat socketRef={socketRef} gameStateRef={gameStateRef} />
                            </Box>
                        </Box>
                    </Box>
                }
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
