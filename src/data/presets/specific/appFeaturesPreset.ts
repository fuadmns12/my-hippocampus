import { PresetTemplate } from "../../../types";

export const appFeaturesPreset: PresetTemplate = {
  id: "app-features",
  title: "Peta Fitur Aplikasi E-Commerce",
  subtitle: "Modul Arsitektur & Alur Pengguna Digital",
  folder: "Spesifik",
  suggestedLayout: "horizontal-tree",
  suggestedTheme: "neon-dark",
  suggestedConnectorStyle: "bezier",
  suggestedNodeShape: "rounded",
  suggestedGroupingStrategy: "flat-direct",
  customConfig: {
    flatEmoji: "⚡",
    flatSortOrder: "original",
  },
  names: [
    "Autentikasi & Login",
    "Katalog Produk",
    "Keranjang Belanja",
    "Payment Gateway Stripe",
    "Notifikasi Push",
    "Ulasan & Rating",
    "Lacak Pengiriman",
    "Dashboard Penjual",
    "Manajemen Stok",
    "Kupon & Diskon",
    "Chat Layanan Pelanggan",
    "Rekomendasi Produk Unggulan",
    "Favorit & Wishlist",
    "Laporan Keuangan",
  ],
  rootNotes: [
    {
      id: "note-af-root-1",
      title: "Ringkasan Arsitektur Modul Marketplace",
      content:
        "Peta ekosistem menyeluruh aplikasi belanja online generasi terbaru, mencakup modul transaksi real-time, katalog terpadu, dan rantai logistik ekspedisi.",
      createdAt: "2026-09-01T12:00:00.000Z",
    },
  ],
  nodeNotes: {
    "Payment Gateway Stripe": [
      {
        id: "note-af-pay-1",
        title: "Integrasi Pembayaran & Webhook",
        content:
          "Mendukung transaksi multi-mata uang, kartu kredit/debit, QRIS instan, dan e-wallet. Dilengkapi webhook otomatis untuk settlement status pesanan.",
        createdAt: "2026-09-02T08:45:00.000Z",
      },
    ],
    "Rekomendasi Produk Unggulan": [
      {
        id: "note-af-ai-1",
        title: "Katalog Rekomendasi Terpopuler",
        content:
          "Menyajikan katalog terpopuler dan produk terlaris berdasarkan riwayat pencarian pengguna.",
        createdAt: "2026-09-02T10:20:00.000Z",
      },
    ],
    "Autentikasi & Login": [
      {
        id: "note-af-auth-1",
        title: "Keamanan Akun & Multi-Factor Auth (MFA)",
        content:
          "Otentikasi biometrik passkey, verifikasi OTP via WhatsApp/SMS, dan proteksi brute-force login dengan sistem rate limiting ketat.",
        createdAt: "2026-09-02T11:10:00.000Z",
      },
    ],
    "Dashboard Penjual": [
      {
        id: "note-af-seller-1",
        title: "Matriks Penjualan & Inventaris Toko",
        content:
          "Menampilkan grafik omzet harian, konversi pembeli, alert stok menipis, serta pencetakan label resi pengiriman massal.",
        createdAt: "2026-09-02T14:00:00.000Z",
      },
    ],
    "Lacak Pengiriman": [
      {
        id: "note-af-ship-1",
        title: "Pelacakan Kurir Real-Time",
        content:
          "Integrasi API ekspedisi kurir terkemuka dengan notifikasi push berkala mengenai posisi paket hingga diterima di tangan pembeli.",
        createdAt: "2026-09-02T16:30:00.000Z",
      },
    ],
  },
};
