const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS so Stremio can talk to your server
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

// Serve index.html on the homepage (fixes the "Not Found" issue)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================================
// YOUR STREMIO ADDON ROUTES (Manifest, Subtitles, Gemini AI)
// ============================================================

// ... (Put all your original manifest and subtitle translating logic here) ...


// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
