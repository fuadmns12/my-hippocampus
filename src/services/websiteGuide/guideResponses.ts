export const OFF_TOPIC_REPLY = `Maaf, saya adalah **Bot Panduan Website** untuk aplikasi *My Hippocampus*. Tugas saya khusus hanya untuk memandu dan menjawab pertanyaan tentang cara menggunakan fitur-fitur website ini.

Silakan ajukan pertanyaan seputar penggunaan website, seperti:
• **Cara membuat mind map** & menambah cabang baru
• **Pilihan tata letak** (Radial, Horizontal Tree, Fishbone, dll.) & tema warna
• **Cara ekspor** ke PNG, SVG, JSON, atau Markdown
• **Menambahkan catatan** (Notes) dan tautan referensi pada cabang/kartu
• **Mengatur pemutar musik YouTube** latar belakang
• **Navigasi kanvas** (zoom, pan, geser kartu, lipat cabang, shortcut keyboard)`;

export const CREATE_MINDMAP_REPLY = `### 📌 Cara Membuat & Menambah Mind Map di Website Ini:

1. **Buka Panel Masukan**:
   - Jika panel belum terbuka, klik tombol **"Buka Panel Input"** pada header atas.
2. **Isi Judul & Subjudul**:
   - Ketik topik utama di kolom **"Judul Topik Utama"** (ini akan menjadi kartu pusat).
   - Tambahkan keterangan singkat di kolom **"Subjudul"** (opsional).
3. **Masukkan Daftar Cabang**:
   - Tulis nama-nama cabang di kolom teks besar. Pisahkan setiap cabang dengan menekan **Enter** (baris baru) atau tanda **koma (,)**.
   - Anda juga dapat menggunakan input cepat di bawahnya lalu tekan Enter.
4. **Pilih Strategi Pengelompokan**:
   - **Abjad (Alphabetical)**: Mengelompokkan otomatis berdasarkan abjad (A-G, H-M, dst.).
   - **Cabang Seimbang (Balanced Spokes)**: Membagi cabang merata menjadi beberapa kelompok seimbang.
   - **Langsung Rata (Flat Direct)**: Menghubungkan semua cabang langsung ke topik utama.
5. **Klik "BUAT MIND MAP"**:
   - Peta pikiran akan langsung dirender rapi di kanvas!
   - Ingin membuat lebih dari satu mind map di satu layar? Klik tombol **"+ TAMBAH KE KANVAS"** (Multi-Root Canvas).`;

export const LAYOUT_REPLY = `### 🎨 Pilihan Tata Letak (Layout) yang Tersedia:

Anda dapat mengganti tata letak kapan saja melalui bilah **"Tata Letak & Gaya"**:

1. **Radial (Melingkar)**: Cabang menyebar 360° secara simetris mengelilingi topik pusat. Sangat cocok untuk eksplorasi ide bebas.
2. **Horizontal Tree (Pohon Horizontal)**: Cabang berkembang menyamping dari kiri ke kanan. Ideal untuk alur proses kronologis.
3. **Vertical Tree (Pohon Vertikal)**: Hirarki klasik dari atas ke bawah. Bagus untuk bagan organisasi dan klasifikasi bertingkat.
4. **Fishbone (Tulang Ikan / Ishikawa)**: Format diagram sebab-akibat untuk analisis masalah dan identifikasi faktor akar.
5. **Bubble Cluster (Gelembung Kelompok)**: Desain melingkar organik yang artistik dan dinamis.
6. **Bilateral Bracket (Kurung Bilateral)**: Cabang terbagi seimbang ke sisi kiri dan kanan dari pusat.
7. **Grid Network (Jaringan Kisi)**: Susunan matriks yang rapi dan terstruktur seperti kartu.`;

