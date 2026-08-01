<!DOCTYPE html>
<html lang="ar" dir="rtl" id="htmlRoot">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title id="pageTitle">Arabic Fusha Subtitles</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #03050a;
    --panel: rgba(10, 15, 28, 0.88);
    --border: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(66, 133, 244, 0.5);
    --g-blue: #4285F4;
    --g-red: #EA4335;
    --g-yellow: #FBBC05;
    --g-green: #34A853;
    --text: #f8fafc;
    --muted: #94a3b8;
    --dim: #64748b;
    --radius: 18px;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; width: 100vw; min-height: 100vh;
    background: var(--bg); color: var(--text);
    font-family: 'Cairo', sans-serif;
    overflow-x: hidden;
  }
  .top-lang-switcher {
    position: absolute; top: 25px; right: 25px; display: flex; gap: 12px; z-index: 100;
  }
  html[dir="ltr"] .top-lang-switcher { right: auto; left: 25px; }
  .top-lang-btn {
    width: 48px; height: 48px; border-radius: 12px; background: rgba(10, 15, 28, 0.65);
    border: 1px solid var(--border); font-size: 26px; display: flex; align-items: center;
    justify-content: center; cursor: pointer; backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); user-select: none;
  }
  .top-lang-btn:hover {
    transform: translateY(-4px) scale(1.08); border-color: var(--border-hover);
    box-shadow: 0 8px 20px rgba(0,0,0,0.4);
  }
  .top-lang-btn.active {
    border-color: var(--g-blue); background: rgba(66, 133, 244, 0.15);
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.25), 0 8px 20px rgba(0,0,0,0.5);
    transform: scale(1.1);
  }
  
  /* Floating Report Button at Bottom Left */
  .report-float-btn {
    position: fixed; bottom: 90px; left: 25px; z-index: 1000;
    width: 52px; height: 52px; border-radius: 16px; background: rgba(15, 23, 42, 0.9);
    border: 1px solid rgba(234, 67, 53, 0.4); font-size: 26px; display: flex; align-items: center;
    justify-content: center; cursor: pointer; backdrop-filter: blur(15px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  html[dir="ltr"] .report-float-btn { left: 25px; right: auto; }
  .report-float-btn:hover {
    transform: translateY(-4px) scale(1.1); border-color: var(--g-red);
    box-shadow: 0 0 20px rgba(234, 67, 53, 0.4), 0 10px 30px rgba(0,0,0,0.6);
  }

  /* Report Modal Overlay */
  .report-modal-overlay {
    position: fixed; inset: 0; background: rgba(3, 5, 10, 0.8); backdrop-filter: blur(10px);
    z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px;
    opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
  }
  .report-modal-overlay.open { opacity: 1; pointer-events: auto; }
  .report-modal-box {
    background: #0a0f1c; border: 1px solid rgba(234, 67, 53, 0.3); border-radius: 20px;
    width: 100%; max-width: 480px; padding: 28px; box-shadow: 0 25px 60px rgba(0,0,0,0.9);
    transform: translateY(20px); transition: transform 0.3s ease; position: relative;
  }
  .report-modal-overlay.open .report-modal-box { transform: translateY(0); }
  .report-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .report-modal-header h3 { margin: 0; font-size: 18px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 10px; }
  .report-close-btn { background: none; border: none; font-size: 20px; color: var(--muted); cursor: pointer; transition: color 0.2s; }
  .report-close-btn:hover { color: var(--g-red); }
  .report-modal-box textarea {
    width: 100%; height: 130px; background: #020306; color: var(--text);
    border: 1px solid var(--border); border-radius: 12px; padding: 14px;
    font-family: 'Cairo', sans-serif; font-size: 13.5px; resize: none; margin-top: 6px;
    transition: border-color .2s, box-shadow .2s;
  }
  .report-modal-box textarea:focus { outline: none; border-color: var(--g-red); box-shadow: 0 0 0 3px rgba(234, 67, 53, 0.2); }
  .report-submit-btn {
    width: 100%; margin-top: 16px; background: linear-gradient(135deg, var(--g-red), #dc2626);
    color: white; border: none; border-radius: 12px; padding: 14px; font-weight: 700;
    font-size: 14px; cursor: pointer; font-family: 'Cairo', sans-serif;
    box-shadow: 0 10px 25px -8px rgba(234, 67, 53, 0.6); transition: transform 0.2s, box-shadow 0.2s;
  }
  .report-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -8px rgba(234, 67, 53, 0.8); }

  /* Background AI Floating Logos */
  .ai-bg-container {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: 0; overflow: hidden; pointer-events: none;
  }
  .floating-ai {
    position: absolute; display: flex; align-items: center; justify-content: center;
    opacity: 0; animation: moveAcrossFull 18s linear infinite;
  }
  .floating-ai img {
    height: 38px;
    max-width: 160px;
    object-fit: contain;
    filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.15));
  }
  @keyframes moveAcrossFull {
    0% { transform: translate(calc(100vw + 250px), var(--start-y)); opacity: 0; }
    15% { opacity: 0.35; }
    85% { opacity: 0.35; }
    100% { transform: translate(-250px, var(--end-y)); opacity: 0; }
  }
  .shooting-star-container {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: 0; overflow: hidden; pointer-events: none;
  }
  .shooting-star {
    position: absolute; top: 20%; right: -100px; width: 150px; height: 2px;
    background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,1));
    filter: drop-shadow(0 0 8px rgba(255,255,255,0.8));
    animation: shooting 4s ease-in-out infinite;
  }
  @keyframes shooting {
    0% { transform: translateX(200px) translateY(-200px) rotate(-35deg); opacity: 0; }
    10% { opacity: 1; }
    40% { transform: translateX(-1200px) translateY(800px) rotate(-35deg); opacity: 0; }
    100% { opacity: 0; }
  }
  .scanlines {
    position: fixed; inset: 0; z-index: 1; pointer-events: none;
    background: repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px);
  }
  header, main, footer { position: relative; z-index: 2; }
  header { text-align: center; padding: 70px 20px 20px; }
  .brand-logo {
    width: 76px; height: 76px; background: linear-gradient(135deg, var(--g-blue), var(--g-red));
    border-radius: 22px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;
    font-size: 32px; font-weight: 900; color: white; box-shadow: 0 12px 35px rgba(66, 133, 244, 0.45);
    border: 2px solid rgba(255,255,255,0.25);
  }
  h1 {
    font-size: clamp(26px, 4vw, 36px); margin: 0 0 8px; font-weight: 900;
    background: linear-gradient(90deg, var(--g-blue), var(--g-red), var(--g-yellow), var(--g-green));
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  p.sub { color: var(--muted); font-size: 14px; margin: 0; }
  main {
    max-width: 840px; margin: 0 auto; padding: 10px 20px 70px;
    display: flex; flex-direction: column; gap: 18px;
  }
  .card {
    background: var(--panel); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden; backdrop-filter: blur(25px);
    box-shadow: 0 25px 50px -15px rgba(0,0,0,0.85); transition: border-color .25s ease;
  }
  .card:hover { border-color: var(--border-hover); }
  .card-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 26px; cursor: pointer; user-select: none; background: rgba(255,255,255,0.015);
  }
  .card-head-right { display: flex; align-items: center; gap: 14px; }
  .card-icon {
    width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: bold;
  }
  .icon-blue { background: rgba(66, 133, 244, 0.15); color: var(--g-blue); border: 1px solid rgba(66, 133, 244, 0.3); }
  .icon-red { background: rgba(234, 67, 53, 0.15); color: var(--g-red); border: 1px solid rgba(234, 67, 53, 0.3); }
  .icon-yellow { background: rgba(251, 188, 5, 0.15); color: var(--g-yellow); border: 1px solid rgba(251, 188, 5, 0.3); }
  .icon-green { background: rgba(52, 168, 83, 0.15); color: var(--g-green); border: 1px solid rgba(52, 168, 83, 0.3); }
  .card-head h2 { font-size: 15px; letter-spacing: 0.3px; color: var(--text); margin: 0; font-weight: 700; }
  .card-toggle { font-size: 14px; color: var(--muted); transition: transform 0.3s ease; }
  .card.open .card-toggle { transform: rotate(180deg); color: var(--g-blue); }
  .card-body {
    padding: 0 26px 26px; display: none; border-top: 1px solid var(--border); background: rgba(0,0,0,0.3);
  }
  .card.open .card-body { display: block; padding-top: 22px; }
  .api-sub-card {
    background: rgba(6, 10, 18, 0.75); border: 1px solid var(--border);
    border-radius: 14px; margin-bottom: 16px; overflow: hidden;
  }
  .api-sub-head {
    padding: 16px 20px; display: flex; align-items: center; justify-content: space-between;
    cursor: pointer; font-weight: 700; font-size: 13.5px; color: var(--text);
  }
  .api-sub-body { padding: 0 20px 20px; display: none; border-top: 1px solid var(--border); }
  .api-sub-card.open .api-sub-body { display: block; padding-top: 18px; }
  .api-sub-card.open .api-sub-head { color: var(--g-blue); background: rgba(66, 133, 244, 0.06); }
  label { display: block; font-size: 12px; color: var(--g-blue); margin: 0 0 6px; font-weight: 700; }
  .input-wrapper { position: relative; display: flex; align-items: center; }
  input[type=password], input[type=text].api-input, input[type=email].api-input {
    width: 100%; background: #020306; color: var(--text);
    border: 1px solid var(--border); border-radius: 12px;
    padding: 13px 16px 13px 45px; font-family: 'JetBrains Mono', monospace; font-size: 13.5px;
    transition: border-color .2s ease, box-shadow .2s ease;
  }
  html[dir="rtl"] input[type=password], html[dir="rtl"] input[type=text].api-input, html[dir="rtl"] input[type=email].api-input {
    padding: 13px 45px 13px 16px;
  }
  input[type=password]:focus, input[type=text].api-input:focus, input[type=email].api-input:focus {
    outline: none; border-color: var(--g-blue); box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.25);
  }
  .eye-btn {
    position: absolute; left: 14px; background: transparent; border: none; cursor: pointer;
    font-size: 18px; color: var(--muted); transition: color 0.2s; padding: 0;
    display: flex; align-items: center; justify-content: center;
  }
  html[dir="rtl"] .eye-btn { left: auto; right: 14px; }
  .eye-btn:hover { color: var(--text); }
  .field { margin-bottom: 16px; }
  .hint { font-size: 11.5px; color: var(--dim); margin-top: 6px; line-height: 1.5; }
  .api-status { font-size: 12.5px; margin-top: 10px; font-weight: 700; font-family: 'Cairo', sans-serif; transition: color 0.2s ease; }
  
  .model-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-top: 12px;
  }
  @media(max-width: 600px) { .model-grid { grid-template-columns: 1fr; } }
  
  .model-card {
    border: 1px solid var(--border); border-radius: 14px; padding: 18px;
    cursor: pointer; background: #020306; transition: all .2s ease; position: relative;
    display: flex; flex-direction: column; justify-content: space-between; min-height: 75px;
  }
  .model-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
  .model-card.active {
    border-color: var(--g-blue); box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.25); background: rgba(66, 133, 244, 0.08);
  }
  .model-name { font-size: 14px; font-weight: 800; color: var(--text); margin-bottom: 4px; }
  .model-id { font-size: 10.5px; color: var(--dim); font-family: monospace; }

  .lang-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
  @media(max-width: 600px) { .lang-grid { grid-template-columns: 1fr; } }
  .lang-card {
    border: 1px solid var(--border); border-radius: 14px; padding: 18px;
    background: #020306; display: flex; align-items: center; justify-content: space-between;
    cursor: pointer; transition: all 0.2s ease; user-select: none;
  }
  .lang-card:hover { border-color: var(--border-hover); }
  .lang-card.active { border-color: var(--g-green); background: rgba(52, 168, 83, 0.08); box-shadow: 0 0 0 2px rgba(52, 168, 83, 0.2); }
  .lang-card.deselected { opacity: 0.45; border-style: dashed; background: rgba(255,255,255,0.01); }
  .lang-card.disabled { opacity: 0.35; cursor: not-allowed; border-style: dashed; }
  .lang-info h3 { font-size: 14px; margin: 0 0 3px; font-weight: 700; color: var(--text); }
  .lang-info p { font-size: 11.5px; margin: 0; color: var(--muted); }
  .lang-status { font-size: 11.5px; font-weight: bold; padding: 5px 12px; border-radius: 20px; }
  .status-selected { background: rgba(52, 168, 83, 0.2); color: var(--g-green); }
  .status-deselected { background: rgba(234, 67, 53, 0.15); color: var(--g-red); }
  .status-progress { background: rgba(251, 188, 5, 0.2); color: var(--g-yellow); }
  .actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  @media(max-width: 700px) { .actions-grid { grid-template-columns: 1fr; } }
  .action-btn {
    border: 1px solid var(--border); border-radius: 14px; padding: 18px;
    text-align: center; cursor: pointer; font-weight: 700; font-size: 13.5px;
    font-family: 'Cairo', sans-serif; transition: all .2s ease;
    text-decoration: none; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-save { background: rgba(66, 133, 244, 0.12); color: var(--g-blue); border-color: rgba(66, 133, 244, 0.35); }
  .btn-save:hover { background: rgba(66, 133, 244, 0.22); }
  .btn-install { background: linear-gradient(135deg, var(--g-green), #059669); color: white; border: none; box-shadow: 0 10px 25px -10px rgba(52,168,83,0.6); }
  .btn-install:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -10px rgba(52,168,83,0.8); }
  .btn-copy { background: rgba(255,255,255,0.03); color: var(--text); }
  .btn-copy:hover { background: rgba(255,255,255,0.08); border-color: var(--border-hover); }
  .whats-new-list { margin: 0; padding-inline-start: 20px; font-size: 13px; color: var(--muted); line-height: 1.8; }
  .whats-new-list li strong { color: var(--text); }
  
  footer { text-align: center; padding: 30px; color: var(--dim); font-size: 11.5px; }

  #toast {
    position: fixed; bottom: 25px; z-index: 9999;
    background: rgba(10, 15, 28, 0.95);
    border: 1px solid var(--g-green); color: white; padding: 14px 24px;
    border-radius: 12px; font-weight: bold; font-size: 14px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6); transform: translateY(150px); opacity: 0;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex; align-items: center; gap: 10px;
  }
  html[dir="rtl"] #toast { left: 25px; right: auto; }
  html[dir="ltr"] #toast { right: 25px; left: auto; }
  #toast.show { transform: translateY(0); opacity: 1; }
