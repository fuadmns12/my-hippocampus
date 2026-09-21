import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { migrateLegacyBrandStorageKeys } from "./utils/legacyBrandMigration";
import "./index.css";

// Migrasi sekali jalan: kunci penyimpanan lama (branding "Mate") → "My Hippocampus"
migrateLegacyBrandStorageKeys();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