export const THEME_AND_STYLE_REPLY = `### 🎭 Tema Warna, Garis Penghubung & Bentuk Kartu:

Semua opsi kustomisasi visual dapat diatur di bilah **Tata Letak & Gaya**:

- **7 Tema Warna**:
  1. *Pastel*: Warna lembut yang nyaman di mata untuk sesi belajar lama.
  2. *Neon Dark*: Warna futuristik berkontras tinggi di atas kanvas gelap.
  3. *Sunset*: Gradasi hangat jingga, merah muda, dan ungu.
  4. *Corporate*: Nuansa biru profesional dan formal.
  5. *Emerald*: Kesegaran hijau zamrud alami.
  6. *Monochrome*: Minimalis hitam-putih yang bersih dan tajam.
  7. *My Version*: Tema kustom preferensi pengguna.

- **Gaya Garis Penghubung**:
  - **Bezier Curves**: Lengkungan halus dan dinamis.
  - **Straight**: Garis lurus minimalis.
  - **Angled / Orthogonal**: Garis siku-siku teknis.
  - **Dotted**: Garis titik-titik elegan.
  - **Animated Dashed**: Garis putus-putus yang bergerak aktif.

- **Bentuk Kartu Ide**:
  - Pilihan bentuk mencakup *Rounded*, *Pill (Kapsul)*, *Sharp (Kotak Tegas)*, *Oval*, *Hexagon (Segi Enam)*, dan *Circle (Lingkaran)*.

- **Mode Tampilan Website (Dark Mode vs Light Mode)**:
  - **Mode Gelap (Dark Mode)**: Bawaan sistem bernuansa cyberpunk hitam pekat dengan aksen neon cyan.
  - **Mode Terang (Light Mode)**: Latar cerah, bersih, dan kontras tinggi bernuansa slate/putih elegan untuk kenyamanan membaca di ruangan terang.
  - Dapat diubah melalui menu **SETTINGS > Tema Tampilan Website**.`;

export const EXPORT_REPLY = `### 💾 Cara Ekspor Mind Map ke Berbagai Format:

Di menu navigasi bagian atas (Header), klik tombol **"UNDUH"** untuk memilih 5 format yang disediakan:

1. **Dokumen PDF (Presentasi & Dokumentasi)**:
   - Menghasilkan dokumen PDF format Landscape A4 berkualitas tinggi. Halaman pertama menampilkan visual diagram mind map beresolusi tinggi, dan halaman berikutnya memuat dokumentasi hierarki struktur serta catatan cabang (notes).
2. **PNG (Gambar Resolusi Tinggi)**:
   - Menghasilkan file gambar siap pakai untuk presentasi, tugas, atau dibagikan ke media sosial.
3. **SVG (Vektor Berkualitas Penuh)**:
   - Gambar vektor matematis yang tidak akan pecah saat di-zoom atau dicetak dalam ukuran poster besar.
4. **JSON (Cadangan & Impor Ulang)**:
   - Menyimpan seluruh struktur peta, tema, catatan cabang, dan posisi kartu agar bisa diimpor kembali di masa depan.
5. **Markdown (.md)**:
   - Mengekspor struktur teks hierarkis berformat daftar poin (*bullet list*) yang cocok dibuka di aplikasi catatan seperti Notion atau Obsidian.`;

export const NOTES_AND_LINKS_REPLY = `### 📝 Menambahkan Catatan (Notes) & Tautan di Cabang:

Setiap cabang atau kartu pada mind map dapat menyimpan catatan detail dan tautan web:

1. **Membuka Catatan Kartu**:
   - Klik langsung ikon **Catatan (📝)** pada kartu di kanvas, atau
   - Buka **Editor Kartu** (klik ganda kartu) lalu pilih tombol **"Catatan Kartu"**.
2. **Menulis Catatan**:
   - Beri judul catatan dan isi penjelasannya. Anda bisa menambahkan lebih dari satu catatan per kartu.
3. **Pendeteksi Tautan Otomatis**:
   - Jika Anda menyisipkan URL (misalnya \`https://google.com\`), website akan otomatis mengenali tautan tersebut dan membuat tombol link langsung yang bisa diklik untuk membuka halaman web eksternal.`;

