import React from "react";
import { Network, Spline, Palette, Shapes } from "lucide-react";
import { GuideItem } from "../types";

export const THEMES_GUIDE_ITEMS: GuideItem[] = [
  {
    id: "theme-layout-models",
    category: "themes",
    title: "7 Pilihan Model Susunan Diagram (Tata Letak)",
    badge: "Bentuk Susunan",
    icon: <Network className="w-4 h-4 text-white" />,
    summary: "Mengubah bentuk pola susunan diagram hanya dengan sekali klik tanpa merusak isi ide Anda.",
    steps: [
      "Buka menu pilihan susunan di bagian bawah kanvas gambar.",
      "Pilih salah satu dari 7 gaya susunan yang tersedia:",
      "1. Melingkar (Radial): Memancar ke segala arah mengelilingi pusat seperti roda sepeda.",
      "2. Kanan - Kiri: Membagi cabang secara seimbang ke arah kanan dan kiri.",
      "3. Pohon Menyamping (Horizontal): Alur diagram mengalir rapi dari kiri ke kanan.",
      "4. Pohon Menurun (Vertikal / Bagan): Mengalir dari atas ke bawah seperti bagan struktur organisasi.",
      "5. Cincin Konsentris: Berputar dalam lingkaran bertingkat mengitari ide utama.",
      "6. Pusaran Spiral: Penataan artistik melingkar menyerupai pusaran galaksi.",
      "7. Kotak Rapat (Grid): Penataan modular kotak-kotak rapi yang sangat hemat tempat.",
    ],
  },
  {
    id: "theme-connector-styles",
    category: "themes",
    title: "4 Pilihan Garis Penghubung Antar Cabang",
    badge: "Gaya Garis",
    icon: <Spline className="w-4 h-4 text-white" />,
    summary: "Memilih bentuk garis yang menghubungkan antara topik pusat dengan cabang-cabangnya.",
    steps: [
      "Lengkung Halus: Garis melengkung luwes yang modern, lembut, dan elegan.",
      "Garis Lurus: Garis lurus sederhana yang tegas dan langsung ke sasaran.",
      "Garis Patah Siku: Garis bersudut tegak 90 derajat rapi seperti bagan resmi kantor.",
      "Busur Lembut: Garis membusur halus dengan sudut yang tumpul dan bersahabat.",
    ],
  },
  {
    id: "theme-color-palettes",
    category: "themes",
    title: "Pilihan Warna: Mode Gelap & Mode Terang",
    badge: "Warna Tampilan",
    icon: <Palette className="w-4 h-4 text-white" />,
    summary: "Koleksi warna bernuansa profesional yang nyaman di mata dan mudah dibaca.",
    steps: [
      "Koleksi Mode Gelap: Sangat nyaman dipakai berlama-lama di ruangan temaram tanpa membuat mata lelah (Cyberpunk, Deep Space, Emerald, Midnight Purple, dll).",
      "Koleksi Mode Terang: Nuansa putih bersih dan cerah yang sangat pas untuk dicetak atau dipresentasikan di proyektor (Clean White, Warm Paper, Soft Pastel, Corporate Blue, dll).",
      "Setiap pilihan tema otomatis memberikan warna cabang bertingkat yang serasi dan tulisan yang kontras jelas.",
    ],
  },
  {
    id: "theme-node-shapes",
    category: "themes",
    title: "Pilihan Bentuk Kotak Ide",
    badge: "Bentuk Kotak",
    icon: <Shapes className="w-4 h-4 text-white" />,
    summary: "Menentukan bentuk bingkai untuk kotak-kotak ide pada diagram Anda.",
    steps: [
      "Kapsul Lonjong: Bentuk lonjong dengan ujung bulat halus yang modern.",
      "Kotak Bersudut Halus: Bentuk persegi dengan sudut melengkung yang rapi.",
      "Lingkaran: Bentuk bulat penuh klasik.",
      "Segienam (Hexagon): Bentuk segienam geometris berkesan cerdas dan futuristik.",
    ],
  },
];
