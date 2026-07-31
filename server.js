const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Optional, included for API calls if needed

const app = express();

// ==========================================
// 1. CONFIGURATION & CLOUD PROXY SETUP
// ==========================================
app.set('trust proxy', true);
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Range']
}));
app.use(express.json());

// Load API key from Railway environment variables (secure storage)
const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

// ==========================================
// 2. ROOT & HEALTH CHECK ROUTES
// ==========================================
app.get('/', (req, res) => {
    res.status(200).send({
        status: 'online',
        service: 'Stremio Claude Arabic Translator Addon',
        version: '2.2.0',
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// 3. STREMIO MANIFEST ROUTE
// ==========================================
app.get('/manifest.json', (req, res) => {
    const manifest = {
        id: 'org.stremio.arabicclaudetranslator',
        version: '2.2.0',
        name: 'Arabic Claude Translator Addon',
        description: 'Real-time or cached AI-powered Arabic subtitle translation for Stremio using Claude.',
        resources: ['subtitles'],
        types: ['movie', 'series'],
        idPrefixes: ['tt'],
        catalogs: []
    };
    
    res.setHeader('Cache-Control', 'max-age=86400, public'); // Cache manifest gracefully
    res.json(manifest);
});

// ==========================================
// 4. SUBTITLES ROUTE (CORE LOGIC)
// ==========================================
app.get('/subtitles/:type/:id/:extra?.json', async (req, res) => {
    const { type, id, extra } = req.params;
    
    // Parse extra parameters if Stremio passes season/episode data
    let season = null;
    let episode = null;
    if (extra) {
        // Example parsing if extra contains videoHash or S&E format
        console.log(`[Extra Params] ${extra}`);
    }

    console.log(`[Stremio Request] Incoming Subtitle Query -> Type: ${type}, ID: ${id}`);

    try {
        // ==========================================
        // INSERT YOUR SUBTITLE FETCHING & CLAUDE TRANSLATION LOGIC HERE
        // ==========================================
        // Example structure for what your code needs to return:
        
        const translatedSubtitles = [
            {
                id: `${id}-ar-claude`,
                url: `https://example.com/generated-arabic-subtitles.vtt`, // Or inline text/data if supported
                lang: 'ara',
                subtitlesName: 'Arabic (Claude Fusha)'
            }
        ];

        // If you are calling Claude API directly from the server:
        /*
        if (CLAUDE_API_KEY) {
            // Add your API call to Anthropic here using axios or fetch
        }
        */

        res.json({
            subtitles: translatedSubtitles
        });

    } catch (error) {
        console.error('[Translation Error]:', error.message);
        res.status(500).json({
            subtitles: [],
            error: 'Failed to generate or fetch subtitles.'
        });
    }
});

// ==========================================
// 5. SERVER INITIALIZATION
// ==========================================
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`🚀 Stremio Arabic Translator Server running live on port ${PORT}`);
});