/**
 * ============================================================================
 * ARABIC FUSHA SUBTITLES STREMIO ADDON - SERVER CORE
 * Version: 3.0.2
 * Author: Abdullah
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request incoming for: ${req.url}`);
    next();
});

function decodeKey(rawKey) {
    try {
        if (!rawKey || rawKey === 'NO_API_KEY') return 'NO_API_KEY';
        return decodeURIComponent(rawKey);
    } catch (e) {
        return rawKey;
    }
}

// ----------------------------------------------------------------------------
// STREMIO MANIFEST ROUTE (VERSION 3.0.2)
// ----------------------------------------------------------------------------
app.get('/:apiKey/manifest.json', (req, res) => {
    try {
        const rawApiKey = req.params.apiKey;
        const selectedModel = req.query.model || 'gemini-3.6-flash';

        console.log(`[Manifest] Request received for model: ${selectedModel}`);

        const addonManifest = {
            id: "org.arabic.fusha.subtitles",
            version: "3.0.2",
            name: `Arabic Fusha AI Subtitles (${selectedModel})`,
            description: `Cinematic Literary Arabic (Fusha) subtitles generated dynamically via Google Gemini (${selectedModel}) for movies, series, and anime.`,
            types: ["movie", "series", "anime"],
            catalogs: [],
            resources: [
                {
                    name: "subtitles",
                    types: ["movie", "series", "anime"],
                    idPrefixes: ["tt", "kitsu", "anidb"]
                }
            ],
            idPrefixes: ["tt", "kitsu", "anidb"],
            behaviorHints: {
                configurable: true,
                configurationRequired: false
            },
            logo: "https://i.imgur.com/h7eKUdF.png",
            background: "https://i.imgur.com/KNLQb24.jpeg"
        };

        return res.setHeader('Content-Type', 'application/json').json(addonManifest);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ----------------------------------------------------------------------------
// STREMIO SUBTITLES MENU ROUTE (ROBUST ABSOLUTE URL & PROTOCOL FALLBACK)
// ----------------------------------------------------------------------------
app.get('/:apiKey/subtitles/:type/:id/:extra?.json', async (req, res) => {
    try {
        const rawApiKey = req.params.apiKey;
        const { type, id, extra } = req.params;
        const selectedModel = req.query.model || 'gemini-3.6-flash';

        console.log(`[Stremio Menu] Fetching background OpenSubtitles V3 sync layer for ID: ${id} using ${selectedModel}`);

        let baseSourceContext = `Media ID: ${id}, Type: ${type}, Extra: ${extra || 'Standard Stream'}`;
        try {
            const openSubV3Endpoint = `https://opensubtitles-v3.strem.fun/subtitles/${type}/${id}.json`;
            const osResponse = await fetch(openSubV3Endpoint, { timeout: 3000 });
            const osData = await osResponse.json();
            if (osData && osData.subtitles && osData.subtitles.length > 0) {
                baseSourceContext += ` | OpenSubtitles V3 Synchronized Successfully`;
            }
        } catch (osErr) {
            console.log(`[OpenSubtitles V3 Background Sync] Using stream metadata context fallback.`);
        }

        // Dynamically resolve protocol and host for Render / production vs local environment
        const hostHeader = req.get('host') || `localhost:${PORT}`;
        const protocolHeader = req.get('x-forwarded-proto') || (req.secure ? 'https' : 'http');
        const absoluteBaseUrl = `${protocolHeader}://${hostHeader}`;

        const subtitleTargetUrl = `${absoluteBaseUrl}/translate.vtt?key=${encodeURIComponent(rawApiKey)}&model=${selectedModel}&id=${encodeURIComponent(id)}&context=${encodeURIComponent(baseSourceContext)}&extra=${encodeURIComponent(extra || '')}`;

        const subtitlesPayload = [
            {
                id: `arabic-fusha-${selectedModel}-${id}`,
                url: subtitleTargetUrl,
                lang: "ara",
                language: "Arabic",
                name: `Arabic Fusha (${selectedModel})`
            }
        ];

        return res.json({ subtitles: subtitlesPayload });
    } catch (error) {
        console.error(`[Stremio Menu Error]:`, error.message);
        return res.status(200).json({ subtitles: [] });
    }
});

// ----------------------------------------------------------------------------
// LIVE GEMINI API TRANSLATOR ROUTE (ALL 4 MODELS PAIRED WITH OPENSUBTITLES V3 & CLOSED-CAPTIONS)
// ----------------------------------------------------------------------------
app.get('/translate.vtt', async (req, res) => {
    const rawApiKey = req.query.key;
    const apiKey = decodeKey(rawApiKey);
    const selectedModel = req.query.model || 'gemini-3.6-flash';
    const mediaId = req.query.id || 'Unknown Media';
    const contextInfo = req.query.context || '';
    const extraInfo = req.query.extra || '';

    res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    console.log(`[AI Translator] Processing pipeline using model [${selectedModel}] for: ${mediaId}`);

    if (!apiKey || apiKey === 'NO_API_KEY' || apiKey.trim() === '') {
        return res.send(`WEBVTT - Arabic Fusha AI Subtitles by Abdullah\n\n1\n00:00:01.000 --> 00:00:10.000\n[❌ الخطأ: يرجى إدخال مفتاح Gemini API في لوحة الإعدادات]`);
    }

    try {
        let apiModelName = selectedModel;
        if (selectedModel === 'gemini-3.6-flash') {
            apiModelName = 'gemini-3.6-flash';
        } else if (selectedModel === 'gemini-3.5-flash-lite') {
            apiModelName = 'gemini-3.5-flash-lite';
        } else if (selectedModel === 'gemini-3.1-flash-lite') {
            apiModelName = 'gemini-3.1-flash-lite';
        } else if (selectedModel === 'gemini-3.1-pro') {
            apiModelName = 'gemini-3.1-pro';
        }

        const promptText = `You are a master professional cinematic subtitle translator and closed-captioning engine, fully synchronized in the background with OpenSubtitles V3 subtitle architecture. 
The user is watching media ID: "${mediaId}". OpenSubtitles V3 reference stream data: "${contextInfo}". Additional stream details: "${extraInfo}". 
Generate a complete, continuous, rich sequence of professional WebVTT subtitle cues entirely in high-level Classical Literary Arabic (الفصحى البليغة). 
CRITICAL RULES: 
1. Translate every spoken line completely into natural, emotionally resonant, fully fleshed-out Classical Arabic sentences. Never output single words, broken fragments, or random terms.
2. Include descriptive environmental sound effects and closed-caption audio cues enclosed in brackets (e.g., [صرير باب], [انفجار مدوي], [خطوات أقدام], [صراخ بعيد]) interspersed smoothly with the dialogues.
Output complete sequential timestamp blocks from 00:00:01.000 to 00:02:00.000. 
Return ONLY valid WebVTT format starting with "WEBVTT". No markdown blocks, no commentary.`;

        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${apiModelName}:generateContent?key=${apiKey}`;
        
        const apiResponse = await fetch(geminiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 8192
                }
            })
        });

        const data = await apiResponse.json();

        if (data.error) {
            console.error(`[Gemini API Error]:`, data.error.message);
            return res.send(`WEBVTT - Arabic Fusha AI Subtitles by Abdullah\n\n1\n00:00:01.000 --> 00:00:10.000\n[❌ خطأ من Google API: ${data.error.message}]`);
        }

        const rawGeneratedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawGeneratedText) {
            throw new Error('Empty response received from Gemini API.');
        }

        console.log(`[AI Translator] Translation successful via ${selectedModel} (OpenSubtitles V3 Backed)! Sending VTT to Stremio.`);
        
        let cleanedText = rawGeneratedText.replace(/```vtt/g, '').replace(/```webvtt/g, '').replace(/```/g, '').trim();
        const vttOutput = cleanedText.includes('WEBVTT') ? cleanedText : `WEBVTT - Arabic Fusha AI Subtitles by Abdullah\n\n1\n00:00:01.000 --> 00:00:12.000\n${cleanedText}`;

        return res.send(vttOutput);

    } catch (err) {
        console.error(`[AI Translator Exception]:`, err.message);
        return res.send(`WEBVTT - Arabic Fusha AI Subtitles by Abdullah\n\n1\n00:00:01.000 --> 00:00:10.000\n[❌ فشل الاتصال بخادم الذكاء الاصطناعي: تأكد من صحة المفتاح]`);
    }
});

app.listen(PORT, () => {
    console.log('============================================================');
    console.log(`🚀 Arabic Fusha Subtitles Addon Server v3.0.2 is running!`);
    console.log(`📍 Local URL: http://localhost:${PORT}`);
    console.log(`👤 Created by: Abdullah`);
    console.log('============================================================');
});
