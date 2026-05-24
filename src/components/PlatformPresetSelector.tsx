'use client';

import type { Platform } from '@/types';
import { PLATFORM_PRESETS } from '@/utils/terminal-presets';

interface PlatformPresetSelectorProps {
  value: Platform;
  onChange: (platform: Platform) => void;
}

const PLATFORM_SVGS: Record<string, React.ReactNode> = {
  'macos-terminal': (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="1.5" fill="#ff5f57" stroke="none" />
      <circle cx="12" cy="7" r="1.5" fill="#febc2e" stroke="none" />
      <circle cx="17" cy="7" r="1.5" fill="#28c840" stroke="none" />
      <rect x="3" y="10" width="18" height="12" rx="2" />
      <line x1="3" y1="13" x2="21" y2="13" />
    </svg>
  ),
  'windows-cmd': (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <text x="5" y="17" fontSize="9" fontWeight="bold" stroke="none" fill="currentColor">C:\</text>
    </svg>
  ),
  'windows-powershell': (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <text x="5" y="17" fontSize="8" fontWeight="bold" stroke="none" fill="currentColor">PS</text>
    </svg>
  ),
  'windows-terminal': (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <line x1="2" y1="8" x2="22" y2="8" />
      <line x1="7" y1="5" x2="8" y2="6" strokeWidth="1" />
      <line x1="8" y1="5" x2="7" y2="6" strokeWidth="1" />
    </svg>
  ),
  'ubuntu-terminal': (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" opacity="0.3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </svg>
  ),
  'kali-terminal': (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  'vscode-terminal': (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  ),
  'iterm2': (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16v16H4z" />
      <path d="M8 9l3 3-3 3" strokeWidth="2" />
    </svg>
  ),
  'custom': (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
};

export default function PlatformPresetSelector({ value, onChange }: PlatformPresetSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-mute">Platform</label>
      <div className="grid grid-cols-3 gap-1.5">
        {PLATFORM_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-[11px] transition-all duration-150 border ${
              value === preset.id
                ? 'border-ink bg-ink/5 text-ink font-medium'
                : 'border-hairline bg-canvas text-body hover:border-hairline-strong hover:text-ink'
            }`}
          >
            <span className={`${value === preset.id ? 'text-ink' : 'text-mute'}`}>
              {PLATFORM_SVGS[preset.id] ?? '⌨'}
            </span>
            <span className="leading-tight text-center">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
