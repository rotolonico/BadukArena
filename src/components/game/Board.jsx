// Board.jsx
import React from 'react';
import { Grid } from '@mui/material';
import Cell from './Cell';

const Board = ({ board, onCellClick }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${board.length}, 1fr)`, aspectRatio: '1 / 1', width: '100%'}}>
                {board.map((row, x) =>
                    row.map((cell, y) => (
                        <Cell key={`${x}-${y}`} value={cell} onClick={() => onCellClick(x, y)} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Board;
