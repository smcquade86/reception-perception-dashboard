'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PlayerDataTable from '../components/PlayerDataTable';
import SimilarPlayerDataTable from '../components/SimilarPlayerDataTable';
import Filters from '../components/Filters';
import CustomScrollbarBox from '../components/CustomScrollbarBox'; // Import the custom scrollbar component

type RowData = { [key: string]: string };

const Page = () => {
  const [data, setData] = useState<{ players: RowData[], similarPlayers: RowData[] }>({ players: [], similarPlayers: [] });
  const [filteredData, setFilteredData] = useState<RowData[]>([]);
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/googleSheets');
      const sheetData = await response.json();
      if (sheetData.players.length > 0 || sheetData.similarPlayers.length > 0) {
        setData(sheetData);
      }
    };
    fetchData();
  }, []);

  const handleFilter = (filtered: RowData[], year: string, player: string) => {
    setFilteredData(filtered);
    setSelectedYear(year);
    setSelectedPlayer(player);
    setFiltersApplied(true);
  };

  return (
    <CustomScrollbarBox sx={{ paddingTop: '16px', paddingX: '16px' }}>
      <Filters data={data.players} onFilter={handleFilter} />
      {filtersApplied && filteredData.length > 0 && (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box sx={{ flex: '0 0 auto', minWidth: '300px', maxWidth: '500px', textAlign: 'center' }}>
            <PlayerDataTable data={data.players} selectedYear={selectedYear} selectedPlayer={selectedPlayer} />
          </Box>
          <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
            <SimilarPlayerDataTable
              data={data.players}
              similarPlayers={data.similarPlayers.filter(
                (row) => row.Player === selectedPlayer && row.Year === selectedYear
              )}
            />
          </Box>
        </Box>
      )}
    </CustomScrollbarBox>
  );
};

export default Page;