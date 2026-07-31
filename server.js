const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Unicode BiDi Controls for RTL Arabic alignment
const RLE = '\u202B';
const PDF = '\u202C';

// Live Terminal Logger for Railway Dashboard
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] 📡 ${req.method} ${req.originalUrl}`);
    next();
});

// Serve your website UI at the root domain
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Helper function to build manifests with unique IDs and idPrefixes
const getManifest = (variant) => {
    let id = "org.arabic.fusha.ai.subtitle.embedded";
    let name = "Arabic Fusha (EMBEDDED)";
    
    if (variant === 'lite') {
        id = "org.arabic.fusha.ai.subtitle.lite";
        name = "Arabic Fusha (LITE)";
    } else if (variant === 'flash') {
        id = "org.arabic.fusha.ai.subtitle.flash";
        name = "Arabic Fusha (FLASH)";
    }

    return {
        id: id,
        version: "2.4.0",
        name: name,
        description: "Your Independent AI Arabic Fusha Subtitles Addon.",
        logo: "https://i.imgur.com/h7eKUdF.png",
        types: ["movie", "series", "anime", "other"],
        idPrefixes: ["tt"], // Critical: Tells Stremio to fetch subs for standard media IDs
        resources: ["subtitles"]
    };
};

// Explicit Manifest Endpoints (No Regex bugs)
app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(getManifest('embedded'));
});

app.get('/lite/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(getManifest('lite'));
});

app.get('/flash/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(getManifest('flash'));
});

// Subtitle Endpoints for all variants
app.get(['/subtitles/:type/:id/:extra.json', '/subtitles/:type/:id.json'], (req, res) => {
    handleSubtitles(req, res, 'embedded');
});
app.get(['/lite/subtitles/:type/:id/:extra.json', '/lite/subtitles/:type/:id.json'], (req, res) => {
    handleSubtitles(req, res, 'lite');
});
app.get(['/flash/subtitles/:type/:id/:extra.json', '/flash/subtitles/:type/:id.json'], (req, res) => {
    handleSubtitles(req, res, 'flash');
});

function handleSubtitles(req, res, variant) {
    const host = req.get('host');
    const mediaId = req.params.id;
    
    let subName = "Arabic Fusha (EMBEDDED)";
    let routePrefix = "";
    if (variant === 'lite') {
        subName = "Arabic Fusha (LITE)";
        routePrefix = "lite/";
    } else if (variant === 'flash') {
        subName = "Arabic Fusha (FLASH)";
        routePrefix = "flash/";
    }

    console.log(`  -> Subtitles requested for media ID: ${mediaId} [Variant: ${variant}]`);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
        subtitles: [{
            id: `fusha_${variant}_${mediaId}`,
            url: `https://${host}/${routePrefix}local-srt/${encodeURIComponent(mediaId)}/sub.srt`,
            lang: "ara",
            name: subName
        }]
    });
}

// SRT File Delivery Endpoints
app.get('/local-srt/:id/sub.srt', (req, res) => { deliverSrt(req, res); });
app.get('/lite/local-srt/:id/sub.srt', (req, res) => { deliverSrt(req, res); });
app.get('/flash/local-srt/:id/sub.srt', (req, res) => { deliverSrt(req, res); });

function deliverSrt(req, res) {
    const mediaId = req.params.id;
    console.log(`    -> Delivering .srt file for ID: ${mediaId}`);

    const subtitleContent = `1
00:00:01,000 --> 00:00:06,000
${RLE}[الترجمة العربية الفصحى - نشط]${PDF}
${RLE}تم ربط الخادم السحابي بنجاح.${PDF}

2
00:00:07,000 --> 00:00:12,000
${RLE}استمتع بالمشاهدة الآن.${PDF}`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(subtitleContent);
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Cloud Subtitle Server active on port ${PORT}`);
});
