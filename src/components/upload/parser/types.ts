import { MindMapData, DocumentFolder } from "../../../types";

export interface ParsedTextInfo {
  title: string;
  subtitle: string;
  names: string[];
}

export interface UseUploadParserProps {
  isOpen: boolean;
  currentFolder: DocumentFolder;
  savedHistory?: MindMapData[];
  onImportMindMap: (
    data: MindMapData,
    options?: {
      mode?: "overwrite" | "copy";
      customTitle?: string;
      targetExistingId?: string;
    }
  ) => void;
  onImportMultipleMindMaps?: (
    maps: MindMapData[],
    options?: { mode?: "overwrite" | "copy" | "skip" }
  ) => void;
  onImportRawText: (
    title: string,
    subtitle: string,
    names: string[],
    folder: DocumentFolder,
    options?: { mode?: "overwrite" | "copy"; customTitle?: string }
  ) => void;
  onClose: () => void;
}
