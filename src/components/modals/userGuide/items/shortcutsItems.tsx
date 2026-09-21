import React from "react";
import { Keyboard, MousePointer, Touchpad, Zap, RotateCcw } from "lucide-react";
import { GuideItem } from "../types";

export const SHORTCUTS_GUIDE_ITEMS: GuideItem[] = [
  {
    id: "shortcut-undo-redo",
    category: "shortcuts",
    title: "Urungkan & Ulangi Perubahan (Undo & Redo)",
    badge: "Pintasan Riwayat",
    icon: <RotateCcw className="w-4 h-4 text-white" />,
    summary: "Membatalkan kekeliruan atau mengulangi kembali tindakan tanpa takut kehilangan susunan ide.",
    steps: [
      "Urungkan (Undo): Tekan kombinasi tombol 'Ctrl + Z' (atau 'Cmd + Z' di Mac) pada keyboard.",
      "Ulangi (Redo): Tekan kombinasi tombol 'Ctrl + Y' atau 'Ctrl + Shift + Z' (atau 'Cmd + Shift + Z' di Mac).",
      "Tombol Layar: Anda juga bisa mengklik tombol panah melengkung Undo dan Redo langsung di bilah bawah kanvas.",
      "Riwayat ini mencakup: penambahan cabang, perubahan teks judul, pemindahan posisi kotak, dan perubahan tema.",
    ],
    tips: "Gunakan Undo jika Anda tidak sengaja menggeser kotak atau menghapus cabang ide penting.",
  },
  {
    id: "shortcut-canvas-nav",
    category: "shortcuts",
    title: "Navigasi Cepat Kanvas (Mouse & Trackpad)",
    badge: "Navigasi",
    icon: <MousePointer className="w-4 h-4 text-white" />,
    summary: "Cara paling cepat dan nyaman menggerakkan area pandangan dan memperbesar diagram.",
    steps: [
      "Geser Kanvas (Pan): Klik & tahan di bagian kanvas yang kosong, lalu seret mouse ke arah mana pun.",
      "Perbesar / Perkecil (Zoom): Putar roda tengah mouse (scroll wheel) ke atas/bawah. Tampilan akan membesar tepat ke arah kursor.",
      "Pusatkan Tampilan (Fit to Screen): Klik tombol bingkai kotak di pojok kanan bawah agar seluruh mind map pas terlihat utuh.",
      "Reset Skala 100%: Klik tombol persentase di pojok kanan bawah untuk mengembalikan zoom ke skala awal normal.",
    ],
    tips: "Gunakan tombol Pusatkan Tampilan setiap kali Anda merasa kehilangan posisi setelah menggeser kanvas terlalu jauh.",
  },
  {
    id: "shortcut-touch-gestures",
    category: "shortcuts",
    title: "Gerakan Layar Sentuh di HP & Tablet",
    badge: "Sentuh (Touch)",
    icon: <Touchpad className="w-4 h-4 text-white" />,
    summary: "Mengendalikan mind map secara intuitif menggunakan jari pada layar sentuh.",
    steps: [
      "Geser Layar: Geser satu atau dua jari di area kosong kanvas untuk menggerakkan diagram.",
      "Cubit Layar (Pinch to Zoom): Satukan atau renggangkan dua jari untuk memperkecil atau memperbesar tampilan kanvas.",
      "Edit Kotak: Ketuk dua kali (double tap) dengan cepat pada kotak ide mana saja untuk membuka jendela pengeditan.",
      "Geser Kotak Bebas: Sentuh dan tahan sebuah kotak ide, lalu seret ke tempat baru yang diinginkan.",
    ],
    tips: "Tampilan formulir di HP dapat dilipat atau digeser agar area gambar diagram menjadi lebih leluasa.",
  },
  {
    id: "shortcut-keyboard-fast",
    category: "shortcuts",
    title: "Pintasan Keyboard untuk Pengetikan Cepat",
    badge: "Keyboard",
    icon: <Keyboard className="w-4 h-4 text-white" />,
    summary: "Mempercepat proses pengisian ide tanpa harus sering memindahkan tangan ke mouse.",
    steps: [
      "Tambah Cepat: Ketik nama di kolom 'Tambah Cepat' lalu tekan tombol Enter pada keyboard untuk langsung memasukkannya ke daftar.",
      "Masukkan Banyak Sekaligus: Tempelkan (Paste) teks beberapa baris ke dalam kotak daftar nama, aplikasi akan membaginya otomatis per baris.",
      "Tutup Jendela Cepat: Tekan tombol Escape (Esc) pada keyboard untuk menutup jendela modal atau panduan seketika.",
    ],
    tips: "Anda bisa menempelkan daftar isi dari dokumen Word atau catatan Google Docs langsung ke kotak nama.",
  },
  {
    id: "shortcut-workflow-best",
    category: "shortcuts",
    title: "Alur Kerja Paling Efektif",
    badge: "Alur Praktis",
    icon: <Zap className="w-4 h-4 text-white" />,
    summary: "Urutan kerja terbaik agar pembuatan peta pikiran Anda rapi, cepat, dan terorganisir.",
    steps: [
      "1. Mulai dari Topik Utama: Tentukan ide inti dan pilih emoji yang mewakili tema.",
      "2. Masukkan Semua Ide Dulu: Jangan khawatirkan tata letak terlebih dahulu; masukkan semua poin dan nama di formulir.",
      "3. Klik Buat Mind Map: Biarkan aplikasi menyusun cabang dan ranting otomatis.",
      "4. Kustomisasi & Sentuhan Akhir: Sesuaikan bentuk tata letak, warna tema, atau geser kotak tertentu.",
      "5. Klik SIMPAN: Amankan hasil kerja Anda ke Memory Card sebelum menutup browser.",
    ],
    tips: "Simpan peta pikiran Anda secara berkala dengan mengklik tombol SIMPAN di bar atas.",
  },
];
