// src/app/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from '@mui/material';

type RowData = { [key: string]: string };

const Page = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [filteredData, setFilteredData] = useState<RowData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/googleSheets');
      const sheetData = await response.json();
      if (sheetData.length > 0) {
        setHeaders(Object.keys(sheetData[0]));
        setData(sheetData);
        const uniqueYears = [...new Set(sheetData.map((row: RowData): string => row.Year as string))] as string[];
        uniqueYears.sort((a, b) => parseInt(b) - parseInt(a)); // Sort years in descending order
        setYears(uniqueYears);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      const filteredPlayers = data
        .filter((row) => row.Year === selectedYear)
        .map((row) => row.Player);
      setPlayers([...new Set(filteredPlayers)]);
    } else {
      setPlayers([]);
    }
  }, [selectedYear, data]);

  const handleApplyFilters = () => {
    let filtered = data;
    if (selectedYear) {
      filtered = filtered.filter((row) => row.Year === selectedYear);
    }
    if (selectedPlayer) {
      filtered = filtered.filter((row) => row.Player === selectedPlayer);
    }
    setFilteredData(filtered);
    setFiltersApplied(true);
  };

  return (
    <>
      <FormControl variant="outlined" style={{ minWidth: 120, marginRight: 10 }}>
        <InputLabel>Year</InputLabel>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value as string)}
          label="Year"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ minWidth: 120, marginRight: 10 }}>
        <InputLabel>Player</InputLabel>
        <Select
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value as string)}
          label="Player"
          disabled={!selectedYear}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {players.map((player) => (
            <MenuItem key={player} value={player}>
              {player}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleApplyFilters} disabled={!selectedYear || !selectedPlayer}>
        Apply
      </Button>
      {filtersApplied && filteredData.length > 0 && (
        <>
          <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Year and Player</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">{`${filteredData[0].Year} - ${filteredData[0].Player}`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const similarRow = filteredData.find(row => row.Similarity_Rank === `${i + 1}`);
                    return (
                      <TableCell key={i} align="center">
                        {similarRow
                          ? `Similarity Rank ${i + 1} - ${(parseFloat(similarRow.Similarity_Score) * 100).toFixed(2)}%`
                          : `Similarity Rank ${i + 1}`}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const similarRow = filteredData.find(row => row.Similarity_Rank === `${i + 1}`);
                    return (
                      <TableCell key={i} align="center">
                        {similarRow
                          ? `${similarRow.Similar_Year} - ${similarRow.Similar_Player}`
                          : 'N/A'}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default Page;