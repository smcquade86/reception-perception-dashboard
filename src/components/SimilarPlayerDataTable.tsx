import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography, Box } from '@mui/material';

type RowData = { [key: string]: string };

interface SimilarPlayerDataTableProps {
  data: RowData[];
  similarPlayers: RowData[];
}

const SimilarPlayerDataTable: React.FC<SimilarPlayerDataTableProps> = ({ data, similarPlayers = [] }) => {
  const getFilteredData = (year: string, player: string) => {
    return data.filter(row => row.Year === year && row.Player === player);
  };

  const moveTotalRoutesToEnd = (headers: string[]) => {
    const totalRoutesIndex = headers.findIndex(header => header.includes('Total Routes'));
    if (totalRoutesIndex > -1) {
      const [totalRoutes] = headers.splice(totalRoutesIndex, 1);
      headers.push(totalRoutes);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 2, justifyContent: 'flex-start', width: '100%', overflowX: 'auto' }}>
      {similarPlayers.map((similarPlayer, index) => {
        const filteredData = getFilteredData(similarPlayer.Similar_Year, similarPlayer.Similar_Player);

        if (filteredData.length === 0) {
          return (
            <Box key={index} sx={{ flex: '0 0 auto', minWidth: '300px', maxWidth: '600px', textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontSize: 'clamp(12px, 1vw, 16px)' }}>
                No data available for {similarPlayer.Similar_Year} - {similarPlayer.Similar_Player}
              </Typography>
            </Box>
          );
        }

        const headers = Object.keys(filteredData[0]);
        const routeHeaders = headers.filter(header => header.startsWith('Route %') && !header.includes('Rank'));
        const successRateHeaders = headers.filter(header => header.startsWith('Success Rate') && !header.includes('Rank'));

        moveTotalRoutesToEnd(routeHeaders);
        moveTotalRoutesToEnd(successRateHeaders);

        return (
          <TableContainer component={Paper} key={index} sx={{ flex: '0 0 auto', textAlign: 'center', width: 300 }}>
            <Table sx={{ width: 300, maxHeight: 500 }} aria-label="similar player data table">
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ padding: '8px' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      Similar Player {similarPlayer.Similarity_Rank} - {(parseFloat(similarPlayer.Similarity_Score) * 100).toFixed(2)}%
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ padding: '8px' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {similarPlayer.Similar_Year} - {similarPlayer.Similar_Player}
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
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', display: 'inline-block', border: `3px solid ${routeColor}`, paddingLeft: '5px', paddingRight: '5px' }}>
                          {routeHeader === 'Route % Total Routes' ? filteredData[0][routeHeader] : `${(parseFloat(filteredData[0][routeHeader]) * 100).toFixed(2)}%`}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ padding: '2px' }}>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', border: `3px solid ${successRateColor}`, display: 'inline-block', paddingLeft: '5px', paddingRight: '5px' }}>
                          {successRateHeaders[routeIndex] === 'Success Rate by Route Total Routes' ? filteredData[0][successRateHeaders[routeIndex]] : `${(parseFloat(filteredData[0][successRateHeaders[routeIndex]]) * 100).toFixed(2)}%`}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        );
      })}
    </Box>
  );
};

export default SimilarPlayerDataTable;