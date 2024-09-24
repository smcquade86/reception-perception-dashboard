import React from 'react';

type RowData = { [key: string]: string };
interface PlayerDataTableProps {
    data: RowData[];
    selectedYear: string;
    selectedPlayer: string;
}

const PlayerDataTable: React.FC<PlayerDataTableProps> = ({ data, selectedYear, selectedPlayer }) => {
    const filteredData = data.filter(row => row.Year === selectedYear && row.Player === selectedPlayer);

    if (filteredData.length === 0) {
        return <p>No data available for the selected year and player.</p>;
    }

    const headers = Object.keys(filteredData[0]);
    const routeHeaders = headers.filter(header => header.startsWith('Route %') && !header.includes('Rank'));
    const successRateHeaders = headers.filter(header => header.startsWith('Success Rate') && !header.includes('Rank'));

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
            <table style={{ textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th>Route %</th>
                        {filteredData.map((_, index) => (
                            <th key={index}></th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {routeHeaders.map(header => (
                        <tr key={header}>
                            <td>{header.replace('Route %', '')}</td>
                            {filteredData.map((row, index) => (
                                <td key={index}>
                                    {header === 'Route % Total Routes'
                                        ? row[header]
                                        : `${(parseFloat(row[header]) * 100).toFixed(2)}%`}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <table style={{ textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th>Success Rate by Route</th>
                        {filteredData.map((_, index) => (
                            <th key={index}></th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {successRateHeaders.map(header => (
                        <tr key={header}>
                            <td>{header.replace('Success Rate by Route', '')}</td>
                            {filteredData.map((row, index) => (
                                <td key={index}>
                                    {header === 'Success Rate by Route Total Routes'
                                        ? row[header]
                                        : `${(parseFloat(row[header]) * 100).toFixed(2)}%`}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerDataTable;