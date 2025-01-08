const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',            // Replace with your MySQL username
    password: '********', // Replace with your MySQL password
    database: 'attendance_db',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = db;

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
