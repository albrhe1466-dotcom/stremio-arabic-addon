const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const srtCache = new Map();

app.get('/:subKey/:transKey/:model/manifest.json', (req, res) => {
    res.json({
        id: 'org.arabicfushasubtitle.gemini.v18',
        version: '1.8.0',
        name: 'Arabic Fusha Subtitle (AI)',
        description: 'Cinematic Arabic Fusha subtitles for Anime, Movies, and Series powered by Google Gemini AI',
        types: ['movie', 'series', 'anime', 'tv', 'other'],
        resources: ['subtitles'],
        catalogs: []
    });
});

app.get('/srt-file/:cacheKey', (req, res) => {
    const cacheKey = req.params.cacheKey;
    let content = srtCache.get(cacheKey);
    
    if (!content) {
        content = `1\n00:00:01,000 --> 00:00:06,000\n⏳ جاري توليد الترجمة الفصحى عبر Gemini AI...\n2\n00:00:07,000 --> 00:00:12,000\nيرجى الانتظار قليلاً ثم إعادة فتح القائمة.`;
    }
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(content);
});

app.get('/:subKey/:transKey/:model/subtitles/:type/:id(*)', async (req, res) => {
    const { subKey, model, type } = req.params;
    let rawId = req.params.id;
    if (rawId.endsWith('.json')) rawId = rawId.slice(0, -5);

    // CRITICAL FIX: Clean the ID by stripping Stremio's appended filenames, query params, and video sizes
    let cleanId = rawId.split('/filename=')[0].split('&')[0].split('?')[0];

    const cacheKey = `${type}-${cleanId.replace(/[/\\?%*:|"<>\s]/g, '_')}`;

    if (!srtCache.has(cacheKey)) {
        srtCache.set(cacheKey, `1\n00:00:01,000 --> 00:00:06,000\n⏳ Gemini is translating... Please wait.\n2\n00:00:07,000 --> 00:00:12,000\nجاري ترجمة الحوارات إلى العربية الفصحى...`);

        (async () => {
            try {
                console.log(`[Gemini AI] Cleaned ID. Original: ${rawId} ---> Cleaned: ${cleanId}`);
                console.log(`[Gemini AI] Starting translation for [${type}] ID: ${cleanId} using model: ${model}...`);
                
                const prompt = `Generate a complete, professional cinematic Arabic Fusha (Standard Arabic) subtitle file in valid SRT format for ${type} (ID: ${cleanId}). 
                CRITICAL RULES:
                1. Output ONLY valid SRT content with proper sequential numbers and timestamps (e.g., 00:00:01,000 --> 00:00:04,000).
                2. Do NOT include markdown code blocks like \`\`\`srt or any introductory/concluding chat text. Only raw SRT lines.
                3. Translate the dialogues accurately into formal Arabic Fusha.`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${subKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });

                const data = await response.json();
                let generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (generatedText) {
                    generatedText = generatedText.replace(/```srt/g, '').replace(/```/g, '').trim();
                    
                    // Validate that the output contains proper SRT timestamps before caching
                    if (generatedText.includes('-->')) {
                        srtCache.set(cacheKey, generatedText);
                        console.log(`[Gemini AI] Successfully generated and cached valid subtitles for ${cleanId}!`);
                    } else {
                        console.error('[Gemini AI] Response missing valid SRT timestamps. Falling back.');
                        srtCache.set(cacheKey, `1\n00:00:01,000 --> 00:00:06,000\n⚠️ خطأ: لم يتم إرجاع تنسيق ترجمة صحيح من النموذج.`);
                    }
                } else {
                    console.error('[Gemini AI] Empty response structure:', JSON.stringify(data));
                }
            } catch (err) {
                console.error('[Gemini AI] Generation error:', err);
                srtCache.set(cacheKey, `1\n00:00:01,000 --> 00:00:06,000\n❌ خطأ في الاتصال بـ Gemini AI.`);
            }
        })();
    }

    const localSrtUrl = `http://127.0.0.1:${PORT}/srt-file/${encodeURIComponent(cacheKey)}`;

    res.json({
        subtitles: [
            {
                id: `${cleanId}-arabic-fusha-ai`,
                url: localSrtUrl,
                lang: 'ara',
                name: 'العربية الفصحى (Gemini AI)'
            }
        ]
    });
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`==================================================`);
    console.log(`🚀 Universal Gemini Server running at: http://127.0.0.1:${PORT}`);
    console.log(`==================================================`);
});
