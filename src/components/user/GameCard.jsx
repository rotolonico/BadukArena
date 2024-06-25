import React from 'react';
import {Avatar, Card, CardContent, CardHeader, Typography} from "@mui/material";
import {SportsEsports} from "@mui/icons-material";
import TextResult from "./TextResult";

const GameCard = ({ game, index, currentUsername, classes }) => {

    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar aria-label="game" style={{backgroundColor: '#000000'}}>
                        <SportsEsports/>
                    </Avatar>
                }
                title={`Game ${index + 1}`}
                subheader={<Typography
                    className={classes.dateText}>{game.date}</Typography>}
            />
            <CardContent>
                <TextResult game={game} currentUsername={currentUsername} classes={classes} />
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    Winner: {game.result.winner === "W" ? game.white.username : game.black.username}
                </Typography>
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    White Player: {game.white.username}
                </Typography>
                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                    Black Player: {game.black.username}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default GameCard;