export type Platform =
  | 'macos-terminal'
  | 'windows-cmd'
  | 'windows-powershell'
  | 'windows-terminal'
  | 'ubuntu-terminal'
  | 'kali-terminal'
  | 'vscode-terminal'
  | 'iterm2'
  | 'custom';

export type CursorStyle = 'block' | 'underline' | 'bar' | 'none';
export type ExportFormat = 'png' | 'jpg' | 'webp' | 'svg';
export type LineType = 'input' | 'output' | 'error' | 'info';

export interface TerminalConfig {
  platform: Platform;
  showWindowChrome: boolean;
  showWindowButtons: boolean;
  windowTitle: string;
  terminalWidth: number;
  terminalHeight: number;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  padding: number;
  borderRadius: number;
  shadowIntensity: number;
  backgroundTransparency: number;
  cursorStyle: CursorStyle;
  cursorVisible: boolean;
  cursorColor: string;
  blinkCursor: boolean;
  promptStyle: string;
  customPrompt: string;
  watermarkEnabled: boolean;
  watermarkText: string;
  backgroundCanvasColor: string;
  syntaxHighlighting: boolean;
  supportsANSI: boolean;
  isDarkMode: boolean;
  exportScale: number;
  exportFormat: ExportFormat;
  transparentBackground: boolean;
  wrapLongLines: boolean;
  showLineNumbers: boolean;
}

export interface Preset {
  id: string;
  name: string;
  config: TerminalConfig;
}

export interface PlatformPreset {
  id: Platform;
  name: string;
  description: string;
  config: Partial<TerminalConfig>;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  config: Partial<TerminalConfig>;
}

export const DEFAULT_TERMINAL_TEXT = `$ npm create terminal-shot

> terminal-shot@1.0.0 create
> Welcome to Snap Terminal!

  ╭──────────────────────────────╮
  │                              │
  │   Snap Terminal Generator    │
  │   v1.0.0 — Build Ready       │
  │                              │
  ╰──────────────────────────────╯

$ ls -la
total 42
drwxr-xr-x  10 user  staff   320 Apr 15 10:30 .
drwxr-xr-x   6 user  staff   192 Apr 15 09:15 ..
-rw-r--r--   1 user  staff   128 Apr 15 10:30 README.md
-rw-r--r--   1 user  staff   512 Apr 15 10:30 index.ts
-rw-r--r--   1 user  staff  1024 Apr 15 10:30 package.json

$ node -e "console.log('Hello, Terminal!')"
Hello, Terminal!

$ echo "Everything looks good ✓"
Everything looks good ✓
$`;

export const DEFAULT_CONFIG: TerminalConfig = {
  platform: 'macos-terminal',
  showWindowChrome: true,
  showWindowButtons: true,
  windowTitle: 'bash — terminal — 80×24',
  terminalWidth: 800,
  terminalHeight: 500,
  backgroundColor: '#1e1e2e',
  textColor: '#cdd6f4',
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Menlo', 'Consolas', monospace",
  fontSize: 14,
  lineHeight: 1.5,
  padding: 24,
  borderRadius: 10,
  shadowIntensity: 30,
  backgroundTransparency: 100,
  cursorStyle: 'block',
  cursorVisible: true,
  cursorColor: '#cdd6f4',
  blinkCursor: false,
  promptStyle: '$',
  customPrompt: 'user@machine:~$',
  watermarkEnabled: false,
  watermarkText: 'snap-terminal.app',
  backgroundCanvasColor: '#fafafa',
  syntaxHighlighting: true,
  supportsANSI: true,
  isDarkMode: true,
  exportScale: 2,
  exportFormat: 'png',
  transparentBackground: false,
  wrapLongLines: true,
  showLineNumbers: false,
};
