import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';

dotenv.config();

type RowData = { [key: string]: string };

async function fetchGoogleSheetData(): Promise<{ players: RowData[], similarPlayers: RowData[] }> {
  const base64Credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
  if (!base64Credentials) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_BASE64 environment variable is not set');
  }

  const credentials = JSON.parse(Buffer.from(base64Credentials, 'base64').toString('utf8'));

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: '1r4kOb2_pJnSQmV8qGzWD2_ofnXLk-V85TrYLQRcFe44',
    });

    console.log('Available sheets:', spreadsheet.data.sheets?.map(sheet => sheet.properties?.title));

    // Fetch data from the player_data sheet
    const playersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: '1r4kOb2_pJnSQmV8qGzWD2_ofnXLk-V85TrYLQRcFe44',
      range: 'player_data!A:BL',
    });

    const playersRows = playersResponse.data.values;
    const playersData: RowData[] = playersRows && playersRows.length > 0 ? playersRows.slice(1).map(row => {
      const rowData: RowData = {};
      playersRows[0].forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    }) : [];

    // Fetch data from the player_data_colors sheet
    const colorsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: '1r4kOb2_pJnSQmV8qGzWD2_ofnXLk-V85TrYLQRcFe44',
      range: 'player_data_colors!A:BL',
    });

    const colorsRows = colorsResponse.data.values;
    const colorsData: RowData[] = colorsRows && colorsRows.length > 0 ? colorsRows.slice(1).map(row => {
      const rowData: RowData = {};
      colorsRows[0].forEach((header, index) => {
        rowData[`color_${header}`] = row[index];
      });
      return rowData;
    }) : [];

    // Join player_data with player_data_colors
    const joinedData = playersData.map(playerRow => {
      const colorRow = colorsData.find(colorRow => colorRow['color_Year'] === playerRow['Year'] && colorRow['color_Player'] === playerRow['Player']);
      return { ...playerRow, ...colorRow };
    });

    // Fetch data from the similar_players sheet
    const similarPlayersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: '1r4kOb2_pJnSQmV8qGzWD2_ofnXLk-V85TrYLQRcFe44',
      range: 'similar_players!A:F',
    });

    const similarPlayersRows = similarPlayersResponse.data.values;
    const similarPlayersData: RowData[] = similarPlayersRows && similarPlayersRows.length > 0 ? similarPlayersRows.slice(1).map(row => {
      const rowData: RowData = {};
      similarPlayersRows[0].forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    }) : [];

    return { players: joinedData, similarPlayers: similarPlayersData };
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw new Error('Failed to fetch Google Sheets data');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await fetchGoogleSheetData();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch Google Sheets data' });
  }
}