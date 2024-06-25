import React, { useEffect, useState, useRef } from 'react';
import { getRooms, joinRoom, createRoom, deleteRoom } from "../utils/api";
import Room from "../components/play/Room";
import withAuth from "../withAuth";
import Game from "./Game";
import SocketClient from "../utils/SocketClient";
import { AddCircle, Refresh } from '@mui/icons-material';
import {
    Button,
    Typography,
    List,
    makeStyles,
    ThemeProvider,
    CssBaseline,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid
} from '@material-ui/core';
import theme from "../utils/theme";
import { Box, Snackbar, CircularProgress } from "@mui/material";

import gameStart from "../static/sounds/game_start.mp3"
import gameWin from "../static/sounds/game_win.mp3"
import gameLose from "../static/sounds/game_lose.mp3"

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 1200,
        backgroundColor: theme.palette.background.paper,
        margin: '0 auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '3px 3px 15px rgba(0, 0, 0, 0.5)',
    },
    createButton: {
        marginBottom: '20px',
    },
    refreshButton: {
        marginBottom: '20px',
        marginLeft: theme.spacing(2),
    },
    roomList: {
        listStyle: 'none',
        padding: 0,
    },
    roomItem: {
        marginBottom: '10px',
    },
    select: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'black', // Contorno nero
            },
            '&:hover fieldset': {
                borderColor: 'black', // Contorno nero al passaggio del mouse
            },
            '&.Mui-focused fieldset': {
                borderColor: 'black', // Contorno nero quando in focus
            },
        },
    },
    formControl: {
        marginBottom: '16px',
        minWidth: 120,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: theme.spacing(2),
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
    },
    gridContainer: {
        marginTop: theme.spacing(2),
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
    const [isLoading, setIsLoading] = useState(false);
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
    const yourColorRef = useRef(yourColor);

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        yourColorRef.current = yourColor;
    }, [yourColor]);

    useEffect(() => {
        socketRef.current = new SocketClient();

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
            document.getElementById("gameStart").play();
        });

        socketRef.current.socketListenGameOver((rst) => {
            setResult(rst);
            setGameState(GameState.FINISHED);
            console.log(rst.winner);
            if (rst.winner === yourColorRef.current) {
                document.getElementById("gameWin").play();
            } else {
                document.getElementById("gameLose").play();
            }
        });

        socketRef.current.socketListenGameAborted(() => {
            window.location.reload();
        });

        return () => {
            clearInterval(intervalId);
            socketRef.current.socketRemoveAllGameListeners();
            socketRef.current.disconnect();
        };
    }, []);

    const refreshRooms = (showLoader = false) => {
        if (showLoader) setIsLoading(true);
        setTimeout(() => {
            getRooms()
                .then(roomsList => {
                    setRooms(roomsList.data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setIsLoading(false);
                });
        }, 500); // Ritardo di 500 ms
    };


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
                setCreatedRoom({ number: res.data.roomNumber, username: res.data.username, color: selectedColor });
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

    const handleRefreshClick = () => {
        refreshRooms(true);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className={classes.root}>
                {gameState === GameState.NOT_STARTED && <>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <FormControl variant="outlined" className={`${classes.formControl} ${classes.select}`}>
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
                        <Box display="flex" alignItems="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCreate}
                                disabled={isCreateDisabled}
                                className={classes.createButton}
                                startIcon={<AddCircle />}
                            >
                                Create Room
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleRefreshClick}
                                className={classes.refreshButton}
                                startIcon={<Refresh />}
                            >
                                Refresh
                            </Button>
                        </Box>
                    </Box>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Available Rooms
                    </Typography>
                    {isLoading ? (
                        <Box className={classes.loading}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={2} className={classes.gridContainer}>
                            {createdRoom && (
                                <Grid item xs={12}>
                                    <Room
                                        isOwn={true}
                                        roomCreator={createdRoom.username}
                                        handleDelete={handleDelete}
                                        disabledCondition={!isCreateDisabled}
                                        color={createdRoom.color}
                                    />
                                </Grid>
                            )}
                            {rooms?.map((r, i) => (
                                <Grid item xs={12} key={i}>
                                    <Room
                                        number={r.number}
                                        roomCreator={r.roomCreator.username}
                                        handleJoin={handleJoin}
                                        disabledCondition={isCreateDisabled}
                                        color={r.creatorWantedColor}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>}
                {gameState !== GameState.NOT_STARTED &&
                    <Game yourColor={yourColor} socketRef={socketRef} gameState={gameState}
                          opponentUsername={opponentUsername} yourUsername={yourUsername} />
                }
                {gameState === GameState.FINISHED &&
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        open={true}
                        autoHideDuration={0}
                        message={
                            result.isQuit
                                ? `${result.winner === "B" ? "Black" : "White"} won because the other player aborted the game`
                                : `${result.winner === "B" ? "Black" : "White"} won`
                        }
                        action={
                            <React.Fragment>
                                <Button color="inherit" onClick={handleNewGame}>New Game</Button>
                            </React.Fragment>
                        }
                    />
                }
            </div>
            <audio id="gameStart">
                <source src={gameStart} type="audio/mp3"/>
            </audio>
            <audio id="gameWin">
                <source src={gameWin} type="audio/mp3"/>
            </audio>
            <audio id="gameLose">
                <source src={gameLose} type="audio/mp3"/>
            </audio>
        </ThemeProvider>
    );
}

export default withAuth(Play);
