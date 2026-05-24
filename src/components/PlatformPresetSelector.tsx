'use client';

import type { Platform } from '@/types';
import { PLATFORM_PRESETS } from '@/utils/terminal-presets';

interface PlatformPresetSelectorProps {
  value: Platform;
  onChange: (platform: Platform) => void;
}

const PLATFORM_ICONS: Record<string, string> = {
  'macos-terminal': '🍎',
  'windows-cmd': '⊞',
  'windows-powershell': '⊞',
  'windows-terminal': '⊞',
  'ubuntu-terminal': '🐧',
  'kali-terminal': '🐧',
  'vscode-terminal': '▣',
  'iterm2': '⚡',
  'custom': '⚙',
};

export default function PlatformPresetSelector({ value, onChange }: PlatformPresetSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium text-body">Platform</label>
      <div className="grid grid-cols-3 gap-1.5">
        {PLATFORM_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-sm text-[11px] transition-all border ${
              value === preset.id
                ? 'border-ink bg-ink/5 text-ink font-medium'
                : 'border-hairline bg-canvas text-body hover:border-hairline-strong'
            }`}
          >
            <span className="text-base leading-none">{PLATFORM_ICONS[preset.id] ?? '⌨'}</span>
            <span className="text-[10px] leading-tight text-center">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
