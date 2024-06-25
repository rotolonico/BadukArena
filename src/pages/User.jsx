import React, {useEffect, useState} from 'react';
import {getGames} from "../utils/api";
import withAuth from "../withAuth";
import moment from "moment";
import {Typography, CircularProgress, Box, Grid} from '@mui/material';
import {createTheme, CssBaseline, makeStyles, ThemeProvider} from "@material-ui/core";
import GameCard from "../components/user/GameCard";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '20px',
        borderRadius: '10px',
    },
    card: {
        backgroundColor: '#333333',
        color: 'white',
        borderRadius: '10px',
        boxShadow: '3px 3px 15px rgba(0, 0, 0, 0.5)',
        margin: '10px 0',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '3px 3px 20px rgba(255, 255, 255, 0.5)',
        },
    },
    winnerText: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
        color: '#76ff03', // Green color for winner
    },
    loserText: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
        color: '#ff1744', // Red color for loser
    },
    icon: {
        marginRight: '8px',
    },
    noGamesText: {
        fontSize: '1.2rem',
        textAlign: 'center',
        color: 'white',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    resultIcon: {
        verticalAlign: 'middle',
        marginLeft: '8px',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    dateText: {
        color: 'white',
    }
}));

const theme = createTheme({
    palette: {
        primary: {
            main: '#262424',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
});

const User = ({currentUsername}) => {
    const classes = useStyles();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getGames().then((response) => {
            setGames(response.data);
            const gameList = response.data.map((g) => {
                g.date = moment(g.date).format('DD-MM-YYYY');
                return g;
            });
            setGames(gameList);
            setLoading(false);
        }).catch((error) => {
            console.error(error);
            setLoading(false);
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box className={classes.root}>
                <Typography variant="h4" gutterBottom sx={{mb: 2, color: 'white'}}>
                    Games List
                </Typography>
                {loading ? (
                    <Box className={classes.loadingContainer}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    games.length === 0 ? (
                        <Typography className={classes.noGamesText}>
                            No games found
                        </Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {games.map((game, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <GameCard game={game} index={index} currentUsername={currentUsername} classes={classes}/>
                                </Grid>
                            ))}
                        </Grid>
                    )
                )}
            </Box>
        </ThemeProvider>
    );
}

export default withAuth(User);
