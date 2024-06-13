const RoomComponent = ({ number, roomCreator, handleJoin, disabledCondition }) => {
    return (
        <li>
            {number} - {roomCreator}
            <button type="button" onClick={() => handleJoin(number)} disabled={disabledCondition}>Join</button>
        </li>
    );
}

export default RoomComponent;