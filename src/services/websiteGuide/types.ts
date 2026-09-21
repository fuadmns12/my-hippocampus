export interface GuideAnswer {
  reply: string;
  isOffTopic?: boolean;
}

export interface GuideTopicRule {
  keywords: string[];
  reply: string;
}
