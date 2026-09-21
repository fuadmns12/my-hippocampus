import { PresetTemplate } from "../../../types";

export const cloudArchitecturePreset: PresetTemplate = {
  id: "cloud-architecture",
  title: "Arsitektur Microservices Cloud Native",
  subtitle: "Topologi Layanan Backend, DevOps & Database",
  folder: "Spesifik",
  suggestedLayout: "grid-network",
  suggestedTheme: "my-version",
  suggestedConnectorStyle: "angled",
  suggestedNodeShape: "sharp",
  suggestedGroupingStrategy: "balanced-spokes",
  customConfig: {
    balancedBranchCount: 3,
    balancedBranchPrefix: "Layer",
    balancedDistributionMode: "chunk",
  },
  names: [
    "API Gateway Envoy",
    "Auth Service JWT",
    "Database PostgreSQL",
    "Message Broker Kafka",
    "Cache Redis Cluster",
    "Object Storage MinIO",
    "Monitoring Prometheus",
    "Log Collector Fluentd",
    "Grafana Dashboard",
    "Kubernetes Ingress",
  ],
  rootNotes: [
    {
      id: "note-ca-root-1",
      title: "Blueprint Infrastruktur Cloud & Skalabilitas",
      content:
        "Arsitektur modular berbasis container orchestration dengan prinsip zero-downtime deployment, distributed caching, dan asynchronous event messaging.",
      createdAt: "2026-09-02T16:00:00.000Z",
    },
  ],
  nodeNotes: {
    "API Gateway Envoy": [
      {
        id: "note-ca-env-1",
        title: "Reverse Proxy & Manajemen Traffic",
        content:
          "Menangani terminasi TLS/SSL, load balancing round-robin antar service pod, rate limiting 200 req/sec, dan CORS header enforcement.",
        createdAt: "2026-09-02T16:15:00.000Z",
      },
    ],
    "Auth Service JWT": [
      {
        id: "note-ca-jwt-1",
        title: "Otorisasi & Manajemen Sesi Terenkripsi",
        content:
          "Menerbitkan token akses berstandar RFC 7519, verifikasi public key asimetris RS256, dan validasi revocation list di Redis.",
        createdAt: "2026-09-02T16:30:00.000Z",
      },
    ],
    "Database PostgreSQL": [
      {
        id: "note-ca-db-1",
        title: "Penyimpanan Relasional & Connection Pool",
        content:
          "Dikelola dengan connection pooling PgBouncer, auto-backup harian terenkripsi, dan replication cluster aktif-standby.",
        createdAt: "2026-09-02T16:45:00.000Z",
      },
    ],
    "Message Broker Kafka": [
      {
        id: "note-ca-kfk-1",
        title: "Distribusi Pesan & Event Streaming",
        content:
          "Menghubungkan komunikasi event-driven antar mikroservis dengan jaminan pesan at-least-once dan retention log selama 14 hari.",
        createdAt: "2026-09-02T17:00:00.000Z",
      },
    ],
  },
};
