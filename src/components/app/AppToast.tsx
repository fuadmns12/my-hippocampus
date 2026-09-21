import React from "react";
import { Check } from "lucide-react";

interface AppToastProps {
  message: string | null;
}

export function AppToast({ message }: AppToastProps) {
  if (!message) return null;

  return (
    <div
      id="app-toast-notification"
      className="fixed bottom-6 right-6 z-50 bg-black border border-cyan-500/50 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl shadow-cyan-500/10 flex items-center gap-2.5 backdrop-blur-md"
    >
      <div className="p-1 rounded-full bg-black border border-cyan-500/40 text-white">
        <Check className="w-4 h-4 text-cyan-400" />
      </div>
      <span className="text-white">{message}</span>
    </div>
  );
}
