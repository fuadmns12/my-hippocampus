export interface BranchColor {
  bg: string;
  border: string;
  text: string;
  link: string;
  glow?: string;
}

export interface ThemePalette {
  name: string;
  canvasBg: string;
  isDark: boolean;
  rootBg: string;
  rootBorder: string;
  rootText: string;
  rootCardBg?: string;
  rootCardBorder?: string;
  branchCardBg?: string;
  leafCardBg?: string;
  useRouteColorForBorder?: boolean;
  branchColors: BranchColor[];
  leafBg: string;
  leafBorder: string;
  leafText: string;
  defaultLink: string;
  gridDotColor: string;
}