</style>
</head>
<body>

<div class="shooting-star-container"><div class="shooting-star"></div></div>
<div class="ai-bg-container" id="aiBgContainer"></div>
<div class="scanlines"></div>

<div class="report-float-btn" onclick="openReportModal()" title="Report Bug">🐛</div>

<div class="report-modal-overlay" id="reportModalOverlay">
  <div class="report-modal-box">
    <div class="report-modal-header">
      <h3 id="reportModalTitle">🐛 الإبلاغ عن مشكلة / خطأ</h3>
      <button class="report-close-btn" onclick="closeReportModal()">✕</button>
    </div>
    <div class="field">
      <label for="reporterEmailInput" id="labelReporterEmail">بريدك الإلكتروني (Your Email):</label>
      <input type="email" id="reporterEmailInput" class="api-input" placeholder="name@example.com">
    </div>
    <div class="field">
      <label for="reportIssueText" id="labelReportIssue">تفاصيل المشكلة (Issue Description):</label>
      <textarea id="reportIssueText" placeholder="اكتب تفاصيل المشكلة هنا..."></textarea>
    </div>
    <button type="button" class="report-submit-btn" id="reportSubmitBtn" onclick="submitBugReport()">إرسال التقرير</button>
  </div>
</div>

<div id="toast"><span></span></div>

