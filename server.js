const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS so Stremio can connect from any device
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

// Serve frontend configuration page at the root URL
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 1. MANIFEST ENDPOINT (Fixes "Failed to get addon manifest")
const getManifest = (req, res) => {
    res.json({
        id: 'org.stremio.arabic.gemini',
        version: '1.0.0',
        name: 'Arabic Gemini Subtitles',
        description: 'Translates subtitles to Arabic using Gemini AI',
        resources: ['subtitles'],
        types: ['movie', 'series'],
        catalogs: []
    });
};

app.get('/manifest.json', getManifest);
app.get('/:subKey/:transKey/:model/manifest.json', getManifest);

// 2. SUBTITLES ENDPOINT (Fetches and serves subtitles)
app.get('/:subKey/:transKey/:model/subtitles/:type/:id/:extra?.json', async (req, res) => {
    const { subKey, transKey, model, type, id } = req.params;

    console.log(`\n--- Stremio Request Received ---`);
    console.log(`Type: ${type} | ID: ${id}`);
    console.log(`Sub Key: ${subKey}`);
    console.log(`Gemini Key: ${transKey ? transKey.substring(0, 5) + '...' : 'MISSING'}`);
    console.log(`Model: ${model}`);

    try {
        // Forward request to upstream submaker server
        const upstreamUrl = `https://submaker.elfhosted.com/${subKey}/${transKey}/${model}/subtitles/${type}/${id}.json`;
        const response = await fetch(upstreamUrl);

        if (!response.ok) {
            console.error(`Upstream error: ${response.status}`);
            return res.json({ subtitles: [] });
        }

        const data = await response.json();
        
        // Ensure subtitles array exists and is properly formatted
        const subtitles = (data.subtitles || []).map((sub, idx) => ({
            id: sub.id || `gemini-ar-${idx}`,
            url: sub.url,
            lang: sub.lang || 'ara',
            label: sub.label || 'Arabic (Gemini AI)'
        }));

        res.json({ subtitles });

    } catch (err) {
        console.error('Subtitle Error:', err.message);
        // Returning empty subtitles list prevents Stremio from throwing a hard error UI
        res.json({ subtitles: [] });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
