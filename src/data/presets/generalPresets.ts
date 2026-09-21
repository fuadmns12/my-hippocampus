import { PresetTemplate } from "../../types";

export const class10aPreset: PresetTemplate = {
  id: "class-10a",
  title: "Daftar Siswa Kelas 10-A IPA",
  subtitle: "Pengelompokan Tugas & Kepengurusan Kelas",
  folder: "Umum",
  suggestedLayout: "bilateral-bracket",
  suggestedTheme: "sunset",
  suggestedConnectorStyle: "bezier",
  suggestedNodeShape: "pill",
  suggestedGroupingStrategy: "alphabetical",
  customConfig: {
    alphabetMode: "range",
    alphabetRanges: "A-G, H-M, N-S, T-Z",
    alphabetNumGroups: 4,
    alphabetIncludeOthers: true,
  },
  names: [
    "Ahmad Fauzi",
    "Bintang Ramadhan",
    "Citra Kirana",
    "Daffa Malik",
    "Elisa Fitri",
    "Farhan Hakim",
    "Grace Natalie",
    "Hafiz Syahputra",
    "Indah Permata",
    "Joko Susilo",
    "Keisha Aurelia",
    "Lukman Hakim",
    "Mutiara Sari",
    "Naufal Abiyyu",
    "Olivia Tan",
    "Pratama Arhan",
    "Qisty Zahra",
    "Rafi Ahmad",
  ],
  rootNotes: [
    {
      id: "note-cls-root-1",
      title: "Pedoman Akademik & Kegiatan Kelas 10-A",
      content:
        "Tahun Pelajaran 2026/2027. Wali Kelas: Dra. Nurhasanah, M.Pd. Jadwal belajar, praktikum laboratorium sains, serta kegiatan ekstrakurikuler.",
      createdAt: "2026-09-01T07:30:00.000Z",
    },
  ],
  nodeNotes: {
    "Ahmad Fauzi": [
      {
        id: "note-cls-ahmad-1",
        title: "Tugas Pokok: Ketua Kelas 10-A",
        content:
          "Memimpin ketertiban kelas, perwakilan dalam sidang perwakilan kelas OSIS, serta narahubung utama antara guru bidang studi dan seluruh siswa.",
        createdAt: "2026-09-02T08:00:00.000Z",
      },
    ],
    "Bintang Ramadhan": [
      {
        id: "note-cls-bintang-1",
        title: "Tugas: Wakil Ketua & Koordinator Piket",
        content:
          "Mengawasi pelaksanaan piket kebersihan harian ruangan kelas dan mengkoordinasi persiapan upacara bendera setiap hari Senin.",
        createdAt: "2026-09-02T08:15:00.000Z",
      },
    ],
    "Citra Kirana": [
      {
        id: "note-cls-citra-1",
        title: "Tugas: Sekretaris I",
        content:
          "Mencatat rekapitulasi presensi harian, agenda jadwal ulangan harian, serta inventaris modul pembelajaran perpustakaan kelas.",
        createdAt: "2026-09-02T08:30:00.000Z",
      },
    ],
    "Daffa Malik": [
      {
        id: "note-cls-daffa-1",
        title: "Tugas: Bendahara Kelas",
        content:
          "Mengelola iuran kas mingguan kelas sebesar Rp 5.000/siswa secara transparan dengan pembukuan digital untuk kegiatan sosial dan keperluan kelas.",
        createdAt: "2026-09-02T08:45:00.000Z",
      },
    ],
  },
};

export const eventCommitteePreset: PresetTemplate = {
  id: "event-committee",
  title: "Panitia Festival Seni & Musik 2026",
  subtitle: "Daftar Penanggung Jawab Divisi Acara",
  folder: "Umum",
  suggestedLayout: "bubble-cluster",
  suggestedTheme: "corporate",
  suggestedConnectorStyle: "dotted",
  suggestedNodeShape: "circle",
  suggestedGroupingStrategy: "balanced-spokes",
  customConfig: {
    balancedBranchCount: 3,
    balancedBranchPrefix: "Divisi",
    balancedDistributionMode: "chunk",
  },
  names: [
    "Koor Acara - Rizky",
    "Koor Konsumsi - Tari",
    "Koor Humas - Bagus",
    "Koor Perlengkapan - Dimas",
    "Koor Keamanan - Yudi",
    "Koor Dokumentasi - Siska",
    "Sponsor & Funding - Nadia",
    "Stage Manager - Aris",
    "Ticketing - Vania",
    "Desain Grafis - Gilang",
  ],
  rootNotes: [
    {
      id: "note-ev-root-1",
      title: "Master Plan Pelaksanaan Festival Seni 2026",
      content:
        "Waktu: 18 - 20 Desember 2026 di Lapangan Terbuka Graha Budaya. Mengusung tema 'Harmoni Nusantara dalam Gelombang Kreativitas Modern'.",
      createdAt: "2026-09-01T09:00:00.000Z",
    },
  ],
  nodeNotes: {
    "Koor Acara - Rizky": [
      {
        id: "note-ev-rizky-1",
        title: "Rundown & Kurasi Bintang Tamu",
        content:
          "Mengatur durasi penampilan 15 pengisi acara, soundcheck musisi mulai pukul 13.00 WIB, dan memastikan transisi antar panggung berjalan mulus.",
        createdAt: "2026-09-02T10:00:00.000Z",
      },
    ],
    "Koor Keamanan - Yudi": [
      {
        id: "note-ev-yudi-1",
        title: "Protap Keamanan & Evakuasi Darurat",
        content:
          "Menyiapkan 18 pos pengawasan, pemeriksaan tiket dan barang bawaan pengunjung di pintu masuk, serta koordinasi dengan posko medis PMI.",
        createdAt: "2026-09-02T10:30:00.000Z",
      },
    ],
    "Stage Manager - Aris": [
      {
        id: "note-ev-aris-1",
        title: "Teknis Panggung, Tata Suara & Lighting",
        content:
          "Menyediakan tata suara 25.000 watt, tata lampu panggung intelligent moving head, serta 2 genset cadangan berkapasitas 80 KVA.",
        createdAt: "2026-09-02T11:00:00.000Z",
      },
    ],
    "Sponsor & Funding - Nadia": [
      {
        id: "note-ev-nadia-1",
        title: "Target Pendanaan & Hubungan Sponsor",
        content:
          "Mengelola kontrak kemitraan dengan 8 brand sponsor platinum dan memonitor aktivasi booth promosi di area pameran.",
        createdAt: "2026-09-02T11:30:00.000Z",
      },
    ],
  },
};

export const GENERAL_PRESETS: PresetTemplate[] = [
  class10aPreset,
  eventCommitteePreset,
];
