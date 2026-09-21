import React from "react";
import { Move, Minimize2, Pencil, FileText } from "lucide-react";
import { GuideItem } from "../types";

export const NODES_GUIDE_ITEMS: GuideItem[] = [
  {
    id: "node-drag-drop",
    category: "nodes",
    title: "Menggeser Posisi Kotak Ide Secara Bebas",
    badge: "Atur Posisi",
    icon: <Move className="w-4 h-4 text-white" />,
    summary: "Memindahkan posisi kotak cabang mana saja di kanvas sesuai tata letak yang Anda sukai.",
    steps: [
      "Arahkan kursor ke kotak ide yang ingin dipindahkan.",
      "Klik dan tahan kotak tersebut, lalu geser ke posisi baru yang Anda inginkan.",
      "Garis penghubung akan otomatis memanjang dan meliuk lentur mengikuti letak baru kotak tanpa terputus.",
    ],
    tips: "Posisi baru yang Anda tentukan akan otomatis tersimpan saat Anda menekan tombol Simpan!",
  },
  {
    id: "node-fold-expand",
    category: "nodes",
    title: "Melipat & Membuka Ranting Cabang (Tanda - dan +)",
    badge: "Kerapian",
    icon: <Minimize2 className="w-4 h-4 text-white" />,
    summary: "Menyembunyikan sementara ranting-ranting kecil agar layar terlihat lebih rapi dan fokus.",
    steps: [
      "Perhatikan bulatan kecil bertanda minus (-) pada cabang yang memiliki ranting di bawahnya.",
      "Klik bulatan tersebut untuk melipat (menyembunyikan) seluruh anak ranting di bawah cabang itu.",
      "Tandanya akan berubah menjadi plus (+); klik kembali kapan saja untuk membuka rantingnya lagi.",
    ],
    tips: "Fitur ini sangat bagus saat Anda sedang presentasi agar pendengar bisa fokus pada topik utama terlebih dahulu.",
  },
  {
    id: "node-editor-modal",
    category: "nodes",
    title: "Mengedit Kotak Ide: Ganti Tulisan, Emoji & Tambah Cabang",
    badge: "Ubah Isi",
    icon: <Pencil className="w-4 h-4 text-white" />,
    summary: "Mengubah rincian kotak ide tertentu secara langsung dan mudah.",
    steps: [
      "Klik dua kali pada kotak ide mana saja, atau klik ikon pensil kecil di sampingnya.",
      "Jendela pengeditan akan muncul:",
      "Ganti Judul: Ubah tulisan kotak sesuai kebutuhan Anda.",
      "Ganti Emoji: Pilih simbol emoji baru atau hapus emoji jika tidak diinginkan.",
      "Ubah Warna Kotak: Pilih palet warna siap pakai (seperti Indigo, Cyan, Emerald, Amber) atau tentukan sendiri warna latar dan garis tepi.",
      "Tambah Ranting Baru: Masukkan nama untuk membuat cabang baru di bawah kotak ini.",
      "Tambah Banyak Sekaligus: Tempelkan beberapa baris nama untuk membuat banyak ranting dalam satu kali klik.",
      "Hapus Kotak: Menghapus kotak tersebut beserta seluruh ranting di bawahnya jika sudah tidak diperlukan.",
    ],
  },
  {
    id: "node-notes-feature",
    category: "nodes",
    title: "Catatan Tambahan di Setiap Kotak (Memo Penjelasan)",
    badge: "Catatan Detail",
    icon: <FileText className="w-4 h-4 text-white" />,
    summary: "Menempelkan catatan penjelasan panjang, daftar checklist, atau tautan link pada cabang tertentu.",
    steps: [
      "Arahkan kursor ke kotak ide lalu klik ikon kertas catatan kecil.",
      "Jendela 'Catatan Tambahan' akan terbuka.",
      "Tuliskan penjelasan lengkap, daftar tugas, atau keterangan tambahan yang Anda inginkan.",
      "Klik 'Simpan Catatan'. Kotak yang memiliki catatan akan ditandai dengan ikon kertas kecil sebagai pengingat.",
    ],
    tips: "Gunakan catatan ini untuk menyimpan keterangan mendalam tanpa membuat gambar diagram menjadi penuh sesak. Setiap tautan web (link seperti https://...) yang Anda tuliskan akan otomatis terdeteksi dan dapat langsung diklik untuk dibuka di tab baru.",
  },
];
