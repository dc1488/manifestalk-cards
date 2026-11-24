# Manifestalk Cards · Self Connection

Konsep UX & UI (dummy untuk pitching) aktivitas mindfulness **Self Connection** untuk event Manifestalk.

Peserta memilih satu pertanyaan refleksi (Mind, Body, atau Feeling), membuka satu Mindful Manifestation Card dengan intuisi, menulis insight, lalu mendapatkan kartu Self Connection yang personal.

> Ini masih prototype dummy. Belum ada backend, tidak ada data yang dikirim atau disimpan.

## Isi repo

| Folder | Isi |
| --- | --- |
| `app/` | **Web app Self Connection untuk booth event.** Situs statis tanpa build: buka `app/index.html` atau deploy folder ini ke hosting statis mana pun. |
| `app-v2/` | **Versi 2** hasil revisi: warna kraft dan cokelat Manifestalk, Feeling menjadi Emotion, teks pertanyaan memakai font yang sama dengan label, kartu tertutup memakai sampul Mindful Manifestation Cards, dan kartu terbuka berupa foto tanpa teks. Kartu ada di `app-v2/img/` dan diatur di `app-v2/data.js`. Versi 1 di `app/` tetap ada. |
| `prototype/index.html` | Halaman konsep: UX journey, prototype HP yang bisa diklik, storyboard 7 layar, dan daftar hal yang perlu dikonfirmasi. Buka langsung di browser. |
| `deck/` | Sumber slide presentasi (12 slide): `deck.json` (urutan slide), `deck.css` (gaya), `slides/*.html` (isi tiap slide, termasuk speaker notes). |
| `deck/screens/` | Screenshot ketujuh layar prototype yang dipakai di slide. |
| `docs/brief-self-connection.pdf` | Brief awal konsep Self Connection. |

## Web app (`app/`)

Alurnya: sambutan → pilih pertanyaan → pilih 1 dari 3 kartu acak → tulis insight → isi data diri → kartu Self Connection → terkirim.

| URL | Kegunaan |
| --- | --- |
| `app/index.html` | Mode biasa, untuk peserta yang scan QR dari HP sendiri. |
| `app/index.html?kiosk` | Mode tablet di booth: kembali ke awal setelah 90 detik tanpa aktivitas, dan 30 detik setelah selesai. |
| `app/index.html?admin` | Daftar peserta, unduh CSV, dan hapus data. |

Yang sudah berfungsi:

- **Simpan gambar:** membuat PNG 1080×1920 (ukuran Instagram Story). Di HP membuka menu bagikan, di laptop langsung mengunduh.
- **WhatsApp:** membuka chat WhatsApp ke nomor peserta dengan teks kartu dan insight.
- **Data peserta:** tersimpan di browser perangkat itu saja (localStorage), bisa diekspor CSV dari halaman admin.

Yang belum (perlu backend):

- **Kirim ke email** belum benar-benar mengirim. Saat ini data dicatat di halaman admin, lalu peserta melihat layar terima kasih.
- Data tidak terkumpul lintas perangkat. Kalau peserta memakai HP masing-masing, datanya hanya ada di HP mereka.

Konten (nama event, pertanyaan, 9 kartu, chip pembuka kalimat, durasi kiosk) diatur di `app/data.js`.

## Menjalankan prototype

Buka `prototype/index.html` di browser. Font dimuat dari Google Fonts, jadi perlu koneksi internet supaya tampilannya sesuai.

## Catatan deck

Slide di `deck/slides/` merujuk gambar dengan path `/_blob/...` milik versi online. Gambar yang sama tersedia di `deck/screens/`:

| Path di slide | File |
| --- | --- |
| `/_blob/0b80afb383f0feb899499d819ff2529e` | `screens/screen-1.png` · Sambutan |
| `/_blob/5a8c4883a460023795020da59b138978` | `screens/screen-2.png` · Pilih pertanyaan |
| `/_blob/5c93a37d33dbf219f985ee1373d8b7bb` | `screens/screen-3.png` · Pilih kartu |
| `/_blob/9f2373591fa4c013160c84089d443632` | `screens/screen-4.png` · Tulis insight |
| `/_blob/6b008be5f265c9b8c4b40138f2aae8f2` | `screens/screen-5.png` · Data diri |
| `/_blob/bf1764f181417152ea638e2d9ad37c5a` | `screens/screen-6.png` · Kartu Self Connection |
| `/_blob/5d0717a5f3bb07979a84368aee8a6e3c` | `screens/screen-7.png` · Terkirim |

## Sebelum development

- Aset brand Manifestalk (logo, palet, font). Warna dan font di prototype masih placeholder.
- Daftar Mindful Manifestation Card resmi. Isi 9 kartu di prototype masih contoh.
- Cara kartu dikirim: email, WhatsApp, atau unduh.
- Mode di booth: HP peserta via QR atau tablet kiosk.
- Teks persetujuan dan kebijakan penggunaan data.
- Nama event dan tanggal untuk kartu.
