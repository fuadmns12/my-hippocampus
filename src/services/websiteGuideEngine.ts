import { GuideAnswer } from "./websiteGuide/types";
import {
  OFF_TOPIC_REPLY,
  DEFAULT_GUIDE_REPLY,
} from "./websiteGuide/guideResponses";
import { checkIsOffTopic, findTopicAnswer } from "./websiteGuide/guideRules";

export type { GuideAnswer };

/**
 * Mesin pencari jawaban panduan website berbasis kata kunci & pola intent.
 * Mampu memberikan jawaban presisi dan terstruktur secara instan (bahkan tanpa API Key / offline).
 */
export function getOfflineWebsiteGuideAnswer(query: string): GuideAnswer {
  const q = query.toLowerCase().trim();

  // 1. Off-topic check (pertanyaan umum yang bukan tentang cara pakai website)
  if (checkIsOffTopic(q)) {
    return {
      reply: OFF_TOPIC_REPLY,
      isOffTopic: true,
    };
  }

  // 2. Cek kecocokan topik dari aturan panduan terdaftar
  const matchedReply = findTopicAnswer(q);
  if (matchedReply) {
    return { reply: matchedReply };
  }

  // 3. Default fallback answer for generic questions about the website
  return {
    reply: DEFAULT_GUIDE_REPLY,
  };
}
