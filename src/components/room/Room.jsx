import React from 'react';
import { ListItem, Button, makeStyles, Typography, Avatar } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

const injectFont = () => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
};

injectFont();

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
            main: '#1976d2',
        },
    },
});

const useStyles = makeStyles((theme) => ({
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
        marginBottom: '5px',
        borderRadius: '4px',
    },
    joinButton: {
        marginLeft: theme.spacing(2),
    },
    roomInfo: {
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
    },
    avatar: {
        marginRight: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
    },
}));

const RoomComponent = ({ number, roomCreator, handleJoin, disabledCondition }) => {
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ListItem className={classes.listItem}>
                <div className={classes.roomInfo}>
                    <Avatar className={classes.avatar}>
                        <PersonIcon />
                    </Avatar>
                    <Typography variant="h6">
                        {`${number} - ${roomCreator}`}
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleJoin(number)}
                    disabled={disabledCondition}
                    className={classes.joinButton}
                >
                    Join
                </Button>
            </ListItem>
        </ThemeProvider>
    );
}

export default RoomComponent;
