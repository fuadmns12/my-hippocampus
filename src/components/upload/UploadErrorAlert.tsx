import React from "react";
import { AlertCircle } from "lucide-react";

interface UploadErrorAlertProps {
  errorMsg: string;
}

export const UploadErrorAlert: React.FC<UploadErrorAlertProps> = ({ errorMsg }) => {
  return (
    <div className="p-3 rounded-xl bg-black border border-rose-500/40 text-xs text-white flex items-start gap-2">
      <AlertCircle className="w-4 h-4 shrink-0 text-white mt-0.5" />
      <span>{errorMsg}</span>
    </div>
  );
};
