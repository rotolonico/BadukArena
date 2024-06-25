import React from 'react';
import { styled } from '@mui/system';
import blackStone from '../../static/images/black-stone.png';
import whiteStone from '../../static/images/white-stone.png';

const StyledCell = styled('div')(({ theme, hasStone }) => ({
    width: '100%',
    aspectRatio: '1 / 1',
    cursor: hasStone ? 'default' : 'pointer',
    backgroundColor: 'transparent',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
        backgroundColor: hasStone ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
    },
}));

const Crosshair = styled('div')({
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 0,
    '::before': {
        content: '""',
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '2px',
        backgroundColor: 'rgba(0, 0, 0, 1)',
    },
    '::after': {
        content: '""',
        position: 'absolute',
        left: '0',
        right: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        height: '2px',
        backgroundColor: 'rgba(0, 0, 0, 1)',
    },
});

const Stone = styled('img')({
    width: '80%',
    height: '80%',
    position: 'relative',
    zIndex: 1
});

const Cell = ({ value, onClick }) => {
    const hasStone = value !== " ";
    const getStone = () => {
        if (value === 'B') return blackStone;
        if (value === 'W') return whiteStone;
        return null;
    };

    const stone = getStone();

    return (
        <StyledCell onClick={onClick} hasStone={hasStone}>
            <Crosshair />
            {stone && <Stone src={stone} alt={value === 'B' ? 'Black Stone' : 'White Stone'} />}
        </StyledCell>
    );
};

export default Cell;