<div class="top-lang-switcher">
  <div class="top-lang-btn active" onclick="switchUILang('ar', this)" title="Arabic">🇸🇦</div>
  <div class="top-lang-btn" onclick="switchUILang('en', this)" title="English">🇺🇸</div>
</div>

<header>
  <div class="brand-logo">S</div>
  <h1 id="mainTitle">Arabic Fusha Subtitles</h1>
  <p class="sub" id="mainSub">إضافة Stremio للترجمة السينمائية بالفصحى للأنمي، المسلسلات والأفلام</p>
</header>

<main>
  <div class="card open" id="cardWhatsNew">
    <div class="card-head" onclick="toggleCard('cardWhatsNew')">
      <div class="card-head-right">
        <div class="card-icon icon-yellow">✨</div>
        <h2 id="txtWhatsNew">ما الجديد · What's New</h2>
      </div>
      <div class="card-toggle">▼</div>
    </div>
    <div class="card-body">
      <ul class="whats-new-list" id="whatsNewContent">
        <li><strong>التوافق العالمي الشامل:</strong> دعم الأنمي، المسلسلات، والأفلام بجميع معرفات Stremio (IMDb, Kitsu, AniDB).</li>
        <li><strong>التحويل المحلي النظيف:</strong> معالجة ذكية وسريعة عبر الخادم المحلي لمنع عرض الرموز الغريبة.</li>
        <li><strong>عائلة نماذج Gemini 3.x النشطة:</strong> 3.1 Pro, 3.6 Flash, 3.5 Flash-Lite, و 3.1 Flash-Lite.</li>
      </ul>
    </div>
  </div>

  <div class="card open" id="cardApiKeys">
    <div class="card-head" onclick="toggleCard('cardApiKeys')">
      <div class="card-head-right">
        <div class="card-icon icon-blue">🔑</div>
        <h2 id="txtApiConfig">مفاتيح API · API Keys Configuration</h2>
      </div>
      <div class="card-toggle">▼</div>
    </div>
    <div class="card-body">
      <div class="api-sub-card open" id="subKeyCard">
        <div class="api-sub-head" onclick="toggleSubCard('subKeyCard')">
          <span id="txtSubApiKeyTitle">مفتاح API للترجمة (Subtitle API Key)</span>
          <span>▼</span>
        </div>
        <div class="api-sub-body">
          <div class="field">
            <label for="subApiKeyInput">GEMINI API KEY (SUBTITLES) <span style="color: var(--g-red);">*</span></label>
            <div class="input-wrapper">
              <input type="password" id="subApiKeyInput" class="api-input" placeholder="أدخل مفتاح Google Gemini هنا (مطلوب)">
              <button type="button" class="eye-btn" onclick="togglePasswordVisibility('subApiKeyInput', this)">👁️</button>
            </div>
            
            <div id="subApiStatus" class="api-status"></div>
            
            <div class="hint" id="txtSubKeyHint">مفتاح Google الخاص بتوليد ملفات الترجمة (مطلوب لعمل الإضافة بشكل صحيح).</div>
          </div>
          <label id="txtSelectModel">اختر نموذج الذكاء الاصطناعي:</label>
          
          <div class="model-grid">
            <div class="model-card active" data-model="gemini-3.6-flash" onclick="selectModel('gemini-3.6-flash', this)">
              <div class="model-name">Gemini 3.6 Flash</div>
              <div class="model-id">gemini-3.6-flash</div>
            </div>
            <div class="model-card" data-model="gemini-3.5-flash-lite" onclick="selectModel('gemini-3.5-flash-lite', this)">
              <div class="model-name">Gemini 3.5 Flash-Lite</div>
              <div class="model-id">gemini-3.5-flash-lite</div>
            </div>
            <div class="model-card" data-model="gemini-3.1-flash-lite" onclick="selectModel('gemini-3.1-flash-lite', this)">
              <div class="model-name">Gemini 3.1 Flash-Lite</div>
              <div class="model-id">gemini-3.1-flash-lite</div>
            </div>
            <div class="model-card" data-model="gemini-3.1-pro" onclick="selectModel('gemini-3.1-pro', this)">
              <div class="model-name">Gemini 3.1 Pro</div>
              <div class="model-id">gemini-3.1-pro</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card open" id="cardLang">
    <div class="card-head" onclick="toggleCard('cardLang')">
      <div class="card-head-right">
        <div class="card-icon icon-red">🌐</div>
        <h2 id="txtLanguages">اللغات المدعومة · Languages</h2>
      </div>
      <div class="card-toggle">▼</div>
    </div>
    <div class="card-body">
      <div class="lang-grid">
        <div class="lang-card active" id="arabicLangCard" onclick="toggleArabicSelection()">
          <div class="lang-info">
            <h3 id="txtArabicName">العربية الفصحى (Arabic)</h3>
            <p id="arabicLangDesc">مفعلة وجاهزة لتوليد الترجمة السينمائية</p>
          </div>
          <div class="lang-status status-selected" id="arabicLangStatus">محدد (Selected)</div>
        </div>
        <div class="lang-card disabled">
          <div class="lang-info">
            <h3 id="txtEnglishName">الإنجليزية (English)</h3>
            <p id="txtEnglishDesc">قيد التطوير والاختبار حالياً</p>
          </div>
          <div class="lang-status status-progress" id="txtSoon">قريباً</div>
        </div>
      </div>
    </div>
  </div>

  <div class="card open" id="cardActions">
    <div class="card-head" onclick="toggleCard('cardActions')">
      <div class="card-head-right">
        <div class="card-icon icon-green">🚀</div>
        <h2 id="txtInstallConfig">إجراءات التثبيت · Installation & Config</h2>
      </div>
      <div class="card-toggle">▼</div>
    </div>
    <div class="card-body">
      <div class="actions-grid">
        <div class="action-btn btn-save" onclick="saveConfig()">
          <span>💾</span>
          <span id="txtSaveBtn">حفظ الإعدادات</span>
        </div>
        <a href="#" id="installBtn" class="action-btn btn-install" onclick="return handleInstallClick(event)">
          <span>⚡</span>
          <span id="txtInstallBtn">تثبيت في Stremio</span>
        </a>
        <div class="action-btn btn-copy" onclick="copyManifestUrl()">
          <span>📋</span>
          <span id="txtCopyBtn">نسخ رابط التثبيت</span>
        </div>
      </div>
      <div class="hint" id="actionStatus" style="text-align: center; margin-top: 14px; color: var(--g-green); min-height: 20px;"></div>
    </div>
  </div>
