import React from "react";

export type GuideCategory =
  | "all"
  | "quickstart"
  | "input"
  | "nodes"
  | "canvas"
  | "themes"
  | "storage"
  | "shortcuts";

export interface GuideItem {
  id: string;
  category: GuideCategory;
  title: string;
  badge: string;
  icon: React.ReactNode;
  summary: string;
  steps: string[];
  tips?: string;
}

export interface GuideCategoryInfo {
  id: GuideCategory;
  label: string;
  icon: React.ReactNode;
}
