const express = require('express');
const cors = require('cors');

const app = express();
// Automatically binds to Render's web port or defaults to 7000 for local testing
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

// Root route to verify the website is live
app.get('/', (req, res) => {
  res.send('Arabic al fusha susbtitle (v1.4 beta) is online and running!');
});

// 1. Stremio Manifest Endpoint
app.get('/:subKey/:transKey/:model/manifest.json', (req, res) => {
  const { model } = req.params;
  console.log(`[Manifest Request] Model: ${model}`);

  res.json({
    id: 'org.arabic.fushasubtitle.beta14',
    version: '1.4 beta',
    name: 'Arabic al fusha susbtitle',
    description: 'Cinematic AI-powered Arabic Fusha subtitles for Stremio',
    logo: 'https://imgur.com/a/IhONi5z',         // Replace with direct image link if needed (.png/.jpg)
    background: 'https://imgur.com/a/W5qVFdb', // Replace with direct image link if needed (.png/.jpg)
    resources: ['subtitles'],
    types: ['movie', 'series'],
    idPrefixes: ['tt']
  });
});

// 2. Stremio Subtitles Endpoint
app.get('/:subKey/:transKey/:model/subtitles/:type/:id.json', (req, res) => {
  const { type, id } = req.params;
  console.log(`[Subtitles Requested] Type: ${type} | ID: ${id}`);

  const host = req.get('host');
  // Dynamically uses HTTPS for cloud websites (Render) and HTTP locally
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const sampleVttUrl = `${protocol}://${host}/vtt/${id}.vtt`;

  res.json({
    subtitles: [
      {
        id: `fusha_ai_${id}`,
        url: sampleVttUrl,
        lang: 'ara' // Mandatory code for the Arabic subtitle variant dropdown menu
      }
    ]
  });
});

// 3. Serve the Test Subtitle VTT File
app.get('/vtt/:id.vtt', (req, res) => {
  const { id } = req.params;
  console.log(`[VTT File Served] ID: ${id}`);

  res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
  res.send(`WEBVTT - Arabic al fusha susbtitle v1.4 beta

1
00:00:01.000 --> 00:00:06.000
أهلاً بك! تعمل إضافة Arabic al fusha susbtitle (v1.4 beta) بنجاح تامة.

2
00:00:06.500 --> 00:00:12.000
النظام متصل عبر الموقع الإلكتروني وتظهر الترجمة ضمن خيارات المتغيرات!
`);
});

app.listen(PORT, () => {
  console.log(`🚀 Arabic al fusha susbtitle server running on port ${PORT}`);
});