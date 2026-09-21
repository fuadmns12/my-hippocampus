# Panduan & Konvensi Proyek: My Hippocampus (AGENTS.md)

> Berkas ini menjadi acuan otomatis bagi AI Agent yang bekerja di repositori ini, merangkum aturan resmi dari folder `Document/` (`Document/AUDIT_DOKUMEN_WEBSITE.md`, `Document/Umum/`, `Document/Spesifik/`, dan `Document/Panduan_Deploy_dan_Localhost/`).

---

## 1. Identitas Proyek & Prinsip Pengembangan
- **Nama Proyek:** My Hippocampus (MindMap Studio / Generator)
- **Tipe Proyek:** Aplikasi web mandiri (*solo project* / *single-owner project*).
- **Fungsi Inti:** Generator peta pikiran (mind map) interaktif berbasis web yang mengubah daftar teks/nama menjadi struktur visual hierarkis secara otomatis dengan multi-layout, tema warna, multi-root kanvas, dan dual-folder storage (`Umum` & `Spesifik`).
- **Stack Teknologi:**
  - Frontend: React 19, TypeScript (Strict Mode), Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`).
  - Backend/Dev Server: Node.js Express 4 + `tsx` (TypeScript Execution).
  - Animasi & Ikon: `motion/react`, `lucide-react`.
  - PWA: `vite-plugin-pwa` dengan dukungan offline service worker.
  - Node.js Wajib: **Node.js v20 LTS (v20.18.0+)** (didefinisikan di `.node-version`).

---

## 2. Standar Tipografi & Font (Berdasarkan `Document/Umum/JENIS_FONT.md`)
1. **Zero-FOUT & Zero-CLS Native Stack:**
   - Dilarang mengimpor file font biner eksternal berukuran besar (`.ttf`, `.woff2`) yang membebani bandwidth.
   - **Tumpukan Utama (UI Sans-Serif):**
     `font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";`
   - **Tumpukan Monospace (Data Teknis & Kode):**
     `font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;`
     Gunakan pada persentase zoom (`100%`), badge rentang abjad (`A-G, H-M`), dan metadata.
   - **Vektor Kanvas (SVG Rendering):**
     Gunakan atribut `font-family="sans-serif"` dengan `dominant-baseline="central"` dan `text-anchor="middle"` agar hasil ekspor SVG & PNG universal dan tidak pecah.
2. **Kontras & Warna Teks Kanvas Gelap:**
   - Teks Primer: `text-slate-100` (#F1F5F9) dengan kontras 18.5:1.
   - Teks Sekunder: `text-slate-400` (#94A3B8) dengan kontras 7.4:1.
   - Aksen Interaktif: `text-cyan-400` / `text-cyan-300`.
   - Identitas Folder Spesifik: `text-purple-400` / `text-purple-300`.

---

## 3. Standar Ikonografi & Anti-Slop (Berdasarkan `Document/Umum/PANDUAN_PENGGUNAAN_IKON.md`)
1. **Ikon yang Dilarang (Redundan / AI Slop Cliché):**
   - **DILARANG** menambahkan ikon dekoratif di samping label teks yang sudah jelas (misal: tombol "Contoh Dataset" / "Template" **tidak boleh** memakai ikon `Sparkles` atau semacamnya).
   - **DILARANG** menggunakan ikon klise AI seperti `Sparkles`, `Wand2`, atau `Flame` untuk fitur biasa non-AI.
   - **DILARANG** mengulang ikon identik di setiap baris daftar panjang (misal 50 baris nama murid).
2. **Ikon yang Diperbolehkan:**
   - Tombol tanpa teks (*icon-only actions*): `Maximize2`, `X`, `Download`, tombol zoom/pan kanvas. Wajib memiliki atribut `title` dan `aria-label`.
   - Status feedback: `Check` saat simpan sukses.
   - Pembeda kategori folder: `Folder`.
   - Aksi destruktif: `Trash2`.

---

## 4. Arsitektur Tata Letak & Responsivitas 3 Layar (Berdasarkan `Document/Spesifik/LAYOUT_HALAMAN.md`)
1. **HP / Smartphone (< 768px):**
   - Navigasi ringkas, deskripsi aplikasi disembunyikan.
   - Form input dan pemilih folder disusun 1 kolom vertikal (*stacked*).
   - Area sentuh minimal tombol **≥ 44×44px** (*thumb-zone friendly*).
   - Drawer dokumen tampil selebar layar penuh (`w-full`).
2. **Tablet (768px – 1023px):**
   - Tata letak input 2-kolom berdampingan (`grid-cols-2`).
   - Kartu strategi pengelompokan 3-kolom sejajar (`grid-cols-3`).
   - Drawer dokumen selebar 420px.
3. **Laptop / Desktop (≥ 1024px):**
   - Kontainer terpusat `w-full max-w-7xl mx-auto px-6`.
   - Kanvas tinggi optimal (≥ 700px atau Fullscreen 100vh).
   - Drawer dokumen slide-over selebar `max-w-lg` (512px).

---

## 5. Matriks Ukuran Font Komponen (Berdasarkan `Document/Spesifik/UKURAN_DAN_LETAK_FONT.md`)
- **Header:** Judul 16px (HP) / 18px (Tablet & Laptop) Bold. Subjudul 12px (hanya Tablet & Laptop).
- **Form Input & Label:** 12px Semibold (Label) / 12px Regular (Teks).
- **Tombol Utama (CTA):** 12.5px - 13px Bold.
- **Kanvas SVG Node:**
  - Root Node (Pusat): 11px - 14px Bold / Extrabold.
  - Branch Node (Cabang): 10px - 12px Bold.
  - Leaf Node (Nama): 9px - 11px Semibold.
  - Micro-Counter / Subtitle: 7px - 9px Regular/Medium.

---

## 6. Arsitektur Data Dokumen (Berdasarkan `Document/Spesifik/SCHEMA_DATA_MINDMAP.md`)
- Mengikuti antarmuka `MindMapData` dan `MindMapNode` di `src/types.ts`.
- Mendukung dual-folder: `"Umum"` (kebutuhan harian, event, kelas, komunitas) dan `"Spesifik"` (arsitektur modul teknis, roadmap, tim engineering).
- Persistensi browser via `localStorage` di bawah kunci `mindmap_generator_history`.

---

## 7. Aturan Build & Deployment (Berdasarkan `Document/Panduan_Deploy_dan_Localhost/`)
- **Node.js Version Requirement:** Node.js v20 LTS (`v20.18.0`). File `.node-version` wajib ada di root.
- **Cloudflare Pages Deployment:**
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable wajib di Cloudflare Pages jika diperlukan: `NODE_VERSION = 20.18.0`.
- **Localhost Development:**
  - Menjalankan dev server: `npm run dev` (Express + Vite di port 3000).
