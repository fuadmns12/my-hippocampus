/**
 * YouTube Music & Video Helper Utilities
 */

export interface MusicPreset {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  videoId: string;
  url: string;
}

export const MUSIC_PRESETS: MusicPreset[] = [
  {
    id: "lofi-girl",
    title: "Lofi Girl",
    subtitle: "Beats to relax/study to",
    category: "Lofi Hip Hop",
    videoId: "rFZHOHl-L8A",
    url: "https://www.youtube.com/watch?v=rFZHOHl-L8A",
  },
  {
    id: "chillhop",
    title: "Chillhop Radio",
    subtitle: "Jazzy & calm beats",
    category: "Chillhop",
    videoId: "5yx6BWlEVcY",
    url: "https://www.youtube.com/watch?v=5yx6BWlEVcY",
  },
  {
    id: "ambient-nature",
    title: "Piano & Suara Alam",
    subtitle: "Fokus mendalam & tenang",
    category: "Ambient",
    videoId: "4xDzrJKXOOY",
    url: "https://www.youtube.com/watch?v=4xDzrJKXOOY",
  },
  {
    id: "synthwave",
    title: "Synthwave / Cyberpunk",
    subtitle: "Energi fokus kerja kreatif",
    category: "Electronic",
    videoId: "4xDzrJKXOOY",
    url: "https://www.youtube.com/watch?v=4xDzrJKXOOY",
  },
];

/**
 * Extracts a valid YouTube 11-character video ID from varied URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://music.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - or raw 11-character ID
 */
export function extractYouTubeVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-character alphanumeric YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex for standard YouTube URLs
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/)|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Search in URL query parameters as a fallback
  try {
    const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const v = parsed.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
      return v;
    }
  } catch {
    // Ignore URL parse error
  }

  return null;
}

export interface PlaylistItem {
  id: string;
  title: string;
  url: string;
  videoId: string;
  addedAt: number;
}

export const DEFAULT_PLAYLIST: PlaylistItem[] = [
  {
    id: "pl-lofi-girl",
    title: "Lofi Girl (Study & Relax Beats)",
    url: "https://www.youtube.com/watch?v=rFZHOHl-L8A",
    videoId: "rFZHOHl-L8A",
    addedAt: 1700000000000,
  },
  {
    id: "pl-chillhop",
    title: "Chillhop Radio (Jazzy & Calm)",
    url: "https://www.youtube.com/watch?v=5yx6BWlEVcY",
    videoId: "5yx6BWlEVcY",
    addedAt: 1700000001000,
  },
  {
    id: "pl-piano-nature",
    title: "Piano & Suara Alam (Deep Focus)",
    url: "https://www.youtube.com/watch?v=4xDzrJKXOOY",
    videoId: "4xDzrJKXOOY",
    addedAt: 1700000002000,
  },
];

/**
 * Generates an embedded player URL with autoplay and JS API enabled
 */
export function buildYouTubeEmbedUrl(videoId: string, origin: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    enablejsapi: "1",
    playsinline: "1",
    controls: "0",
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
  });

  if (origin && origin !== "null") {
    params.set("origin", origin);
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
