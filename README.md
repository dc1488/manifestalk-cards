# Manifestalk Cards · Self Connection

Konsep UX & UI (dummy untuk pitching) aktivitas mindfulness **Self Connection** untuk event Manifestalk.

Peserta memilih satu pertanyaan refleksi (Mind, Body, atau Feeling), membuka satu Mindful Manifestation Card dengan intuisi, menulis insight, lalu mendapatkan kartu Self Connection yang personal.

> Ini masih prototype dummy. Belum ada backend, tidak ada data yang dikirim atau disimpan.

## Isi repo

| Folder | Isi |
| --- | --- |
| `prototype/index.html` | Halaman konsep: UX journey, prototype HP yang bisa diklik, storyboard 7 layar, dan daftar hal yang perlu dikonfirmasi. Buka langsung di browser. |
| `deck/` | Sumber slide presentasi (12 slide): `deck.json` (urutan slide), `deck.css` (gaya), `slides/*.html` (isi tiap slide, termasuk speaker notes). |
| `deck/screens/` | Screenshot ketujuh layar prototype yang dipakai di slide. |
| `docs/brief-self-connection.pdf` | Brief awal konsep Self Connection. |

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
