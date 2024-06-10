const RoomComponent = ({ number, roomCreator, handleJoin }) => {
    return (
        <li>{number} -
            {roomCreator}
            <button type="button" onClick={() => handleJoin(number)}>Join</button>
        </li>
    );
}

export default RoomComponent;