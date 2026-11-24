(function () {
  const CFG = window.SC_CONFIG, Q = window.SC_QUESTIONS, CARDS = window.SC_CARDS, ICON = window.SC_ICONS;
  const params = new URLSearchParams(location.search);
  const KIOSK = params.has('kiosk');
  const ADMIN = params.has('admin');
  const app = document.getElementById('app');
  const STORE_KEY = 'sc_entries_v2';

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (k, sw = 2.4) => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICON[k]}"/></svg>`;
  const photo = (c, cls = 'photo') => `<img class="${cls}" src="${c.img}" alt="${esc(c.alt)}" draggable="false">`;
  const firstName = n => esc((n || 'Kamu').trim().split(/\s+/)[0] || 'Kamu');
  const dateText = () => new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const BACK = `<img class="back-img" src="${window.SC_CARD_BACK}" alt="" draggable="false">`;

  /* ---------- penyimpanan lokal (demo, tanpa server) ---------- */
  function loadEntries() { try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch (e) { return []; } }
  function saveEntry(e) { try { const all = loadEntries(); all.push(e); localStorage.setItem(STORE_KEY, JSON.stringify(all)); } catch (err) { /* abaikan */ } }

  /* ---------- state ---------- */
  const shuffle = () => { const a = [...CARDS.keys()]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, 3); };
  const fresh = () => ({ step: 0, q: null, deck: shuffle(), picked: null, insight: '', name: '', hp: '', email: '', consent: false, sentVia: null, errors: {} });
  let st = fresh();

  const card = () => CARDS[st.deck[st.picked]];
  const normHp = hp => { let d = String(hp).replace(/[^\d+]/g, ''); if (d.startsWith('+')) d = d.slice(1); if (d.startsWith('0')) d = '62' + d.slice(1); return d; };
  const validHp = hp => /^62\d{8,13}$/.test(normHp(hp));
  const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e).trim());
  const formReady = () => !!(st.name.trim() && st.hp.trim() && st.email.trim() && st.consent);

  const prog = i => `<div class="prog" aria-label="Langkah ${i} dari 5">${[1, 2, 3, 4, 5].map(n => `<i class="${n <= i ? 'on' : ''}"></i>`).join('')}</div>`;
  const backBtn = to => `<button class="back" data-a="go" data-to="${to}" aria-label="Kembali">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>'}</button>`;
  const top = (i, back) => `<div class="top">${back != null ? backBtn(back) : `<span class="brand">${esc(CFG.brand)}</span>`}${i ? prog(i) : ''}</div>`;

  function resultCard() {
    const q = Q[st.q], c = card();
    return `<div class="sc" style="--cat:${q.color}">
      <div class="hd"><div class="meta"><span>${q.label} · ${q.id}</span><span>${dateText()}</span></div><h2>Self<em>Connection</em></h2></div>
      <div class="bd">
        <p class="q">${esc(q.q)}</p>
        <div class="crd">${photo(c)}</div>
        <p class="ins">${esc(st.insight) || 'Insight kamu akan muncul di sini'}</p>
        <div class="ft"><span>untuk <b>${firstName(st.name)}</b></span><span>${esc(CFG.eventName)}</span></div>
      </div></div>`;
  }

  /* ---------- layar ---------- */
  const SCREENS = [
    () => `${top(0)}
      <div class="orb"><div class="g"></div><span id="breath">tarik napas</span></div>
      <h1 class="ttl c">Hai, apa kabar <em>dirimu</em> hari ini?</h1>
      <p class="sub c">Luangkan 3 menit untuk terhubung dengan diri sendiri. Ikuti intuisimu.</p>
      <div class="tags"><span>3 menit</span><span>no right, no wrong</span><span>tanpa install</span></div>
      <div class="spacer"></div>
      <button class="btn" data-a="go" data-to="1">Yuk, mulai <span class="ar">→</span></button>`,

    () => `${top(1, 0)}
      <h1 class="qhead">Apa yang paling saya butuhkan saat ini untuk membuat saya menjadi lebih baik?</h1>
      ${Object.values(Q).map(q => `<button class="qopt ${st.q === q.key ? 'sel' : ''}" style="--qc:${q.color}" data-a="q" data-v="${q.key}" aria-pressed="${st.q === q.key}"><span class="qicon">${svg(q.icon || q.key)}</span><span><b>${q.label}<small>${q.id}</small></b><em>${esc(q.q)}</em></span><span class="tick">${svg('check', 3.5)}</span></button>`).join('')}
      <div class="spacer"></div>
      <button class="btn" data-a="go" data-to="2" ${st.q ? '' : 'disabled'}>Lanjut <span class="ar">→</span></button>`,

    () => { const q = Q[st.q]; return `${top(2, 1)}
      <span class="chip">${q.label} · ${q.id}</span>
      <p class="qline">${esc(q.q)}</p>
      <p class="sub">Tarik napas, lalu pilih satu kartu yang paling memanggilmu.</p>
      <div class="deck">${st.deck.map((ci, j) => { const c = CARDS[ci]; return `<button class="mcard ${st.picked === j ? 'flip' : ''} ${st.picked != null && st.picked !== j ? 'dim' : ''}" data-a="pick" data-v="${j}" aria-label="Kartu tertutup ${j + 1}"><span class="in"><span class="face cback">${BACK}</span><span class="face cfront">${photo(c)}</span></span></button>`; }).join('')}</div>
      <p class="hint">Tidak ada jawaban yang benar atau salah.</p>`; },

    () => { const q = Q[st.q], c = card(); return `${top(3, 2)}
      <figure class="reveal">${photo(c)}<figcaption>Kartumu</figcaption></figure>
      <p class="qline">${esc(q.q)}</p>
      <div class="field"><label for="ins">Tulis insight-mu</label>
        <textarea id="ins" maxlength="${CFG.insightMax}" placeholder="Apa yang muncul saat melihat kartu ini?" data-f="insight">${esc(st.insight)}</textarea>
        <span class="count"><span id="cnt">${st.insight.length}</span>/${CFG.insightMax}</span></div>
      <div class="starters">${window.SC_STARTERS.map(t => `<button class="starter" data-a="start" data-v="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      <div class="spacer"></div>
      <button class="btn cat" data-a="submit-insight" id="sub" ${st.insight.trim().length > 2 ? '' : 'disabled'}>Submit <span class="ar">→</span></button>`; },

    () => { const e = st.errors; return `${top(4, 3)}
      <h1 class="ttl">Satu langkah <em>lagi</em></h1>
      <p class="sub">Isi data dirimu untuk mendapatkan kartu Self Connection dan insight yang kamu temukan.</p>
      <div class="preview" aria-hidden="true"><div class="mini">${resultCard()}</div><span class="lock">Kartumu sudah siap ✦</span></div>
      <div class="field ${e.name ? 'err' : ''}"><label for="nm">Nama</label><input id="nm" data-f="name" value="${esc(st.name)}" placeholder="Nama panggilan" autocomplete="name" maxlength="40"><span class="msg">${e.name || ''}</span></div>
      <div class="field ${e.hp ? 'err' : ''}"><label for="hp">No. HP / WhatsApp</label><input id="hp" data-f="hp" value="${esc(st.hp)}" placeholder="08xx xxxx xxxx" inputmode="tel" autocomplete="tel" maxlength="20"><span class="msg">${e.hp || ''}</span></div>
      <div class="field ${e.email ? 'err' : ''}"><label for="em">Email</label><input id="em" data-f="email" value="${esc(st.email)}" placeholder="nama@email.com" inputmode="email" autocomplete="email" maxlength="80"><span class="msg">${e.email || ''}</span></div>
      <label class="check"><input type="checkbox" id="cs" data-f="consent" ${st.consent ? 'checked' : ''}><span>Saya setuju data saya dipakai untuk mengirim kartu ini dan info kegiatan Manifestalk.</span></label>
      <button class="btn" data-a="submit-form" id="sub" ${formReady() ? '' : 'disabled'}>Dapatkan kartuku <span class="ar">→</span></button>`; },

    () => `${top(5)}
      <h1 class="ttl">Ini kartumu, <em>${firstName(st.name)}</em></h1>
      ${resultCard()}
      <button class="btn" data-a="save">Simpan gambar <span class="ar">↓</span></button>
      <div class="row"><button class="btn ghost" data-a="send" data-v="email">Kirim ke email</button><button class="btn ghost" data-a="send" data-v="wa">WhatsApp</button></div>`,

    () => `${top(0)}
      <div class="burst"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2l9 16 17-8 1 19 19 3-10 16 13 13-18 6 3 19-18-4-8 17-8-17-18 4 3-19-18-6 13-13L4 32l19-3 1-19 17 8z" fill="#F3C969"/><path d="M34 51l11 11 21-23" fill="none" stroke="#43200A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <h1 class="ttl c">Terima kasih sudah <em>terhubung</em></h1>
      <p class="sub c">Kartu Self Connection-mu akan dikirim ke kontak di bawah. Baca lagi saat kamu butuh pengingat kecil untuk dirimu sendiri.</p>
      <div class="sent"><div><span>Email</span><b>${esc(st.email)}</b></div><div><span>WhatsApp</span><b>${esc(st.hp)}</b></div></div>
      <p class="sub c">Sampai jumpa di sesi Manifestalk berikutnya.</p>
      <div class="spacer"></div>
      ${KIOSK ? '<p class="countdown" id="cd"></p>' : ''}
      <button class="btn ghost" data-a="reset">${KIOSK ? 'Selesai, giliran berikutnya' : 'Kembali ke awal'}</button>`
  ];

  function show(step, focusSel) {
    st.step = step;
    app.style.setProperty('--cat', st.q ? Q[st.q].color : 'var(--mind)');
    app.querySelectorAll('.screen,.toast').forEach(n => n.remove());
    const s = document.createElement('section');
    s.className = 'screen';
    s.innerHTML = SCREENS[step]();
    app.appendChild(s);
    const f = focusSel ? s.querySelector(focusSel) : s.querySelector('h1');
    if (f) { if (!focusSel) f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
    if (step === 0) startBreath();
    if (step === 6 && KIOSK) startCountdown();
  }

  /* napas di layar sambutan, mengikuti animasi 8 detik */
  let breathTimer;
  function startBreath() {
    clearInterval(breathTimer);
    let inhale = true;
    breathTimer = setInterval(() => {
      const el = document.getElementById('breath');
      if (!el) return clearInterval(breathTimer);
      inhale = !inhale; el.textContent = inhale ? 'tarik napas' : 'hembuskan';
    }, 4000);
  }

  function toast(msg) {
    app.querySelectorAll('.toast').forEach(n => n.remove());
    const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    app.appendChild(t); setTimeout(() => t.remove(), 2600);
  }

  /* ---------- kiosk: reset otomatis ---------- */
  let idleTimer, cdTimer;
  function resetIdle() {
    if (!KIOSK) return;
    clearTimeout(idleTimer);
    if (st.step > 0 && st.step < 6) idleTimer = setTimeout(() => { st = fresh(); show(0); }, CFG.kioskIdleSeconds * 1000);
  }
  function startCountdown() {
    clearInterval(cdTimer);
    let n = CFG.kioskDoneSeconds;
    const tick = () => { const el = document.getElementById('cd'); if (!el || st.step !== 6) return clearInterval(cdTimer); el.textContent = `Kembali ke awal dalam ${n} detik`; if (n-- <= 0) { clearInterval(cdTimer); st = fresh(); show(0); } };
    tick(); cdTimer = setInterval(tick, 1000);
  }
  ['pointerdown', 'keydown', 'input'].forEach(ev => document.addEventListener(ev, resetIdle, { passive: true }));

  /* ---------- gambar kartu ---------- */
  async function makeBlob() {
    return window.SC_renderCard({ question: Q[st.q], card: card(), insight: st.insight.trim(), name: (st.name.trim().split(/\s+/)[0] || 'Kamu'), eventName: CFG.eventName, dateText: dateText() });
  }
  async function saveImage(btn) {
    btn.disabled = true;
    try {
      const blob = await makeBlob();
      const file = new File([blob], 'self-connection.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] }) && matchMedia('(pointer:coarse)').matches) {
        try { await navigator.share({ files: [file], title: 'Self Connection' }); btn.disabled = false; return; } catch (e) { if (e.name === 'AbortError') { btn.disabled = false; return; } }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'self-connection.png';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast('Gambar kartu disimpan');
    } catch (e) { toast('Gambar belum bisa dibuat. Coba screenshot layar ini.'); }
    btn.disabled = false;
  }

  /* ---------- interaksi ---------- */
  app.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b || b.disabled) return;
    const a = b.dataset.a;
    if (a === 'go') show(+b.dataset.to);
    else if (a === 'q') { if (st.q !== b.dataset.v) { st.q = b.dataset.v; st.picked = null; st.deck = shuffle(); } show(1, `[data-v="${st.q}"]`); }
    else if (a === 'pick') {
      if (st.picked != null) return;
      st.picked = +b.dataset.v;
      app.querySelectorAll('.mcard').forEach((m, j) => m.classList.add(j === st.picked ? 'flip' : 'dim'));
      setTimeout(() => { if (st.step === 2) show(3); }, 1700);
    }
    else if (a === 'start') {
      const ta = app.querySelector('#ins');
      const add = b.dataset.v.replace('…', ' ');
      st.insight = (st.insight.trim() ? st.insight.trim() + ' ' : '') + add;
      st.insight = st.insight.slice(0, CFG.insightMax);
      ta.value = st.insight; ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
    else if (a === 'submit-insight') { if (st.insight.trim().length > 2) show(4); }
    else if (a === 'submit-form') {
      st.errors = {};
      if (!st.name.trim()) st.errors.name = 'Isi nama panggilanmu.';
      if (!validHp(st.hp)) st.errors.hp = 'Nomor HP belum valid, contoh 0812 3456 7890.';
      if (!validEmail(st.email)) st.errors.email = 'Email belum valid, contoh nama@email.com.';
      if (Object.keys(st.errors).length || !st.consent) { show(4, '.err input'); return; }
      show(5);
    }
    else if (a === 'save') saveImage(b);
    else if (a === 'send') {
      st.sentVia = b.dataset.v;
      saveEntry({ at: new Date().toISOString(), name: st.name.trim(), hp: normHp(st.hp), email: st.email.trim(), via: st.sentVia, question: st.q, card: card().name, insight: st.insight.trim() });
      if (st.sentVia === 'wa') {
        const q = Q[st.q], c = card();
        const text = `Self Connection · ${q.label}\n\n"${q.q}"\n\nInsight-ku: ${st.insight.trim()}\n\n${CFG.eventName}`;
        const link = document.createElement('a');
        link.href = `https://wa.me/${normHp(st.hp)}?text=${encodeURIComponent(text)}`; link.target = '_blank'; link.rel = 'noopener';
        document.body.appendChild(link); link.click(); link.remove();
      }
      show(6);
    }
    else if (a === 'reset') { clearInterval(cdTimer); st = fresh(); show(0); }
  });
  app.addEventListener('input', e => {
    const f = e.target.dataset.f; if (!f) return;
    st[f] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const sub = app.querySelector('#sub');
    if (st.step === 3) { app.querySelector('#cnt').textContent = st.insight.length; sub.disabled = st.insight.trim().length < 3; }
    if (st.step === 4) {
      sub.disabled = !formReady();
      const fld = e.target.closest('.field'); if (fld && fld.classList.contains('err')) { fld.classList.remove('err'); fld.querySelector('.msg').textContent = ''; delete st.errors[f]; }
      const m = app.querySelector('.mini'); if (m && f === 'name') m.innerHTML = resultCard();
    }
  });
  app.addEventListener('submit', e => e.preventDefault());

  /* ---------- admin: ?admin ---------- */
  function renderAdmin(confirming) {
    document.body.classList.add('is-admin');
    const rows = loadEntries();
    const qName = k => Q[k] ? Q[k].label : k;
    document.body.innerHTML = `<div class="admin">
      <h1>Data peserta</h1>
      <p class="sub">${rows.length} peserta tersimpan di browser perangkat ini. Data tidak dikirim ke server mana pun.</p>
      <div class="bar"><button class="btn" id="csv" ${rows.length ? '' : 'disabled'}>Unduh CSV</button><button class="btn ghost" id="clr" ${rows.length ? '' : 'disabled'}>Hapus semua data</button><a class="btn ghost" href="./">Buka aplikasi</a></div>
      ${confirming ? `<div class="confirm"><span>Hapus ${rows.length} data peserta dari perangkat ini? Tindakan ini tidak bisa dibatalkan.</span><button class="btn" id="yes">Ya, hapus</button><button class="btn ghost" id="no">Batal</button></div>` : ''}
      <div class="tbl"><table><thead><tr><th>Waktu</th><th>Nama</th><th>HP</th><th>Email</th><th>Pertanyaan</th><th>Kartu</th><th>Insight</th><th>Kirim</th></tr></thead><tbody>
      ${rows.length ? rows.slice().reverse().map(r => `<tr><td>${esc(new Date(r.at).toLocaleString('id-ID'))}</td><td>${esc(r.name)}</td><td>${esc(r.hp)}</td><td>${esc(r.email)}</td><td>${esc(qName(r.question))}</td><td>${esc(r.card)}</td><td>${esc(r.insight)}</td><td>${r.via === 'wa' ? 'WhatsApp' : 'Email'}</td></tr>`).join('') : '<tr><td colspan="8">Belum ada peserta. Data muncul di sini setelah peserta menekan Kirim di layar kartu.</td></tr>'}
      </tbody></table></div></div>`;
    const csv = document.getElementById('csv');
    if (csv) csv.onclick = () => {
      const head = ['waktu', 'nama', 'hp', 'email', 'pertanyaan', 'kartu', 'insight', 'kirim'];
      const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const body = rows.map(r => [r.at, r.name, r.hp, r.email, qName(r.question), r.card, r.insight, r.via].map(q).join(','));
      const blob = new Blob(['﻿' + [head.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'self-connection-peserta.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
    };
    const clr = document.getElementById('clr'); if (clr) clr.onclick = () => renderAdmin(true);
    const yes = document.getElementById('yes'); if (yes) yes.onclick = () => { try { localStorage.removeItem(STORE_KEY); } catch (e) {} renderAdmin(false); };
    const no = document.getElementById('no'); if (no) no.onclick = () => renderAdmin(false);
  }

  [window.SC_CARD_BACK, ...CARDS.map(c => c.img)].forEach(src => { const i = new Image(); i.src = src; });
  if (ADMIN) renderAdmin(false); else show(0);
})();
