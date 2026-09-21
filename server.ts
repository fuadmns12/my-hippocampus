import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { systemRouter } from "./server/routes/systemRoutes";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// API Routes
app.use(systemRouter);

// Unhandled API Routes Fallback
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found", path: req.path });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server MindMap Generator berjalan pada http://localhost:${PORT}`);
  });
}

startServer();
