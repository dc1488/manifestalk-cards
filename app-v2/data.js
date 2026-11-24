/* Konten Self Connection versi 2 (revisi brand Manifestalk). Ubah teks, kartu, dan nama event di file ini saja. */
window.SC_CONFIG = {
  eventName: 'Manifestalk · Nama Event',
  brand: 'manifestalk',
  // Jika ?kiosk=1, sesi otomatis kembali ke awal setelah tidak ada aktivitas (detik)
  kioskIdleSeconds: 90,
  kioskDoneSeconds: 30,
  insightMax: 200
};

/* Ikon ditulis sebagai path SVG (viewBox 0 0 48 48) agar bisa dipakai di HTML dan di canvas. */
window.SC_ICONS = {
  moon: 'M30 9a15 15 0 1 0 9 25A13 13 0 0 1 30 9z',
  sun: 'M32 27a8 8 0 1 0-16 0a8 8 0 1 0 16 0M24 9v5M9 27H4M44 27h-5M12 15l3 3M36 15l-3 3M5 40h38',
  wave: 'M4 26c5-6 10-6 15 0s10 6 15 0 10-6 10-6M4 35c5-6 10-6 15 0s10 6 15 0 10-6 10-6',
  mountain: 'M4 38 18 15l8 12 5-7 13 18z',
  seed: 'M24 41V24M24 24c-8 0-12-6-12-12 8 0 12 6 12 12zM24 29c6 0 10-4 10-10-6 0-10 4-10 10z',
  lotus: 'M24 38c-6-6-6-16 0-24 6 8 6 18 0 24zM24 38c-8-2-14-8-16-16 8 0 14 6 16 16zM24 38c8-2 14-8 16-16-8 0-14 6-16 16zM10 41h28',
  root: 'M24 6v16M24 22c-4 6-10 8-14 16M24 22c4 6 10 8 14 16M24 22v18M17 31l-5 3M31 31l5 3',
  feather: 'M36 8C22 10 14 22 14 36l-4 6M14 36c10-2 20-10 22-28M18 28h9M21 21h8',
  door: 'M14 42V18a10 10 0 0 1 20 0v24zM8 42h32M29 30h.01',
  mind: 'M40 24a16 16 0 1 0-32 0a16 16 0 1 0 32 0M24 24a2.5 2.5 0 1 1 3 2.4M27 26.4A6 6 0 1 1 30 21M30 21a9.5 9.5 0 1 1-12.5-5',
  body: 'M28 10a4 4 0 1 0-8 0a4 4 0 1 0 8 0M24 15v14M13 20l11 4 11-4M24 29l-6 12M24 29l6 12',
  feeling: 'M24 40S8 30 8 19a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 11-16 21-16 21z',
  check: 'M12 25l8 8 16-17'
};

window.SC_QUESTIONS = {
  mind: { key: 'mind', color: '#3F66B0', label: 'Mind', id: 'Pikiran',
    q: 'Pola pikir apa yang perlu saya ubah agar bisa melangkah maju?' },
  body: { key: 'body', color: '#D2702A', label: 'Body', id: 'Tubuh',
    q: 'Langkah nyata apa yang perlu saya lakukan untuk lebih menjaga dan menghargai tubuh saya?' },
  emotion: { key: 'emotion', icon: 'feeling', color: '#C2475E', label: 'Emotion', id: 'Perasaan',
    q: 'Perasaan apa yang perlu lebih berani saya ungkapkan atau lepaskan agar bisa melangkah lebih ringan?' }
};

/* Mindful Manifestation Card: kartu foto tanpa teks. Tambahkan foto kartu lain di folder img/.
   "name" hanya dipakai untuk data peserta dan teks alternatif, tidak tampil di kartu. */
window.SC_CARD_BACK = 'img/card-back.jpg';
window.SC_CARDS = [
  { img: 'img/card-puzzle.jpg', name: 'Puzzle', alt: 'Tangan menyusun kepingan puzzle' },
  { img: 'img/card-lensa.jpg', name: 'Lensa', alt: 'Seseorang membidik dengan kamera' },
  { img: 'img/card-matahari.jpg', name: 'Bunga Matahari', alt: 'Anak mencium bunga matahari' }
];

window.SC_STARTERS = ['Aku sadar…', 'Mulai hari ini aku…', 'Aku siap melepas…'];
