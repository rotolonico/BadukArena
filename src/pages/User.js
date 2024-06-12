import React, {useEffect, useState} from 'react';
import { getGames } from "../utils/api";
import withAuth from "../withAuth";

const User = () => {
    const [games, setGames] = useState([]);

    useEffect( () => {
        getGames().then((response) => {
            setGames(response.data);
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <>
            <h1>Games List</h1>
            {games.length === 0 ? (
                <p>No games found</p>
            ) : (
                <ul>
                    {games?.map((g, i) => (
                        <li key={i}>{g.black} {g.result === "B" ? "1-0" : "0-1"} {g.white}</li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default withAuth(User);