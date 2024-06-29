import React from 'react';
import { ListItem, Button, makeStyles, Typography, Avatar } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

import randomStone from '../../static/images/black-white-stone.png';
import whiteStone from '../../static/images/white-stone.png';
import blackStone from '../../static/images/black-stone.png';
import {Delete, PlayArrow} from "@mui/icons-material";




const theme = createTheme({
    palette: {
        primary: {
            main: 'rgba(0,155,11,0.98)'
        },
    },
});

const useStyles = makeStyles((theme) => ({
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #444',
        backgroundColor: '#262424',
        marginBottom: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        color: '#fff',
    },
    joinButton: {
        marginLeft: theme.spacing(2),
        color: '#fff',
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    },
    deleteButton: {
        marginLeft: theme.spacing(2),
        color: '#fff',
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark,
        },
    },
    roomInfo: {
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
    },
    avatar: {
        marginRight: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
    },
}));
const getImageFromColor = (color) => {
    switch (color) {
        case 'B':
            return blackStone;
        case 'W':
            return whiteStone;
        default:
            return randomStone;
    }
};

const RoomComponent = ({ number, roomCreator, handleJoin, handleDelete, disabledCondition, isOwn, color }) => {
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ListItem className={classes.listItem}>
                <div className={classes.roomInfo}>
                    <Avatar className={classes.avatar} src={getImageFromColor(color)} >
                        <PersonIcon />
                    </Avatar>
                    <Typography variant="h6">
                        {isOwn ? `${roomCreator} (You)` : `${roomCreator}`}
                    </Typography>
                </div>
                {isOwn &&
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleDelete}
                        disabled={disabledCondition}
                        className={classes.deleteButton}
                    startIcon={<Delete/>}>
                        Delete Room
                    </Button>
                }
                {!isOwn &&
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleJoin(number)}
                        disabled={disabledCondition}
                        className={classes.joinButton}
                        startIcon={<PlayArrow/>}
                    >
                        Join
                    </Button>
                }

            </ListItem>
        </ThemeProvider>
    );
}

export default RoomComponent;