</main>

<footer>Arabic Fusha Subtitles // Made by Abdullah</footer>

<script>
const AI_LOGOS = [
  'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/anthropic-text.png',
  'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/openai-text.png',
  'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/xai.png',
  'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/gemini-color.png'
];

function initAiBackgroundLogos() {
  const container = document.getElementById('aiBgContainer');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'floating-ai';
    el.style.setProperty('--start-y', `${Math.random() * 85 + 5}vh`);
    el.style.setProperty('--end-y', `${Math.random() * 85 + 5}vh`);
    el.style.animationDuration = `${14 + Math.random() * 10}s`;
    el.style.animationDelay = `${Math.random() * -20}s`;
    const img = document.createElement('img');
    img.src = AI_LOGOS[i % AI_LOGOS.length];
    el.appendChild(img);
    container.appendChild(el);
  }
}

const translations = {
  ar: {
    dir: 'rtl',
    mainSub: 'إضافة Stremio للترجمة السينمائية بالفصحى للأنمي، المسلسلات والأفلام',
    txtWhatsNew: "ما الجديد · What's New",
    whatsNewList: `
      <li><strong>التوافق العالمي الشامل:</strong> دعم الأنمي، المسلسلات، والأفلام بجميع معرفات Stremio (IMDb, Kitsu, AniDB).</li>
      <li><strong>التحويل المحلي النظيف:</strong> معالجة ذكية وسريعة عبر الخادم المحلي لمنع عرض الرموز الغريبة.</li>
      <li><strong>عائلة نماذج Gemini 3.x النشطة:</strong> 3.1 Pro, 3.6 Flash, 3.5 Flash-Lite, و 3.1 Flash-Lite.</li>
    `,
    txtApiConfig: 'مفاتيح API · API Keys Configuration',
    txtSubApiKeyTitle: 'مفتاح API للترجمة (Subtitle API Key)',
    txtSubKeyHint: 'مفتاح Google الخاص بتوليد ملفات الترجمة (مطلوب لعمل الإضافة بشكل صحيح).',
    txtSelectModel: 'اختر نموذج الذكاء الاصطناعي:',
    txtLanguages: 'اللغات المدعومة · Languages',
    txtArabicName: 'العربية الفصحى (Arabic)',
    arabicLangDescActive: 'مفعلة وجاهزة لتوليد الترجمة السينمائية',
    arabicLangDescDeselected: 'موقف مؤقتاً لن يتم إرسال ترجمة عربية لـ Stremio',
    arabicStatusSelected: 'محدد (Selected)',
    arabicStatusDeselected: 'غير محدد (Deselected)',
    txtEnglishName: 'الإنجليزية (English)',
    txtEnglishDesc: 'قيد التطوير والاختبار حالياً',
    txtSoon: 'قريباً',
    txtInstallConfig: 'إجراءات التثبيت · Installation & Config',
    txtSaveBtn: 'حفظ الإعدادات',
    txtInstallBtn: 'تثبيت في Stremio',
    txtCopyBtn: 'نسخ رابط التثبيت',
    statusRed: '❌ أحمر: لا يعمل (مفتاح API فارغ)',
    statusGreen: '✅ أخضر: صالح (تم التعرف على AIza / AQ / alza)',
    statusYellow: '🟨 أصفر: هناك شيء خاطئ تماماً ولكن ربما سيعمل',
    toastSave: '✓ تم حفظ الإعدادات بنجاح في متصفحك!',
    toastCopy: '✓ تم نسخ رابط التثبيت إلى الحافظة!',
    toastArabic: '✅ تم اختيار الواجهة العربية',
    toastModelSelect: '✅ تم اختيار النموذج: ',
    toastArabicSelected: '✅ تم تفعيل اللغة العربية',
    toastArabicDeselected: '❌ تم تعطيل اللغة العربية',
    langError: '❌ يجب عليك اختيار لغة واحدة على الأقل للاستمرار!'
  },
  en: {
    dir: 'ltr',
    mainSub: 'Stremio Addon for Fusha Arabic Cinematic Subtitles for Anime, Series, and Movies',
    whatsNewList: `
      <li><strong>Universal Compatibility:</strong> Full support for anime, series, and movies across all Stremio IDs (IMDb, Kitsu, AniDB).</li>
      <li><strong>Clean Local Processing:</strong> Smart and fast local handling to prevent corrupted characters.</li>
      <li><strong>Active Gemini 3.x Family:</strong> 3.1 Pro, 3.6 Flash, 3.5 Flash-Lite, and 3.1 Flash-Lite.</li>
    `,
    txtApiConfig: 'API Keys Configuration',
    txtSubApiKeyTitle: 'Subtitle API Key',
    txtSubKeyHint: 'Google Gemini key used to generate subtitle scripts (Required for the addon to function).',
    txtSelectModel: 'Select AI Model:',
    txtLanguages: 'Supported Languages',
    txtArabicName: 'Literary Arabic (Fusha)',
    arabicLangDescActive: 'Enabled and ready for cinematic subtitle generation',
    arabicLangDescDeselected: 'Temporarily disabled, no Arabic subtitles will be sent to Stremio',
    arabicStatusSelected: 'Selected',
    arabicStatusDeselected: 'Deselected',
    txtEnglishName: 'English',
    txtEnglishDesc: 'Currently under development and testing',
    txtSoon: 'Coming Soon',
    txtInstallConfig: 'Installation & Config',
    txtSaveBtn: 'Save Settings',
    txtInstallBtn: 'Install in Stremio',
    txtCopyBtn: 'Copy Manifest URL',
    statusRed: '❌ Red: Does not work (Empty API Key)',
    statusGreen: '✅ Green: Good (AIza / AQ / alza detected)',
    statusYellow: '🟨 Yellow: Something is quite wrong but maybe it will work',
    toastSave: '✓ Settings successfully saved to browser storage!',
    toastCopy: '✓ Manifest URL copied to clipboard!',
    toastArabic: '✅ English interface activated',
    toastModelSelect: '✅ Selected model: ',
    toastArabicSelected: '✅ Arabic language enabled',
    toastArabicDeselected: '❌ Arabic language disabled',
    langError: '❌ You must select at least one language to continue!'
  }
};

