const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();

// Database Connection
const dbUri = process.env.DATABASE_URI || 'mongodb://localhost:27017/phoenix';

mongoose.connect(dbUri)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Failed to connect:', err));

// Serve Vite frontend (dist folder)
const uiPath = path.join(__dirname, 'dist');
app.use(express.static(uiPath));

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Health API
app.get('/api/health', (req, res) => {

    // Write to server.log
    fs.appendFileSync(
        path.join(logDir, 'server.log'),
        `Health check accessed at ${new Date().toISOString()}\n`
    );

    res.json({
        status: 'API is alive'
    });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});