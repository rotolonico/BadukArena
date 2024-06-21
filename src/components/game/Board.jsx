import React from 'react';
import { Grid } from '@mui/material';
import Cell from './Cell';

const Board = ({ board, onCellClick }) => {
    return (
        <Grid container spacing={0} sx={{ width: `${board.length * 32}px`, margin: 'auto' }}>
            {board.map((row, x) =>
                row.map((cell, y) => (
                    <Grid item key={`${x}-${y}`}>
                        <Cell value={cell} onClick={() => onCellClick(x, y)} />
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default Board;
