// src/pages/api/googleSheets.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { google, sheets_v4 } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: 'src/config/credentials.json', // Update this path
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

type RowData = { [key: string]: string };

async function fetchGoogleSheetData(): Promise<RowData[]> {
  const client = await auth.getClient();
  const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth: client });

  // Log available sheets
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: '1r4kOb2_pJnSQmV8qGzWD2_ofnXLk-V85TrYLQRcFe44',
  });
  console.log('Available sheets:', spreadsheet.data.sheets?.map(sheet => sheet.properties?.title));

  // Fetch data from the specified range
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: '1r4kOb2_pJnSQmV8qGzWD2_ofnXLk-V85TrYLQRcFe44',
    range: 'similar_players!A:F',
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  const headers = rows[0];
  const data: RowData[] = rows.slice(1).map(row => {
    const rowData: RowData = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index];
    });
    return rowData;
  });

  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await fetchGoogleSheetData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Google Sheets data' });
  }
}