function getBaseUrl() {
  const origin = window.location.origin;
  if (!origin || origin === 'null' || origin.startsWith('file://')) {
    return 'http://localhost:3000';
  }
  return origin;
}

let toastTimeout;
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.querySelector('span').textContent = message;
  
  if (isError) {
    toast.style.borderColor = 'var(--g-red)';
    toast.style.color = '#fca5a5';
  } else {
    toast.style.borderColor = 'var(--g-green)';
    toast.style.color = 'white';
  }
  
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

function switchUILang(lang, btnElement) {
  document.querySelectorAll('.top-lang-btn').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');
  const t = translations[lang];
  document.getElementById('htmlRoot').setAttribute('dir', t.dir);
  document.getElementById('htmlRoot').setAttribute('lang', lang);
  
  document.getElementById('mainSub').textContent = t.mainSub;
  document.getElementById('txtWhatsNew').textContent = t.txtWhatsNew;
  document.getElementById('whatsNewContent').innerHTML = t.whatsNewList;
  document.getElementById('txtApiConfig').textContent = t.txtApiConfig;
  document.getElementById('txtSubApiKeyTitle').textContent = t.txtSubApiKeyTitle;
  document.getElementById('txtSubKeyHint').textContent = t.txtSubKeyHint;
  document.getElementById('txtSelectModel').textContent = t.txtSelectModel;
  document.getElementById('txtLanguages').textContent = t.txtLanguages;
  document.getElementById('txtArabicName').textContent = t.txtArabicName;
  document.getElementById('txtEnglishName').textContent = t.txtEnglishName;
  document.getElementById('txtEnglishDesc').textContent = t.txtEnglishDesc;
  document.getElementById('txtSoon').textContent = t.txtSoon;
  document.getElementById('txtInstallConfig').textContent = t.txtInstallConfig;
  document.getElementById('txtSaveBtn').textContent = t.txtSaveBtn;
  document.getElementById('txtInstallBtn').textContent = t.txtInstallBtn;
  document.getElementById('txtCopyBtn').textContent = t.txtCopyBtn;
  
  checkApiStatus();
  updateArabicLangUI();
  showToast(t.toastArabic);
  localStorage.setItem('ui_lang', lang);
}

