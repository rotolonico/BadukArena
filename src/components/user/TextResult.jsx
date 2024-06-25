import React from 'react';
import {Typography} from "@mui/material";
import {Cancel, CheckCircle} from "@mui/icons-material";

const TextResult = ({ game, currentUsername, classes }) => {

    const userIsWhite = game.white.username === currentUsername;
    const userIsBlack = game.black.username === currentUsername;
    const userWon = (game.result.winner === 'W' && userIsWhite) || (game.result.winner === "B" && userIsBlack);

    return(
        userWon ? (
            <Typography variant="body2" className={classes.winnerText}>
                <>
                    You Won!
                    <CheckCircle className={classes.resultIcon} style={{color: '#76ff03'}}/>
                </>
            </Typography>
        ) : (
            <Typography variant="body2" className={classes.loserText}>
                <>
                    You Lost.
                    <Cancel className={classes.resultIcon} style={{color: '#ff1744'}}/>
                </>
            </Typography>
        )
    );
}

export default TextResult;