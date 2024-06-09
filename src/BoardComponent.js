// src/components/Board.js
import React from 'react';
import Cell from './CellComponent';

const Board = ({ board, onCellClick }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${board.length}, 30px)` }}>
            {board.map((row, x) =>
                row.map((cell, y) =>
                    <Cell key={`${x}-${y}`} value={cell} onClick={() => 
                        onCellClick(x, y)} />
                )
            )}
        </div>
    );
};

export default Board;
