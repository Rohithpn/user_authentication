const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for frontend requests

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // Default username for XAMPP MySQL
    password: '',          // Default password for XAMPP MySQL (empty by default)
    database: 'user_auth'  // Replace with your database name
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});

// Sign-up endpoint
app.post('/signup', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const query = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
    connection.query(query, [firstName, lastName, email, password], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ success: false, message: 'Error inserting user' });
        }
        res.status(200).json({ success: true, message: 'User registered successfully' });
    });
});

// Log-in endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error querying user:', err);
            return res.status(500).json({ success: false, message: 'Error querying user' });
        }
        if (results.length > 0) {
            res.status(200).json({ success: true, message: 'User authenticated successfully' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Serve static files (frontend)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
