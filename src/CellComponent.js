import React from 'react';

const Cell = ({ value, onClick }) => {
    const getColor = () => {
        if (value === 'B') return 'black';
        if (value === 'W') return 'white';
        return 'red';
    };

    return (
        <div
            onClick={onClick}
            style={{
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                backgroundColor: getColor(),
                border: '1px solid black'
            }}
        >
        </div>
    );
};

export default Cell;
