import { getOfflineWebsiteGuideAnswer } from "./websiteGuideEngine";

export interface GuideResponsePayload {
  replyText: string;
}

/**
 * Menghasilkan jawaban panduan penggunaan website My Hippocampus secara lokal dan instan.
 * Basis pengetahuan lokal bawaan, tanpa API eksternal, dan 100% offline.
 */
export async function generateGuideResponse(
  userPrompt: string
): Promise<GuideResponsePayload> {
  const guideAnswer = getOfflineWebsiteGuideAnswer(userPrompt);
  return {
    replyText: guideAnswer.reply,
  };
}
