/**
 * Basis pengetahuan komprehensif tentang seluruh fitur, navigasi, dan fungsi di website My Hippocampus
 * Digunakan sebagai basis pengetahuan bagi bot panduan website agar dapat menjawab pertanyaan seputar website dengan akurat.
 */
export const WEBSITE_KNOWLEDGE_BASE = `
# PANDUAN LENGKAP FITUR & PENGGUNAAN WEBSITE MY HIPPOCAMPUS

Nama Aplikasi: My Hippocampus
Platform: Web Application (PWA / Single Page Application) yang mendukung mode offline, multi-root kanvas, dan player musik YouTube latar belakang.

## 1. STRUKTUR & TATA LETAK UTAMA
- **Header Atas**:
  - Menu Preset: Memuat contoh mind map siap pakai dari folder "Spesifik" (Tim Tech, Fitur Aplikasi, Startup Launch, Arsitektur Cloud) dan "Umum" (Kelas 10-A, Panitia Acara).
  - Folder Dokumen ("Umum" & "Spesifik"): Mengelompokkan dokumen mind map pengguna secara rapi.
  - Riwayat (History): Menyimpan daftar mind map yang pernah dibuat ke memori lokal browser (localStorage). Dapat dibuka kembali, dihapus, atau diunduh.
  - Ekspor Mind Map: Tersedia 4 format ekspor: PNG (Gambar resolusi tinggi), SVG (Vektor tanpa pecah), JSON (Struktur lengkap untuk diimpor kembali), dan Markdown (.md).
  - Unggah (Import): Mendukung file .json hasil ekspor, berkas teks biasa (.txt), dan berkas Markdown (.md).
  - Layar Penuh (Fullscreen): Tombol untuk memaksimalkan kanvas ke satu layar penuh.
  - Reset / Bersihkan: Membersihkan kanvas dan input untuk memulai mind map baru.

- **Panel Masukan (Input Panel)**:
  - Judul Topik Utama (Root Node): Label pusat dari mind map.
  - Subjudul / Keterangan: Deskripsi singkat di bawah topik utama.
  - Pemilihan Folder: Memilih kategori folder dokumen (Umum atau Spesifik).
  - Kolom Daftar Nama / Cabang (Names Text): Masukkan nama-nama cabang atau item yang dipisahkan dengan koma atau baris baru (enter).
  - Strategi Pengelompokan (Grouping Strategy):
    1. **Abjad (Alphabetical)**: Mengelompokkan otomatis cabang berdasarkan rentang huruf abjad (contoh: A-G, H-M, N-S, T-Z).
    2. **Cabang Seimbang (Balanced Spokes)**: Membagi daftar cabang secara merata ke dalam beberapa cabang utama (misalnya 4 kelompok seimbang).
    3. **Langsung Rata (Flat Direct)**: Menghubungkan seluruh cabang langsung ke topik utama tanpa sub-kelompok perantara.
  - Tombol Pengaturan Strategi: Menyesuaikan jumlah cabang seimbang, rentang abjad, dan emoji.
  - Tombol "BUAT MIND MAP": Menghasilkan peta pikiran ke kanvas.
  - Tombol "+ TAMBAH KE KANVAS": Menambahkan peta pikiran baru ke kanvas yang sama tanpa menghapus peta pikiran yang sudah ada (Multi-Root Canvas).

- **Pemilih Tata Letak & Tema (Layout & Theme Selector)**:
  - 7 Pilihan Tata Letak (Layouts):
    1. *Radial (Melingkar)*: Cabang menyebar melingkar 360 derajat di sekitar pusat.
    2. *Horizontal Tree (Pohon Horizontal)*: Pohon menyamping dari kiri ke kanan.
    3. *Vertical Tree (Pohon Vertikal)*: Hirarki dari atas ke bawah.
    4. *Fishbone (Tulang Ikan)*: Diagram Ishikawa untuk analisis sebab-akibat.
    5. *Bubble Cluster (Gelembung Kelompok)*: Desain bubble artistik dan organik.
    6. *Bilateral Bracket (Kurung Bilateral)*: Cabang terbagi seimbang ke kiri dan ke kanan.
    7. *Grid Network (Jaringan Kisi)*: Susunan matriks yang rapi dan terstruktur.
  - 7 Pilihan Tema Warna (Themes):
    1. *Pastel*: Warna lembut menenangkan.
    2. *Neon Dark*: Warna kontras tinggi dengan nuansa futuristik di atas kanvas gelap.
    3. *Sunset*: Gradasi hangat oranye, merah muda, dan ungu.
    4. *Corporate*: Nuansa biru profesional dan formal.
    5. *Emerald*: Kesegaran hijau zamrud alami.
    6. *Monochrome*: Minimalis hitam-putih elegan.
    7. *My Version*: Tema kustom personal pengguna.
  - Gaya Garis Penghubung (Connectors): Bezier melengkung, Lurus (Straight), Siku-siku (Angled), Titik-titik (Dotted), dan Beranimasi (Animated-dashed).
  - Bentuk Node (Shapes): Rounded (Sudut bulat), Pill (Kapsul), Sharp (Persegi tajam), Oval (Lonjong), Hexagon (Segi enam), dan Circle (Lingkaran).

- **Kanvas Interaktif (Canvas)**:
  - Pan & Zoom: Geser kanvas dengan klik & tahan (drag) atau gunakan mouse wheel untuk memperbesar/memperkecil.
  - Drag & Drop Node: Setiap node dapat dipindahkan posisinya secara bebas.
  - Resize Node: Skala ukuran node bisa disesuaikan.
  - Kolaps / Lipat Cabang: Klik tombol (-) atau panah pada cabang untuk menyembunyikan atau menampilkan sub-cabang.
  - Editor Node: Klik ganda atau klik node untuk membuka modal pengeditan label, emoji, warna, catatan tambahan (Node Notes), tambah sub-anak, atau hapus node.
  - Hubungan Antar Node (Custom Connections): Pengguna dapat membuat garis penghubung khusus antar node manapun.
  - Mode Outline: Tampilan hirarki teks yang dapat disalin atau dicetak.

- **Musik YouTube Latar Belakang & Playlist**:
  - Pengguna dapat menempel link YouTube lagu apa saja (misal lofi hip hop, musik fokus, instrumental piano).
  - Disimpan ke dalam **Playlist Pribadi** pengguna di browser.
  - Fitur Auto-Advance memutar lagu berikutnya secara otomatis ketika lagu saat ini habis.
  - Disertai pemutar musik mengambang (*Floating Player*) di pojok kanvas dengan tombol Putar/Jeda, Lagu Sebelumnya, Lagu Berikutnya, dan Volume.
  - Musik tetap berputar meskipun jendela pengaturan ditutup!

- **Mode Offline & PWA**:
  - Aplikasi dapat dipasang (Install) ke perangkat desktop (Windows/Mac/Linux) atau smartphone (Android/iOS) sebagai aplikasi mandiri.
  - Dilengkapi Service Worker dan Cache Storage sehingga dapat bekerja tanpa koneksi internet sama sekali.
`;
