import { PresetTemplate } from "../../../types";

export const startupLaunchPreset: PresetTemplate = {
  id: "startup-launch",
  title: "Checklist Peluncuran Startup Digital",
  subtitle: "Peta Strategi & Milestones Peluncuran",
  folder: "Spesifik",
  suggestedLayout: "fishbone",
  suggestedTheme: "emerald",
  suggestedConnectorStyle: "angled",
  suggestedNodeShape: "hexagon",
  suggestedGroupingStrategy: "balanced-spokes",
  customConfig: {
    balancedBranchCount: 4,
    balancedBranchPrefix: "Fase",
    balancedDistributionMode: "chunk",
  },
  names: [
    "Riset Pasar & Competitor",
    "Desain Wireframe UI/UX",
    "Pengembangan MVP",
    "Uji Coba Beta Tester",
    "Penetapan Harga & Paket",
    "Kampanye Media Sosial",
    "Kemitraan Influencer",
    "Press Release Media",
    "Legalitas & Hak Cipta",
    "Infrastruktur Cloud Run",
    "Dukungan Komunitas Discord",
    "Analitik & Tracking Web",
  ],
  rootNotes: [
    {
      id: "note-sl-root-1",
      title: "Master Launching Strategy D-30",
      content:
        "Roadmap eksekusi 30 hari menjelang rilis publik ke Product Hunt dan komunitas global. Sasaran utama: 5.000 pengguna aktif di minggu pertama.",
      createdAt: "2026-09-01T14:00:00.000Z",
    },
  ],
  nodeNotes: {
    "Infrastruktur Cloud Run": [
      {
        id: "note-sl-infra-1",
        title: "Spesifikasi Container & Auto-Scale",
        content:
          "Konfigurasi Cloud Run serverless dengan alokasi 2 CPU / 4GB RAM, autoscaling 2-25 instance, serta monitoring error rate via Google Cloud Logging.",
        createdAt: "2026-09-02T13:40:00.000Z",
      },
    ],
    "Desain Wireframe UI/UX": [
      {
        id: "note-sl-ux-1",
        title: "Validasi Prototype Pengguna",
        content:
          "Menyelesaikan 20 sesi uji coba usability testing bersama calon pengguna awal untuk mematangkan alur pembuatan diagram tanpa hambatan.",
        createdAt: "2026-09-02T14:50:00.000Z",
      },
    ],
    "Riset Pasar & Competitor": [
      {
        id: "note-sl-mkt-1",
        title: "Analisis Peta Persaingan Pasar",
        content:
          "Mengidentifikasi keunggulan diferensiasi: diagram instan tanpa login ribet, dukungan ekspor resolusi ultra-tinggi, dan layout fleksibel 7 model.",
        createdAt: "2026-09-02T15:20:00.000Z",
      },
    ],
    "Legalitas & Hak Cipta": [
      {
        id: "note-sl-leg-1",
        title: "Kepatuhan Regulasi & Perlindungan Data",
        content:
          "Penyusunan Kebijakan Privasi sesuai UU PDP & GDPR, pendaftaran hak kekayaan intelektual (HKI), dan perjanjian kerahasiaan NDA tim.",
        createdAt: "2026-09-02T16:00:00.000Z",
      },
    ],
  },
};
