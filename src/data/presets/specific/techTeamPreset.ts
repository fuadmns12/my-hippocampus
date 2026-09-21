import { PresetTemplate } from "../../../types";

export const techTeamPreset: PresetTemplate = {
  id: "tech-team",
  title: "Tim Developer & Desain App TechCorp",
  subtitle: "Struktur Organisasi Tim Produk Digital",
  folder: "Spesifik",
  suggestedLayout: "radial",
  suggestedTheme: "pastel",
  suggestedConnectorStyle: "animated-dashed",
  suggestedNodeShape: "pill",
  suggestedGroupingStrategy: "balanced-spokes",
  customConfig: {
    balancedBranchCount: 4,
    balancedBranchPrefix: "Squad",
    balancedDistributionMode: "chunk",
  },
  names: [
    "Budi Santoso",
    "Siti Rahma",
    "Andi Wijaya",
    "Dewi Lestari",
    "Rizal Prasetyo",
    "Fani Nurhaliza",
    "Agus Kurniawan",
    "Maya Putri",
    "Hendra Pratama",
    "Nina Zulaikha",
    "Eko Supriyanto",
    "Rina Kartika",
    "Dian Permana",
    "Gita Gutawa",
    "Ferry Irawan",
    "Tania Safitri",
  ],
  rootNotes: [
    {
      id: "note-tt-root-1",
      title: "Sprint Q4 & Sasaran Rilis V2",
      content:
        "Target peluncuran versi 2.0 pada akhir kuartal ini. Fokus utama mencakup: performa rendering 60fps untuk kanvas node interaktif, integrasi sistem catatan markdown kaya, dan responsivitas layout penuh tepi ke tepi.",
      createdAt: "2026-09-01T08:30:00.000Z",
    },
    {
      id: "note-tt-root-2",
      title: "Prosedur Code Review & Standar QA",
      content:
        "1. Setiap Pull Request wajib ditinjau minimal oleh 2 engineer.\n2. Unit test coverage wajib dipertahankan di atas 85%.\n3. Linting TypeScript dan build test harus berstatus hijau sebelum merge ke branch main.",
      createdAt: "2026-09-02T10:15:00.000Z",
    },
  ],
  nodeNotes: {
    "Budi Santoso": [
      {
        id: "note-tt-budi-1",
        title: "Tugas Pokok: Tech Lead Frontend",
        content:
          "Bertanggung jawab atas arsitektur React, optimalisasi virtual rendering SVG kanvas, serta koordinasi teknis bersama tim design system.",
        createdAt: "2026-09-02T09:00:00.000Z",
      },
    ],
    "Siti Rahma": [
      {
        id: "note-tt-siti-1",
        title: "Spesialisasi: Lead UI/UX Designer",
        content:
          "Merancang wireframe, prototype Figma, palet warna (Cyber Neon, Pastel Aurora, Sunset), serta pengujian ergonomi antarmuka pengguna.",
        createdAt: "2026-09-02T09:30:00.000Z",
      },
    ],
    "Andi Wijaya": [
      {
        id: "note-tt-andi-1",
        title: "Peran: Senior Backend Engineer",
        content:
          "Mengembangkan API endpoint RESTful, manajemen autentikasi sesi token, serta optimasi query database untuk pemuatan dataset besar.",
        createdAt: "2026-09-02T11:00:00.000Z",
      },
    ],
    "Dewi Lestari": [
      {
        id: "note-tt-dewi-1",
        title: "Peran: Lead Quality Assurance (QA)",
        content:
          "Menyusun skenario pengujian E2E otomatis, load testing kanvas interaktif, dan verifikasi konsistensi ekspor file PNG/SVG/JSON/Markdown.",
        createdAt: "2026-09-02T13:00:00.000Z",
      },
    ],
    "Rizal Prasetyo": [
      {
        id: "note-tt-rizal-1",
        title: "Peran: Cloud DevOps & Site Reliability",
        content:
          "Mengelola pipeline CI/CD, deployment container Cloud Run di port 3000, monitoring uptime, dan proteksi reverse proxy NGINX.",
        createdAt: "2026-09-02T14:15:00.000Z",
      },
    ],
    "Maya Putri": [
      {
        id: "note-tt-maya-1",
        title: "Peran: Product Manager & User Research",
        content:
          "Menyusun product requirements document (PRD), memprioritaskan backlog fitur, dan menganalisis feedback pengguna secara mingguan.",
        createdAt: "2026-09-02T15:00:00.000Z",
      },
    ],
  },
};
