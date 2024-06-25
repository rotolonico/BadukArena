import React from 'react';
import Cell from './Cell';
import woodBackground from '../../../static/images/wood-background.jpg';

const Board = ({ board, onCellClick }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${board.length}, 1fr)`, aspectRatio: '1 / 1', width: '100%', backgroundImage: `url(${woodBackground})`}}>
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