function openReportModal() { document.getElementById('reportModalOverlay').classList.add('open'); }
function closeReportModal() { document.getElementById('reportModalOverlay').classList.remove('open'); }

async function submitBugReport() {
  const issueText = document.getElementById('reportIssueText').value.trim();
  const currentLang = document.getElementById('htmlRoot').getAttribute('lang') || 'ar';
  
  if (!issueText) {
    alert(currentLang === 'en' ? 'Please write your issue description.' : 'الرجاء كتابة تفاصيل المشكلة أولاً.');
    return;
  }
  showToast(currentLang === 'en' ? '✓ Report sent successfully!' : '✓ تم إرسال التقرير بنجاح!');
  document.getElementById('reportIssueText').value = '';
  closeReportModal();
}

function toggleCard(cardId) { document.getElementById(cardId).classList.toggle('open'); }
function toggleSubCard(subId) { document.getElementById(subId).classList.toggle('open'); }
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁️'; }
}

let selectedSubModel = 'gemini-3.6-flash';
let isArabicSelected = true;

function toggleArabicSelection() {
  isArabicSelected = !isArabicSelected;
  const currentLang = document.getElementById('htmlRoot').getAttribute('lang') || 'ar';
  const t = translations[currentLang];
  
  updateArabicLangUI();
  
  if (isArabicSelected) {
    showToast(t.toastArabicSelected);
  } else {
    showToast(t.toastArabicDeselected, true);
  }
  updateManifestUrl();
}

