const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Stremio Web and desktop apps
app.use(cors());

// 1. Serve index.html without browser caching
app.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Stremio Manifest Route
app.get('/:subKey/:transKey/:model/manifest.json', (req, res) => {
    const { subKey, transKey, model } = req.params;

    console.log(`\n--- Stremio Connected ---`);
    console.log(`Subtitle Key: ${subKey}`);
    console.log(`Translation Key: ${transKey}`);
    console.log(`Selected Model: ${model}\n`);

    res.json({
        id: "com.stremio.arabic.fusha.submaker",
        version: "1.0.0",
        name: "Arabic Fusha Subtitle",
        description: "إضافة Stremio للترجمة السينمائية باللغة العربية الفصحى والذكاء الاصطناعي",
        resources: ["subtitles"],
        types: ["movie", "series"],
        idPrefixes: ["tt"]
    });
});

// 3. Stremio Subtitles Route
app.get('/:subKey/:transKey/:model/subtitles/:type/:id/:extra.json', (req, res) => {
    const { model } = req.params;
    res.json({
        subtitles: [
            {
                id: "arabic_fusha_ai",
                url: `${req.protocol}://${req.get('host')}/subtitle_stream.srt`,
                lang: "ara",
                label: `Arabic Fusha AI (${model})`
            }
        ]
    });
});

// Start server on all local interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running at http://127.0.0.1:${PORT}`);
});