import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography, Box } from '@mui/material';

type RowData = { [key: string]: string };

interface PlayerDataTableProps {
  data: RowData[];
  selectedPlayer: string;
  selectedYear: string;
}

const PlayerDataTable: React.FC<PlayerDataTableProps> = ({ data, selectedPlayer, selectedYear }) => {
  if (!selectedPlayer || !selectedYear) {
    return (
      <Box sx={{ textAlign: 'center', height: '100%' }}>
        <Typography variant="body1" sx={{ fontSize: 'clamp(12px, 1vw, 16px)' }}>
          No data available for {selectedYear} - {selectedPlayer}
        </Typography>
      </Box>
    );
  }

  const filteredData = data.filter(row => row.Year === selectedYear && row.Player === selectedPlayer);

  if (filteredData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', height: '100%' }}>
        <Typography variant="body1" sx={{ fontSize: 'clamp(12px, 1vw, 16px)' }}>
          No data available for {selectedYear} - {selectedPlayer}
        </Typography>
      </Box>
    );
  }

  const headers = Object.keys(filteredData[0]);
  const routeHeaders = headers.filter(header => header.startsWith('Route %') && !header.includes('Rank'));
  const successRateHeaders = headers.filter(header => header.startsWith('Success Rate') && !header.includes('Rank'));

  const moveTotalRoutesToEnd = (headers: string[]) => {
    const totalRoutesIndex = headers.findIndex(header => header.includes('Total Routes'));
    if (totalRoutesIndex > -1) {
      const [totalRoutes] = headers.splice(totalRoutesIndex, 1);
      headers.push(totalRoutes);
    }
  };

  moveTotalRoutesToEnd(routeHeaders);
  moveTotalRoutesToEnd(successRateHeaders);

  return (
    <TableContainer component={Paper} sx={{ height: '100%', textAlign: 'center' }}>
      <Table sx={{ width: 300, maxHeight: 500 }} aria-label="player data table">
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} align="center" sx={{ padding: '8px' }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                Selected Player
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3} align="center" sx={{ padding: '8px' }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {selectedYear} - {selectedPlayer}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" sx={{ padding: '8px' }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Route</Typography>
            </TableCell>
            <TableCell align="center" sx={{ padding: '8px' }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Route %</Typography>
            </TableCell>
            <TableCell align="center" sx={{ padding: '8px' }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Success Rate</Typography>
            </TableCell>
          </TableRow>
          {routeHeaders.map((routeHeader, routeIndex) => {
            const routeColor = filteredData[0][`color_${routeHeader}`];
            const successRateColor = filteredData[0][`color_${successRateHeaders[routeIndex]}`];

            return (
              <TableRow key={routeHeader}>
                <TableCell align="center" sx={{ padding: '8px' }}>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {routeHeader.replace('Route %', '')}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ padding: '2px' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem',
                      display: 'inline-block',
                      border:`3px solid ${routeColor}`,
                      paddingLeft: '5px',
                      paddingRight: '5px',
                    }}
                  >
                    {routeHeader === 'Route % Total Routes' ? filteredData[0][routeHeader] : `${(parseFloat(filteredData[0][routeHeader]) * 100).toFixed(2)}%`}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ padding: '2px' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem',
                      border: routeHeader === 'Route % Total Routes' ? 'none' : `3px solid ${successRateColor}`,
                      display: 'inline-block',
                      paddingLeft: '5px',
                      paddingRight: '5px',
                    }}
                  >
                    {routeHeader === 'Route % Total Routes' ? '' : `${(parseFloat(filteredData[0][successRateHeaders[routeIndex]]) * 100).toFixed(2)}%`}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayerDataTable;