export const SAMPLE_JSON = `{
  "title": "Struktur Dokumen Materi",
  "subtitle": "Mind map hasil ringkasan materi",
  "root": {
    "id": "root-1",
    "label": "Topik Utama Materi",
    "emoji": "💡",
    "children": [
      {
        "id": "branch-1",
        "label": "Bab 1: Konsep Fundamental",
        "emoji": "📌",
        "children": [
          {
            "id": "sub-1-1",
            "label": "Poin Inti A",
            "emoji": "🔹",
            "notes": [
              "Penjelasan ringkas dari materi dokumen Word."
            ]
          },
          {
            "id": "sub-1-2",
            "label": "Poin Inti B",
            "emoji": "🔹"
          }
        ]
      },
      {
        "id": "branch-2",
        "label": "Bab 2: Implementasi & Praktik",
        "emoji": "🎯",
        "children": [
          {
            "id": "sub-2-1",
            "label": "Langkah Eksekusi",
            "emoji": "⚡",
            "notes": [
              "Daftar tahapan praktis yang ditemukan dalam materi."
            ]
          }
        ]
      }
    ]
  }
}`;

export const GEMINI_PROMPT_TEMPLATE = `Kamu adalah seorang Senior Information Architect, Knowledge Engineer, dan Master Visual Mind Map Strategist kelas dunia. Keahlian utamamu adalah menganalisis dokumen atau materi yang padat dan kompleks (seperti modul kuliah, dokumen Word, laporan bisnis, SOP, atau ringkasan buku), kemudian menyusunnya kembali menjadi arsitektur visual Mind Map yang hierarkis, intuitif, berwawasan tinggi, dan sangat mudah dipelajari.

Tugasmu:
Pelajari seluruh isi materi/dokumen yang saya lampirkan atau berikan di bawah ini. Ekstrak dan susunlah arsitektur Mind Map lengkapnya ke dalam struktur data JSON murni yang valid, presisi, dan siap dirender langsung pada kanvas visual.

Instruksi Analisis & Struktur:
1. Identifikasi ide pokok dan tema sentral dokumen sebagai "root".
2. Klasifikasikan pilar konsep / bab utama menjadi cabang-cabang tingkat pertama ("children").
3. Pecah setiap pilar menjadi sub-cabang yang logis (kedalaman 2 hingga 4 level sesuai kekayaan materi).
4. Masukkan definisi kunci, fakta spesifik, langkah praktis, atau kutipan penjelasan ke dalam array "notes" pada node terkait agar detail penting tidak hilang.
5. Berikan "emoji" yang relevan, hidup, dan representatif pada setiap cabang untuk memperkuat daya ingat visual.
6. Buat "id" yang unik dan konsisten untuk setiap node (misalnya: "b1", "b1-1", "b1-2", "b2").

PENTING - ATURAN OUTPUT:
- Berikan HANYA format JSON valid tanpa teks sambutan/pengantar di awal dan tanpa penutup/komentar di akhir.
- Jangan gunakan formatting Markdown selain blok json murni.

Format JSON yang wajib diikuti:
{
  "title": "[Judul Dokumen / Topik Inti Materi]",
  "subtitle": "[Ringkasan 1 kalimat tentang intisari atau nilai utama materi]",
  "root": {
    "id": "root-1",
    "label": "[Topik Pokok Materi]",
    "emoji": "💡",
    "children": [
      {
        "id": "b1",
        "label": "[Pilar / Bab Utama 1]",
        "emoji": "📌",
        "children": [
          {
            "id": "b1-1",
            "label": "[Sub-topik atau Konsep Kunci]",
            "emoji": "🔹",
            "notes": [
              "[Catatan ringkas, definisi, atau fakta penting dari dokumen]"
            ]
          }
        ]
      },
      {
        "id": "b2",
        "label": "[Pilar / Bab Utama 2]",
        "emoji": "🎯",
        "children": [
          {
            "id": "b2-1",
            "label": "[Sub-topik atau Langkah Aksi]",
            "emoji": "⚡",
            "notes": [
              "[Catatan teknis atau prosedur pelaksanaan]"
            ]
          }
        ]
      }
    ]
  }
}

Berikut materi/dokumen saya yang perlu dianalisis:
[LAMPIRKAN FILE WORD / TEMPELKAN SELURUH TEKS MATERI ANDA DI SINI]`;
