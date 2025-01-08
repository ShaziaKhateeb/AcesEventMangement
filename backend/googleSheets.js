const { google } = require('googleapis');
const fs = require('fs');
const db = require('./config/db'); // Database connection file (if already set up)

// Load the service account key file
const credentials = JSON.parse(fs.readFileSync('credentials.json'));

// Authorize a client with the service account
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Google Sheet details
const spreadsheetId = '1lYKbt4V_1MGF9I43SUi5sr2Y6n8-P3P2Q92gvBTJrms'; // Replace with your actual spreadsheet ID
const range = 'Sheet1!A:D'; // Adjust the range as needed

// Fetch data from Google Sheets
async function fetchSheetData() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        return response.data.values; // Return the data from the sheet
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        throw error;
    }
}

// Sync data to the MySQL database
async function syncDataToDatabase() {
    try {
        const rows = await fetchSheetData();
        if (rows && rows.length > 0) {
            rows.forEach(([name, email, event]) => {
                const query = 'INSERT INTO participants (name, email, event) VALUES (?, ?, ?)';
                db.query(query, [name, email, event], (err) => {
                    if (err) console.error('Error inserting row:', err);
                });
            });
            console.log('Data synced successfully');
        } else {
            console.log('No data found in the sheet');
        }
    } catch (error) {
        console.error('Error syncing data to database:', error);
    }
}

module.exports = { fetchSheetData, syncDataToDatabase };

