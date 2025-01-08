const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const QRCode = require('qrcode');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'attendance_db',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database.');
    }
});

// Generate QR Code for a participant
app.post('/generate-qr', async (req, res) => {
    const { id } = req.body;
    const qrCodeData = `https://yourwebsite.com/attendance/${id}`;
    const qrCode = await QRCode.toDataURL(qrCodeData);
    res.json({ qrCode });
});

// Mark attendance
app.post('/check-in', (req, res) => {
    const { participantId } = req.body;
    db.query(
        'UPDATE participants SET attendance_status = 1 WHERE id = ?',
        [participantId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Attendance marked!' });
        }
    );
});

// Fetch attendance data
app.get('/attendance', (req, res) => {
    db.query('SELECT * FROM participants', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));
const { syncDataToDatabase } = require('./googleSheets');
app.get('/sync-registrations', async (req, res) => {
    try {
        await syncDataToDatabase();
        res.json({ message: 'Data synced successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to sync data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



