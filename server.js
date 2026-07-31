const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Unicode BiDi Controls for RTL alignment
const RLE = '\u202B';
const PDF = '\u202C';

// Live Terminal Logger
app.use((req, res, next) => {
    console.log(`\n[${new Date().toLocaleTimeString()}] 📡 ${req.method} ${req.originalUrl}`);
    next();
});

// Serve UI Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Bulletproof Manifest Route (Matches any path ending in manifest.json)
app.get(/manifest\.json$/, (req, res) => {
    const rawUrl = req.originalUrl.toLowerCase();
    let displayName = "Arabic Fusha (EMBEDDED)";
    
    if (rawUrl.includes('lite')) displayName = "Arabic Fusha (LITE)";
    if (rawUrl.includes('flash')) displayName = "Arabic Fusha (FLASH)";

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
        id: "org.arabic.fusha.ai.subtitle",
        version: "2.2.0",
        name: displayName,
        description: "Your Independent AI Arabic Fusha Subtitles.",
        logo: "https://i.imgur.com/h7eKUdF.png",
        types: ["movie", "series", "anime", "other"],
        resources: ["subtitles"]
    });
});

// Bulletproof Subtitle Menu Variant (Matches any path containing subtitles)
app.get(/\/subtitles\/.*/, (req, res) => {
    const host = req.get('host');
    const rawUrl = decodeURIComponent(req.originalUrl);
    
    const match = rawUrl.match(/subtitles\/([^/]+)\/([^/]+)/);
    let rawId = match ? match[2] : 'all';
    const cleanId = rawId.split('/filename=')[0].split('.json')[0].split('&')[0];

    let displayName = "Arabic Fusha (EMBEDDED)";
    if (rawUrl.includes('lite')) displayName = "Arabic Fusha (LITE)";
    if (rawUrl.includes('flash')) displayName = "Arabic Fusha (FLASH)";

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
        subtitles: [{
            id: `my_fusha_${cleanId}`,
            url: `https://${host}/local-srt/${encodeURIComponent(cleanId)}/sub.srt`,
            lang: "ara",
            name: displayName
        }]
    });
});

// Custom SRT Delivery Route
app.get('/local-srt/:id/sub.srt', (req, res) => {
    const mediaId = req.params.id;
    console.log(`  ├─> Delivering cloud subtitles for: ${mediaId}`);

    const myCustomSubtitle = `1
00:00:01,000 --> 00:00:05,000
${RLE}[الترجمة العربية الفصحى]${PDF}
${RLE}تم تفعيل الترجمة بنجاح.${PDF}

2
00:00:06,000 --> 00:00:10,000
${RLE}المشروع لك بالكامل. تم ربطه بخادم خارجي.${PDF}`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(myCustomSubtitle);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Cloud Subtitle Server active on port ${PORT}`);
});
