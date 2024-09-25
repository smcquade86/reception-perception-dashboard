// src/components/Filters.tsx
import React, { useEffect, useState } from 'react';
import { Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';

type RowData = { [key: string]: string };

interface FiltersProps {
  data: RowData[];
  onFilter: (filteredData: RowData[], selectedYear: string, selectedPlayer: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ data, onFilter }) => {
  const [years, setYears] = useState<string[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');

  useEffect(() => {
    const uniqueYears = [...new Set(data.map((row: RowData): string => row.Year as string))] as string[];
    uniqueYears.sort((a, b) => parseInt(b) - parseInt(a)); // Sort years in descending order
    setYears(uniqueYears);
  }, [data]);

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
    onFilter(filtered, selectedYear, selectedPlayer);
  };

  return (
    <>
      <FormControl variant="outlined" style={{ minWidth: 120, minHeight: 50, marginRight: 10 }}>
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
      <FormControl variant="outlined" style={{ minWidth: 200, minHeight: 50, marginRight: 10, marginBottom:10 }}>
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
      <Button variant="contained" color="primary" style={{ minHeight: 50, marginRight: 10, marginTop: 2 }} onClick={handleApplyFilters} disabled={!selectedYear || !selectedPlayer}>
        Apply
      </Button>
    </>
  );
};

export default Filters;