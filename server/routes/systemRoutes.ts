import { Router } from "express";
import path from "path";
import fs from "fs";

export const systemRouter = Router();

// API Health check
systemRouter.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// PWA Service Worker script route (never fall back to HTML)
systemRouter.get("/sw.js", (_req, res) => {
  const distSw = path.join(process.cwd(), "dist", "sw.js");
  if (fs.existsSync(distSw)) {
    return res.sendFile(distSw);
  }
  res.setHeader("Content-Type", "application/javascript");
  res.send(`// My Hippocampus PWA Dev Service Worker
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
`);
});