export const YOUTUBE_MUSIC_REPLY = `### 🎵 Pemutar Musik YouTube Latar Belakang:

Aplikasi ini dilengkapi pemutar musik terintegrasi untuk menemani Anda saat fokus berpikir:

1. **Memutar Musik**:
   - Buka menu **Pengaturan (ikon gerigi)** di header atas.
   - Gulir ke bagian **"Musik Latar Belakang YouTube"**.
   - Masukkan judul lagu dan tempelkan link YouTube (misal: lagu lofi, instrumental, atau ambient), lalu klik **"+ Tambah ke Playlist"**.
2. **Widget Pemutar Mengambang (Floating Player)**:
   - Terdapat pemutar musik mengambang di pojok kiri bawah kanvas.
   - Anda dapat menekan tombol **Putar/Jeda (Play/Pause)**, **Lagu Berikutnya/Sebelumnya**, dan mengatur **Volume**.
3. **Fitur Auto-Advance**:
   - Ketika sebuah lagu selesai, pemutar akan otomatis memutar lagu berikutnya dari daftar putar Anda!
   - Musik tetap berputar meskipun jendela pengaturan ditutup.`;

export const CANVAS_NAVIGATION_REPLY = `### 🔍 Navigasi & Interaksi pada Kanvas:

- **Geser Kanvas (Pan)**: Klik dan tahan area kosong pada kanvas, lalu geser mouse ke arah yang diinginkan.
- **Perbesar / Perkecil (Zoom)**: Putar roda mouse (*scroll wheel*) atau gunakan tombol kontrol zoom di pojok kanvas.
- **Pindahkan Kartu (Drag & Drop)**: Klik dan tahan kartu apa saja untuk memindahkan posisinya secara bebas.
- **Lipat / Sembunyikan Cabang (Collapse)**: Klik tombol lingkaran kecil bergaris minus **(-)** pada cabang untuk melipat sub-cabangnya. Klik tanda plus **(+)** untuk membukanya kembali.
- **Mode Kanvas Fokus (Layar Penuh Kanvas)**: Tekan tombol ikon **Maximize2** di pojok kanan atas kanvas untuk menyembunyikan panel dan fokus penuh pada kanvas secara edge-to-edge (pada perangkat tanpa Fullscreen API, mode ini berjalan sebagai layar penuh in-app).
- **Layar Penuh Seluruh Halaman**: Tekan tombol **FULLSCREEN** di header untuk membuat seluruh halaman masuk mode layar penuh browser — header, panel input, dan kanvas tetap tampil dan dapat dipakai seperti biasa.
- **Fit Kanvas Otomatis**: Tekan tombol *Pusatkan Tampilan* di kontrol pojok kanan bawah kanvas agar seluruh mind map terpusat rapi.
- **Urungkan & Ulangi**: Gunakan tombol panah melengkung **Undo / Redo** di bilah bawah kanvas untuk membatalkan/mengulang perubahan.`;

export const KEYBOARD_SHORTCUTS_REPLY = `### ⌨️ Tombol Pintasan Keyboard (Shortcuts):

- **Ctrl + Z** (atau Cmd + Z): Membatalkan perubahan terakhir (Undo).
- **Ctrl + Y** atau **Ctrl + Shift + Z**: Mengulangi perubahan yang dibatalkan (Redo).
- **F / Tombol Fullscreen**: Mengaktifkan/menonaktifkan mode layar penuh kanvas.
- **Escape (Esc)**: Menutup modal, jendela popup, atau keluar dari mode layar penuh.
- **Ctrl + Enter** (atau Cmd + Enter): Pada input teks cepat untuk langsung membuat atau menambahkan cabang.
- **Enter**: Di modal editor kartu untuk menyimpan perubahan secara cepat.
- **Klik Ganda pada Kartu**: Membuka jendela editor kartu langsung di kanvas.
- **Scroll Mouse**: Memperbesar (*zoom in*) atau memperkecil (*zoom out*) kanvas.`;

