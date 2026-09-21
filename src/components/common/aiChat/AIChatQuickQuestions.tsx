import React from "react";
import { BookOpen } from "lucide-react";

export const QUICK_QUESTIONS = [
  "Bagaimana cara membuat mind map baru?",
  "Apa saja pilihan tata letak (layout)?",
  "Bagaimana cara mengganti tema warna & konektor?",
  "Bagaimana cara ekspor ke PNG / SVG / JSON?",
  "Cara menambahkan catatan (notes) & tautan di kartu?",
  "Bagaimana cara memutar musik latar YouTube?",
  "Apa saja tombol shortcut keyboard?",
  "Bagaimana cara navigasi kanvas (zoom, drag, lipat)?",
];

interface AIChatQuickQuestionsProps {
  isLoading: boolean;
  onSelectQuestion: (question: string) => void;
}

export const AIChatQuickQuestions: React.FC<AIChatQuickQuestionsProps> = ({
  isLoading,
  onSelectQuestion,
}) => {
  return (
    <div className="px-3 py-2 bg-black border-b border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none text-[11px]">
      <span className="text-white shrink-0 font-medium flex items-center gap-1 text-[10px]">
        <BookOpen className="w-3 h-3" /> Topik Cepat:
      </span>
      {QUICK_QUESTIONS.map((faq, idx) => (
        <button
          key={idx}
          type="button"
          disabled={isLoading}
          onClick={() => onSelectQuestion(faq)}
          className="shrink-0 px-2 py-1 rounded-full bg-black hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-700 hover:border-cyan-500/40 text-[10px] whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
        >
          {faq.replace("Bagaimana cara ", "Cara ").replace("Apa saja ", "")}
        </button>
      ))}
    </div>
  );
};
