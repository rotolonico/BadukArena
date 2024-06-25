import React from 'react';
import Cell from './Cell';
import woodBackground from '../../../static/images/wood-background.jpg';
import { Typography } from '@mui/material';

const Board = ({ board, onCellClick }) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    const labelStyle = {
        display: 'flex',
        justifyContent: 'center',
        margin: '2vh ',
        alignItems: 'center',
        fontSize: '3vh',
        fontWeight: 'bold',
        color: '#000',
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${board.length}, 1fr) auto`, gridTemplateRows: `auto repeat(${board.length}, 1fr) auto`, aspectRatio: '1 / 1', width: '100%', backgroundImage: `url(${woodBackground})`, border: '2px solid black' }}>
                <div></div>
                {letters.map(letter => (
                    <Typography key={letter} style={labelStyle}>{letter}</Typography>
                ))}
                <div></div>
                {board.map((row, x) => (
                    <React.Fragment key={x}>
                        <Typography style={labelStyle}>{numbers[x]}</Typography>
                        {row.map((cell, y) => (
                            <Cell key={`${x}-${y}`} value={cell} onClick={() => onCellClick(x, y)} />
                        ))}
                        <Typography style={labelStyle}>{numbers[x]}</Typography>
                    </React.Fragment>
                ))}
                <div></div>
                {letters.map(letter => (
                    <Typography key={letter} style={labelStyle}>{letter}</Typography>
                ))}
                <div></div>
            </div>
        </div>
    );
};

export default Board;