export const HISTORY_AND_FOLDERS_REPLY = `### 📂 Riwayat Dokumen & Pengelolaan Folder:

1. **Menyimpan Mind Map**:
   - Klik tombol **"Simpan"** di header atas untuk menyimpan peta pikiran saat ini ke penyimpanan lokal browser (*localStorage*).
2. **Membuka Riwayat (History)**:
   - Klik tombol **"Riwayat"** di header atas untuk membuka daftar seluruh mind map yang pernah Anda buat.
   - Anda bisa memuat ulang (*load*), mengganti folder, mengekspor, atau menghapus riwayat dokumen.
3. **Folder Dokumen**:
   - Tersedia kategori folder **"Umum"** dan **"Spesifik"** untuk memisahkan proyek kerja/teknis dan catatan umum.`;

export const PWA_AND_OFFLINE_REPLY = `### 🌐 Mode Offline, PWA & Penanganan Pembaruan (Update Handler):

Website *My Hippocampus* didesain sebagai Progressive Web App (PWA) lengkap:

1. **Bekerja 100% Offline**:
   - Semua fungsi inti (membuat mind map, mengubah layout/tema, mengedit catatan cabang, menyimpan ke riwayat Memory Card, serta ekspor PDF/PNG/SVG/JSON) berjalan normal tanpa kuota internet.
2. **Penanganan Pembaruan Otomatis (Update Handler)**:
   - Jika ada pembaruan kode atau penambahan fitur baru pada website di masa mendatang, Service Worker akan otomatis mendeteksinya di latar belakang saat Anda terhubung ke internet.
   - Muncul banner mengambang **"Pembaruan Versi Tersedia!"** dengan tombol **"Perbarui Sekarang"**.
   - Menekan tombol tersebut akan memuat versi terbaru ke cache secara mulus tanpa menghilangkan data mind map Anda di perangkat.
   - Anda juga bisa mengecek secara manual melalui tombol **"Periksa Pembaruan"** di menu Pengaturan.
3. **Cara Memasang (Install) ke Perangkat**:
   - **Di Desktop (Chrome / Edge / Brave)**: Klik tombol "Pasang Aplikasi" di menu Pengaturan atau ikon install di bilah alamat browser.
   - **Di Smartphone (Android / iOS)**: Buka menu browser lalu pilih **"Tambahkan ke Layar Utama" (Add to Home Screen)**. Aplikasi akan berjalan seperti aplikasi asli tanpa bilah peramban!`;

export const DEFAULT_GUIDE_REPLY = `Halo! Saya adalah **Bot Panduan Website My Hippocampus**. Saya siap membantu menjawab pertanyaan Anda tentang cara menggunakan seluruh fitur di website ini.

Beberapa panduan yang sering ditanyakan:
1. **Cara Membuat Mind Map**: Isi judul dan daftar cabang di Panel Input, pilih strategi, lalu klik "Buat Mind Map".
2. **Pilihan Tata Letak**: Tersedia 7 layout (Radial, Horizontal Tree, Vertical Tree, Fishbone, Bubble Cluster, Bilateral Bracket, Grid Network).
3. **Tema & Gaya**: Pilih salah satu dari 7 tema warna, sesuaikan garis penghubung dan bentuk kartu di bilah Tata Letak.
4. **Ekspor File**: Simpan hasil karya Anda dalam format Dokumen PDF, PNG, SVG, JSON, atau Markdown.
5. **Catatan Kartu & Tautan**: Klik ikon catatan di setiap cabang untuk menyisipkan ringkasan dan tautan web.
6. **Musik YouTube**: Putar playlist musik latar di pemutar mengambang pojok kanvas.

Ada fitur spesifik yang ingin Anda ketahui cara penggunaannya?`;
