import React, { useEffect, useState } from 'react';
import { getGames } from "../utils/api";
import withAuth from "../withAuth";
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography, CircularProgress, Box
} from '@mui/material';

const User = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getGames().then((response) => {
            setGames(response.data);
            setLoading(false);
        }).catch((error) => {
            console.error(error);
            setLoading(false);
        });
    }, []);

    return (
        <Box sx={{ p: 3, backgroundColor: '#f4f6f8', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                Games List
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                games.length === 0 ? (
                    <Typography variant="body1">
                        No games found
                    </Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead sx={{ backgroundColor: '#1976d2' }}>
                                <TableRow>
                                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Result</TableCell>
                                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>White Player</TableCell>
                                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Black Player</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {games.map((game, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center" sx={{ fontSize: '1rem' }}>
                                            {new Date(game.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '1rem', color: game.result === "B" ? 'green' : 'red' }}>
                                            {game.result === "B" ? "Black Wins" : "White Wins"}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '1rem' }}>
                                            {game.white.username}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '1rem' }}>
                                            {game.black.username}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            )}
        </Box>
    );
}

export default withAuth(User);
