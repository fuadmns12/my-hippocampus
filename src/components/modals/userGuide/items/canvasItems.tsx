import React from "react";
import { Move, Scan, Layers, ChevronUp, Network, Maximize } from "lucide-react";
import { GuideItem } from "../types";

export const CANVAS_GUIDE_ITEMS: GuideItem[] = [
  {
    id: "canvas-fullscreen",
    category: "canvas",
    title: "Mode Layar Penuh (Fullscreen)",
    badge: "Layar Penuh",
    icon: <Maximize className="w-4 h-4 text-white" />,
    summary: "Membuka kanvas selebar layar penuh tanpa terganggu bilah peramban atau menu luar.",
    steps: [
      "1. Klik tombol 'Layar Penuh' (ikon perbesar sudut) di pojok kanan atas kanvas.",
      "2. Seluruh kanvas akan langsung membentang memenuhi 100% layar perangkat Anda secara edge-to-edge.",
      "3. Sangat ideal untuk presentasi tugas, sesi fokus mendalam di laptop, ataupun penggunaan di HP posisi landscape.",
      "4. Untuk kembali ke tampilan normal, klik tombol yang sama di pojok kanan atas atau tekan tombol Escape (Esc) pada keyboard.",
    ],
    tips: "Di HP landscape, mode layar penuh otomatis memaksimalkan ruang kerja dan menyembunyikan widget luar agar fokus.",
  },
  {
    id: "canvas-pan-zoom",
    category: "canvas",
    title: "Menggeser & Memperbesar Tampilan Kanvas",
    badge: "Gerakan Layar",
    icon: <Move className="w-4 h-4 text-white" />,
    summary: "Menggerakkan sudut pandang kanvas seluas yang Anda butuhkan tanpa batas tepi.",
    steps: [
      "1. Menggeser Layar: Klik dan tahan mouse di bagian kanvas yang kosong, lalu seret ke arah mana saja.",
      "2. Memperbesar/Memperkecil (Mouse): Putar roda tengah mouse ke atas untuk zoom in dan ke bawah untuk zoom out.",
      "3. Layar Sentuh (HP / Tablet): Gunakan gerakan mencubit dua jari untuk memperkecil atau renggangkan untuk memperbesar.",
      "4. Fokus Perbesaran: Zoom otomatis mengarah ke titik kursor Anda berada.",
    ],
  },
  {
    id: "canvas-controls-bar",
    category: "canvas",
    title: "Tombol Kendali Cepat di Pojok Bawah",
    badge: "Alat Layar",
    icon: <Scan className="w-4 h-4 text-white" />,
    summary: "Sekumpulan tombol praktis di pojok kanan bawah kanvas untuk mengatur tampilan dan riwayat.",
    steps: [
      "1. Urungkan & Ulangi (Undo / Redo): Tombol panah melengkung untuk membatalkan atau mengulang tindakan terakhir.",
      "2. Tampilkan/Sembunyikan Batas Cabang: Tombol garis putus-putus untuk melihat gelembung wilayah kelompok cabang.",
      "3. Reset Posisi Geser: Mengembalikan semua kotak yang digeser kembali ke susunan geometris simetris semula.",
      "4. Pusatkan Tampilan (Ikon Bingkai Kotak): Menyesuaikan posisi zoom agar seluruh diagram terlihat pas di tengah layar.",
      "5. Tombol Plus (+) & Minus (-): Memperbesar atau memperkecil tampilan langkah demi langkah.",
      "6. Tombol 100%: Mengembalikan skala tampilan tepat ke ukuran normal standar.",
      "7. Bersihkan Kanvas (Ikon Tempat Sampah): Mengosongkan kanvas kerja dengan dialog konfirmasi aman.",
    ],
  },
  {
    id: "canvas-header-collapse",
    category: "canvas",
    title: "Melipat Menu Atas (Memperluas Kanvas)",
    badge: "Layar Luas",
    icon: <ChevronUp className="w-4 h-4 text-white" />,
    summary: "Menyembunyikan sementara bilah atas agar ruang gambar diagram menjadi jauh lebih luas.",
    steps: [
      "1. Klik tab panah kecil yang menggantung di bawah garis menu atas.",
      "2. Bilah navigasi atas akan melipat ke atas sehingga kanvas tampil maksimal.",
      "3. Klik kembali tab panah tersebut di bagian atas layar untuk memunculkan kembali menu.",
    ],
  },
  {
    id: "canvas-switcher-root",
    category: "canvas",
    title: "Pindah Fokus Topik (Banyak Mind Map)",
    badge: "Banyak Topik",
    icon: <Network className="w-4 h-4 text-white" />,
    summary: "Berpindah pandangan seketika jika Anda membuat beberapa diagram di kanvas yang sama.",
    steps: [
      "1. Jika terdapat lebih dari satu mind map di kanvas, menu pilihan topik akan aktif di samping logo.",
      "2. Klik menu pilihan untuk melihat daftar semua judul mind map yang ada.",
      "3. Pilih judul yang diinginkan: kanvas akan otomatis bergeser dan menyorot topik tersebut.",
    ],
  },
  {
    id: "canvas-tab-outline",
    category: "canvas",
    title: "Beralih Mode: Tab 'Kanvas' vs 'Daftar Teks (Outline)'",
    badge: "Pilihan Tampilan",
    icon: <Layers className="w-4 h-4 text-white" />,
    summary: "Melihat ide dalam format grafis bercabang atau format tulisan daftar berurutan.",
    steps: [
      "1. Tab 'Kanvas': Menampilkan diagram grafis bercabang warna-warni yang interaktif dan fleksibel.",
      "2. Tab 'Outline': Menampilkan tulisan daftar bertingkat seperti daftar isi buku, sangat nyaman untuk dicatat atau dibaca cepat.",
    ],
  },
];