function updateArabicLangUI() {
  const card = document.getElementById('arabicLangCard');
  const status = document.getElementById('arabicLangStatus');
  const desc = document.getElementById('arabicLangDesc');
  const currentLang = document.getElementById('htmlRoot').getAttribute('lang') || 'ar';
  const t = translations[currentLang];

  if (isArabicSelected) {
    card.classList.remove('deselected');
    card.classList.add('active');
    status.className = 'lang-status status-selected';
    status.textContent = t.arabicStatusSelected;
    desc.textContent = t.arabicLangDescActive;
  } else {
    card.classList.remove('active');
    card.classList.add('deselected');
    status.className = 'lang-status status-deselected';
    status.textContent = t.arabicStatusDeselected;
    desc.textContent = t.arabicLangDescDeselected;
  }
}

function selectModel(modelId, el) {
  document.querySelectorAll('.model-card').forEach(card => card.classList.remove('active'));
  el.classList.add('active');
  selectedSubModel = modelId;
  updateManifestUrl();
  
  const modelName = el.querySelector('.model-name').textContent;
  const currentLang = document.getElementById('htmlRoot').getAttribute('lang') || 'ar';
  const prefix = translations[currentLang].toastModelSelect;
  showToast(`${prefix} ${modelName}`);
}

function checkApiStatus() {
  const apiKey = document.getElementById('subApiKeyInput').value.trim();
  const statusEl = document.getElementById('subApiStatus');
  const currentLang = document.getElementById('htmlRoot').getAttribute('lang') || 'ar';
  const t = translations[currentLang];

  if (apiKey === '') {
    statusEl.textContent = t.statusRed;
    statusEl.style.color = 'var(--g-red)';
  } else if (apiKey.startsWith('AIza') || apiKey.startsWith('AQ') || apiKey.startsWith('alza')) {
    statusEl.textContent = t.statusGreen;
    statusEl.style.color = 'var(--g-green)';
  } else {
    statusEl.textContent = t.statusYellow;
    statusEl.style.color = 'var(--g-yellow)';
  }
}

