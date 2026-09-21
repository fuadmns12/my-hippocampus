import React from "react";
import { Play, Folder, Headphones } from "lucide-react";
import { GuideItem } from "../types";

export const QUICKSTART_GUIDE_ITEMS: GuideItem[] = [
  {
    id: "quick-start",
    category: "quickstart",
    title: "3 Langkah Mudah Membuat Peta Pikiran",
    badge: "Mulai Di Sini",
    icon: <Play className="w-4 h-4 text-white" />,
    summary: "Cara paling cepat dan praktis untuk membuat gambar peta pikiran pertama Anda dari nol.",
    steps: [
      "1. Ketik Judul atau Topik Utama pada kotak di panel kiri (misal: 'Rencana Belajar Ujian') lalu pilih ikon emoji yang cocok.",
      "2. Masukkan daftar nama, poin ide, atau sub-topik pada kotak teks di bawahnya (cukup pisahkan dengan tombol Enter atau koma).",
      "3. Klik tombol 'Buat Mind Map' berwarna biru kehijauan. Diagram Anda akan langsung tersusun rapi otomatis di layar!",
    ],
    tips: "Gunakan tombol 'SIMPAN' di bilah atas setelah diagram selesai dibuat agar tersimpan aman di perangkat Anda.",
  },
  {
    id: "quick-templates",
    category: "quickstart",
    title: "Memuat Contoh Siap Pakai (Template Dataset)",
    badge: "Contoh Instan",
    icon: <Folder className="w-4 h-4 text-white" />,
    summary: "Mencoba dan mempelajari beragam contoh diagram siap pakai tanpa harus mengetik dari nol.",
    steps: [
      "1. Klik tombol 'Contoh Dataset' (atau 'Template' pada layar HP) di bilah navigasi atas.",
      "2. Pilih tab 'Umum' (seperti Rencana Proyek, Manajemen Waktu) atau 'Spesifik' (seperti Anatomi, Alur Kerja Organisasi).",
      "3. Klik contoh yang Anda sukai untuk langsung menampilkannya di kanvas kerja.",
      "4. Anda bebas mengedit teks, menambah cabang baru, atau mengubah warnanya sesuai kebutuhan.",
    ],
    tips: "Pilihan terbaik jika Anda ingin membuat presentasi atau tugas dengan cepat.",
  },
  {
    id: "quick-music-and-bot",
    category: "quickstart",
    title: "Musik Relaksasi Fokus & Bot Panduan Cerdas",
    badge: "Fitur Pendukung",
    icon: <Headphones className="w-4 h-4 text-white" />,
    summary: "Dua alat pendukung nyaman untuk menemani Anda berpikir dan menjawab pertanyaan cara pakai aplikasi.",
    steps: [
      "1. Pemutar Musik YouTube (Pojok Kiri Bawah): Widget mengambang untuk memutar alunan instrumen/lo-fi yang tenang saat memetakan ide. Anda juga bisa menambahkan tautan lagu YouTube sendiri di menu Pengaturan.",
      "2. Bot Panduan Cerdas (Pojok Kanan Bawah): Tombol bulat avatar 'Bot Panduan' siap Anda tanya tentang cara pakai fitur apa saja kapan pun secara instan dan offline.",
      "3. Pengaturan Audio: Atur volume musik langsung dari tombol melayang di pojok kiri bawah tanpa mengganggu tampilan kanvas.",
    ],
    tips: "Gunakan musik instrumental saat curah pendapat untuk meningkatkan daya ingat dan konsentrasi belajar.",
  },
];

