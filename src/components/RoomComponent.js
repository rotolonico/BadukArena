const RoomComponent = ({ number, roomCreator }) => {
    return (
        <tr>
            <td>{number}<input type="hidden" name="number" value={number}/></td>
            <td>{roomCreator}</td>
            <td><input type="submit" value="Join"/></td>
        </tr>
    );
}

export default RoomComponent;