function buildManifestUrl() {
  const apiKey = document.getElementById('subApiKeyInput').value.trim() || 'NO_API_KEY';
  const base = getBaseUrl();
  return `${base}/${encodeURIComponent(apiKey)}/manifest.json?model=${selectedSubModel}`;
}

function updateManifestUrl() {
  const url = buildManifestUrl();
  document.getElementById('installBtn').href = url.replace(/^https?:\/\//, 'stremio://');
}

function handleInstallClick(e) {
  if (!isArabicSelected) {
    e.preventDefault();
    const currentLang = document.getElementById('htmlRoot').getAttribute('lang') || 'ar';
    showToast(translations[currentLang].langError, true);
    return false;
  }
  updateManifestUrl();
  return true;
}

function copyManifestUrl() {
  if (!isArabicSelected) {
    const currentLang = document.getElementById('htmlRoot').getAttribute('lang') || 'ar';
    showToast(translations[currentLang].langError, true);
    return;
  }
  const url = buildManifestUrl();
  navigator.clipboard.writeText(url).then(() => {
    const currentLang = document.getElementById('htmlRoot').getAttribute('lang') || 'ar';
    showToast(translations[currentLang].toastCopy);
  });
}

function saveConfig() {
  if (!isArabicSelected) {
    const currentLang = document.getElementById('htmlRoot').getAttribute('lang') || 'ar';
    showToast(translations[currentLang].langError, true);
    return;
  }
  const apiKey = document.getElementById('subApiKeyInput').value.trim();
  localStorage.setItem('sub_api_key', apiKey);
  localStorage.setItem('sub_model', selectedSubModel);
  const currentLang = document.getElementById('htmlRoot').getAttribute('lang') || 'ar';
  showToast(translations[currentLang].toastSave);
  updateManifestUrl();
}

window.addEventListener('DOMContentLoaded', () => {
  initAiBackgroundLogos();
  const savedKey = localStorage.getItem('sub_api_key');
  if (savedKey) document.getElementById('subApiKeyInput').value = savedKey;

  const savedModel = localStorage.getItem('sub_model');
  if (savedModel) {
    selectedSubModel = savedModel;
    const modelEl = document.querySelector(`.model-card[data-model="${savedModel}"]`);
    if (modelEl) {
      document.querySelectorAll('.model-card').forEach(card => card.classList.remove('active'));
      modelEl.classList.add('active');
    }
  }

  const savedLang = localStorage.getItem('ui_lang');
  if (savedLang && savedLang !== 'ar') {
    const btn = document.querySelectorAll('.top-lang-btn')[1];
    switchUILang(savedLang, btn);
  }

  document.getElementById('subApiKeyInput').addEventListener('input', () => {
    checkApiStatus();
    updateManifestUrl();
  });

  checkApiStatus();
  updateManifestUrl();
  updateArabicLangUI();
});
</script>

</body>
</html>
