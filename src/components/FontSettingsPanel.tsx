'use client';

import type { TerminalConfig } from '@/types';

interface FontSettingsPanelProps {
  config: TerminalConfig;
  onChange: (config: TerminalConfig) => void;
}

const FONT_OPTIONS = [
  { value: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace", label: 'JetBrains Mono' },
  { value: "'SF Mono', 'Menlo', 'Monaco', monospace", label: 'SF Mono' },
  { value: "'Cascadia Code', 'Consolas', 'Courier New', monospace", label: 'Cascadia Code' },
  { value: "'Fira Code', 'JetBrains Mono', monospace", label: 'Fira Code' },
  { value: "'Courier New', monospace", label: 'Courier New' },
  { value: "'Ubuntu Mono', 'JetBrains Mono', monospace", label: 'Ubuntu Mono' },
  { value: "'Consolas', 'Courier New', monospace", label: 'Consolas' },
  { value: "'Menlo', 'Monaco', 'JetBrains Mono', monospace", label: 'Menlo' },
  { value: "'Monaco', 'Menlo', monospace", label: 'Monaco' },
];

export default function FontSettingsPanel({ config, onChange }: FontSettingsPanelProps) {
  const update = (partial: Partial<TerminalConfig>) => {
    onChange({ ...config, ...partial });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[13px] font-medium text-body">Font Settings</div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Font Family</label>
        <select
          value={config.fontFamily}
          onChange={(e) => update({ fontFamily: e.target.value })}
          className="w-full h-9 px-2.5 text-[13px] bg-canvas border border-hairline rounded-sm text-ink focus:outline-none focus:border-hairline-strong"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">
          Font Size: <span className="font-mono text-mute">{config.fontSize}px</span>
        </label>
        <input
          type="range"
          min={10}
          max={24}
          step={1}
          value={config.fontSize}
          onChange={(e) => update({ fontSize: Number(e.target.value) })}
          className="w-full accent-ink h-1.5 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-mute">
          <span>10px</span>
          <span>24px</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">
          Line Height: <span className="font-mono text-mute">{config.lineHeight.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min={1}
          max={2.2}
          step={0.1}
          value={config.lineHeight}
          onChange={(e) => update({ lineHeight: Number(e.target.value) })}
          className="w-full accent-ink h-1.5 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-mute">
          <span>1.0</span>
          <span>2.2</span>
        </div>
      </div>
    </div>
  );
}
