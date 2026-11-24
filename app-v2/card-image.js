/* Menggambar kartu Self Connection ke PNG 1080×1920 (ukuran Instagram Story). */
(function () {
  const W = 1080, H = 1920;
  const F = {
    display: '"Bricolage Grotesque", "Avenir Next", system-ui, sans-serif',
    serif: '"Instrument Serif", Georgia, serif',
    body: '"Figtree", system-ui, sans-serif'
  };
  const C = { bg: '#F1E3CF', ink: '#43200A', dim: '#7A5A43', card: '#FFFBF4', lemon: '#F3C969' };

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
    const rad = Array.isArray(r) ? r : [r, r, r, r];
    const [tl, tr, br, bl] = rad.length === 4 ? rad : [rad[0], rad[0], rad[0], rad[0]];
    ctx.moveTo(x + tl, y); ctx.lineTo(x + w - tr, y); ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
    ctx.lineTo(x + w, y + h - br); ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    ctx.lineTo(x + bl, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
    ctx.lineTo(x, y + tl); ctx.quadraticCurveTo(x, y, x + tl, y); ctx.closePath();
  }
  function wrap(ctx, text, maxW) {
    const words = String(text).split(/\s+/).filter(Boolean), lines = [];
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width <= maxW || !line) line = t;
      else { lines.push(line); line = w; }
      while (ctx.measureText(line).width > maxW && line.length > 1) { // kata sangat panjang
        let cut = line.length - 1;
        while (cut > 1 && ctx.measureText(line.slice(0, cut)).width > maxW) cut--;
        lines.push(line.slice(0, cut)); line = line.slice(cut);
      }
    }
    if (line) lines.push(line);
    return lines;
  }
  function icon(ctx, path, x, y, size, color, lw) {
    ctx.save(); ctx.translate(x, y); ctx.scale(size / 48, size / 48);
    ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.stroke(new Path2D(path)); ctx.restore();
  }
  function loadImg(src) {
    return new Promise((res, rej) => { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => res(im); im.onerror = rej; im.src = src; });
  }
  function photo(ctx, im, x, y, w, h, r) {
    const s = Math.max(w / im.width, h / im.height), sw = w / s, sh = h / s;
    ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip();
    ctx.drawImage(im, (im.width - sw) / 2, (im.height - sh) / 2, sw, sh, x, y, w, h); ctx.restore();
  }

  async function loadFonts() {
    if (!document.fonts || !document.fonts.load) return;
    try {
      await Promise.all([
        document.fonts.load('800 100px "Bricolage Grotesque"'),
        document.fonts.load('600 40px "Bricolage Grotesque"'),
        document.fonts.load('italic 400 100px "Instrument Serif"'),
        document.fonts.load('700 30px "Figtree"')
      ]);
    } catch (e) { /* pakai font cadangan */ }
  }

  async function render(data) {
    await loadFonts();
    const { question: q, card, insight, name, eventName, dateText } = data;
    const img = await loadImg(card.img);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');

    // latar
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    const blob = (x, y, r, col, a) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, col + '00'); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; };
    blob(W + 60, -40, 620, q.color, .45); blob(-60, H + 40, 640, C.lemon, .8); blob(W + 40, H * .55, 360, '#E6B98F', .45);

    const PX = 90, PW = W - 180, IN = 56, CW = PW - IN * 2;
    // ukur konten
    let insFont = 52, insLines;
    ctx.font = `600 40px ${F.display}`; const qLines = wrap(ctx, q.q, CW - 80);
    const photoH = 440;
    const layout = () => {
      ctx.font = `italic 400 ${insFont}px ${F.serif}`;
      insLines = wrap(ctx, insight, CW - 100);
      const qH = qLines.length * 52 + 76, cardH = photoH;
      const insH = insLines.length * insFont * 1.22 + 100;
      return { qH, cardH, insH, total: 440 - 60 + qH + 44 + cardH + 44 + insH + 44 + 60 + 50 };
    };
    let L = layout();
    while (150 + L.total > H - 200 && insFont > 34) { insFont -= 2; L = layout(); }
    const PY = Math.max(110, Math.round((H - 170 - L.total) / 2));

    // panel
    ctx.save(); ctx.shadowColor = 'rgba(67,32,10,.3)'; ctx.shadowBlur = 80; ctx.shadowOffsetY = 40;
    rr(ctx, PX, PY, PW, L.total, 60); ctx.fillStyle = C.card; ctx.fill(); ctx.restore();
    // header
    ctx.save(); rr(ctx, PX, PY, PW, L.total, 60); ctx.clip();
    ctx.fillStyle = q.color; ctx.fillRect(PX, PY, PW, 440);
    ctx.beginPath(); ctx.arc(PX + PW - 30, PY + 30, 200, 0, Math.PI * 2); ctx.fillStyle = C.lemon; ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#FFFFFF'; ctx.font = `700 28px ${F.body}`; ctx.textBaseline = 'alphabetic';
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '3px';
    ctx.fillText(`${q.label} · ${q.id}`.toUpperCase(), PX + IN, PY + 84);
    ctx.fillStyle = C.ink; ctx.textAlign = 'right'; ctx.fillText(dateText.toUpperCase(), PX + PW - IN, PY + 84);
    ctx.textAlign = 'left'; if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 170px ${F.display}`; ctx.fillText('Self', PX + IN - 6, PY + 250);
    ctx.font = `italic 400 150px ${F.serif}`; ctx.fillText('Connection', PX + IN - 4, PY + 380);

    let y = PY + 440 - 60;
    // pertanyaan
    ctx.save(); ctx.shadowColor = 'rgba(67,32,10,.18)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
    rr(ctx, PX + IN, y, CW, L.qH, 34); ctx.fillStyle = C.card; ctx.fill(); ctx.restore();
    ctx.fillStyle = C.ink; ctx.font = `600 40px ${F.display}`;
    qLines.forEach((t, i) => ctx.fillText(t, PX + IN + 40, y + 38 + 40 + i * 52 - 6));
    y += L.qH + 44;
    // kartu
    photo(ctx, img, PX + IN, y, CW, photoH, 34);
    y += L.cardH + 44;
    // insight
    rr(ctx, PX + IN, y, CW, L.insH, 34); ctx.fillStyle = C.lemon; ctx.fill();
    ctx.fillStyle = 'rgba(67,32,10,.2)'; ctx.font = `800 140px ${F.display}`; ctx.fillText('“', PX + IN + 18, y + 118);
    ctx.fillStyle = C.ink; ctx.font = `italic 400 ${insFont}px ${F.serif}`;
    insLines.forEach((t, i) => ctx.fillText(t, PX + IN + 50, y + 50 + insFont + i * insFont * 1.22 - 6));
    y += L.insH + 44;
    // footer
    ctx.fillStyle = C.dim; ctx.font = `600 28px ${F.body}`; ctx.fillText('untuk', PX + IN, y + 40);
    const uw = ctx.measureText('untuk ').width;
    ctx.fillStyle = C.ink; ctx.font = `800 38px ${F.display}`; ctx.fillText(name, PX + IN + uw, y + 42);
    ctx.fillStyle = C.dim; ctx.font = `600 26px ${F.body}`; ctx.textAlign = 'right';
    ctx.fillText(eventName, PX + PW - IN, y + 40); ctx.textAlign = 'left';

    // brand bawah
    ctx.textAlign = 'center'; ctx.fillStyle = C.ink;
    ctx.font = `800 48px ${F.display}`; ctx.fillText(window.SC_CONFIG.brand, W / 2, H - 120);
    ctx.fillStyle = C.dim; ctx.font = `600 26px ${F.body}`; ctx.fillText('Self Connection', W / 2, H - 76);
    ctx.textAlign = 'left';

    return new Promise(res => cv.toBlob(b => res(b), 'image/png'));
  }

  window.SC_renderCard = render;
})();
