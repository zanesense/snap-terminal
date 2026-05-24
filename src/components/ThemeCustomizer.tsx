'use client';

import type { TerminalConfig, CursorStyle } from '@/types';
import ColorPickerControl from './ColorPickerControl';

interface ThemeCustomizerProps {
  config: TerminalConfig;
  onChange: (config: TerminalConfig) => void;
}

export default function ThemeCustomizer({ config, onChange }: ThemeCustomizerProps) {
  const update = (partial: Partial<TerminalConfig>) => {
    onChange({ ...config, ...partial });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[13px] font-medium text-body">Customize</div>

      <ColorPickerControl
        label="Background"
        value={config.backgroundColor}
        onChange={(v) => update({ backgroundColor: v })}
      />

      <ColorPickerControl
        label="Text Color"
        value={config.textColor}
        onChange={(v) => update({ textColor: v })}
      />

      <ColorPickerControl
        label="Cursor Color"
        value={config.cursorColor}
        onChange={(v) => update({ cursorColor: v })}
      />

      <ColorPickerControl
        label="Canvas Background"
        value={config.backgroundCanvasColor}
        onChange={(v) => update({ backgroundCanvasColor: v })}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Font Size</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={10}
            max={24}
            step={1}
            value={config.fontSize}
            onChange={(e) => update({ fontSize: Number(e.target.value) })}
            className="flex-1 accent-ink h-1.5 cursor-pointer"
          />
          <span className="font-mono text-[12px] text-mute w-8 text-right">
            {config.fontSize}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Line Height</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={2}
            step={0.1}
            value={config.lineHeight}
            onChange={(e) => update({ lineHeight: Number(e.target.value) })}
            className="flex-1 accent-ink h-1.5 cursor-pointer"
          />
          <span className="font-mono text-[12px] text-mute w-8 text-right">
            {config.lineHeight.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Padding</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={8}
            max={48}
            step={2}
            value={config.padding}
            onChange={(e) => update({ padding: Number(e.target.value) })}
            className="flex-1 accent-ink h-1.5 cursor-pointer"
          />
          <span className="font-mono text-[12px] text-mute w-8 text-right">
            {config.padding}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Border Radius</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={config.borderRadius}
            onChange={(e) => update({ borderRadius: Number(e.target.value) })}
            className="flex-1 accent-ink h-1.5 cursor-pointer"
          />
          <span className="font-mono text-[12px] text-mute w-8 text-right">
            {config.borderRadius}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Shadow Intensity</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={config.shadowIntensity}
            onChange={(e) => update({ shadowIntensity: Number(e.target.value) })}
            className="flex-1 accent-ink h-1.5 cursor-pointer"
          />
          <span className="font-mono text-[12px] text-mute w-8 text-right">
            {config.shadowIntensity}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Window Width (px)</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={320}
            max={1600}
            step={10}
            value={config.terminalWidth}
            onChange={(e) => update({ terminalWidth: Number(e.target.value) })}
            className="flex-1 accent-ink h-1.5 cursor-pointer"
          />
          <input
            type="number"
            min={320}
            max={1600}
            value={config.terminalWidth}
            onChange={(e) => {
              const v = Math.max(320, Math.min(1600, Number(e.target.value) || 800));
              update({ terminalWidth: v });
            }}
            className="w-16 h-8 px-2 text-[12px] font-mono bg-canvas border border-hairline rounded-sm text-ink text-center focus:outline-none focus:border-hairline-strong"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Window Height (px)</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={100}
            max={2000}
            step={10}
            value={config.terminalHeight}
            onChange={(e) => update({ terminalHeight: Number(e.target.value) })}
            className="flex-1 accent-ink h-1.5 cursor-pointer"
          />
          <input
            type="number"
            min={100}
            max={2000}
            value={config.terminalHeight}
            onChange={(e) => {
              const v = Math.max(100, Math.min(2000, Number(e.target.value) || 500));
              update({ terminalHeight: v });
            }}
            className="w-16 h-8 px-2 text-[12px] font-mono bg-canvas border border-hairline rounded-sm text-ink text-center focus:outline-none focus:border-hairline-strong"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Font Family</label>
        <select
          value={config.fontFamily}
          onChange={(e) => update({ fontFamily: e.target.value })}
          className="w-full h-9 px-2.5 text-[13px] bg-canvas border border-hairline rounded-sm text-ink focus:outline-none focus:border-hairline-strong"
        >
          <option value="'JetBrains Mono', 'Fira Code', monospace">JetBrains Mono</option>
          <option value="'SF Mono', 'Menlo', 'Monaco', monospace">SF Mono</option>
          <option value="'Cascadia Code', 'Consolas', monospace">Cascadia Code</option>
          <option value="'Fira Code', 'JetBrains Mono', monospace">Fira Code</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="'Ubuntu Mono', monospace">Ubuntu Mono</option>
          <option value="'Consolas', monospace">Consolas</option>
          <option value="'Menlo', 'Monaco', monospace">Menlo</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Window Title</label>
        <input
          type="text"
          value={config.windowTitle}
          onChange={(e) => update({ windowTitle: e.target.value })}
          className="w-full h-9 px-2.5 text-[13px] bg-canvas border border-hairline rounded-sm text-ink focus:outline-none focus:border-hairline-strong"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Custom Prompt</label>
        <input
          type="text"
          value={config.customPrompt}
          onChange={(e) => update({ customPrompt: e.target.value })}
          className="w-full h-9 px-2.5 text-[13px] bg-canvas border border-hairline rounded-sm text-ink focus:outline-none focus:border-hairline-strong"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Prompt Style</label>
        <div className="flex gap-1.5">
          {['$', '>', '#', '%', 'PS>'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => update({ promptStyle: p })}
              className={`px-3 py-1.5 text-[13px] font-mono rounded-sm border transition-colors ${
                config.promptStyle === p
                  ? 'border-ink bg-ink/5 text-ink'
                  : 'border-hairline text-body hover:border-hairline-strong'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-body">Cursor Style</label>
        <div className="flex gap-1.5">
          {(['block', 'underline', 'bar', 'none'] as CursorStyle[]).map((cs) => (
            <button
              key={cs}
              type="button"
              onClick={() => update({ cursorStyle: cs })}
              className={`px-3 py-1.5 text-[13px] rounded-sm border transition-colors capitalize ${
                config.cursorStyle === cs
                  ? 'border-ink bg-ink/5 text-ink'
                  : 'border-hairline text-body hover:border-hairline-strong'
              }`}
            >
              {cs}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {([
          ['Cursor Visible', 'cursorVisible'],
          ['Blink Cursor', 'blinkCursor'],
          ['Window Chrome', 'showWindowChrome'],
          ['Window Buttons', 'showWindowButtons'],
          ['Wrap Long Lines', 'wrapLongLines'],
          ['Show Line Numbers', 'showLineNumbers'],
          ['Watermark', 'watermarkEnabled'],
          ['ANSI Color Support', 'supportsANSI'],
        ] as [string, keyof TerminalConfig][]).map(([label, key]) => (
          <label
            key={key}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={config[key] as boolean}
              onChange={(e) => update({ [key]: e.target.checked })}
              className="w-4 h-4 rounded-sm border-hairline text-ink accent-ink focus:ring-0 cursor-pointer"
            />
            <span className="text-[13px] text-body">{label}</span>
          </label>
        ))}
      </div>

      {config.watermarkEnabled && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-body">Watermark Text</label>
          <input
            type="text"
            value={config.watermarkText}
            onChange={(e) => update({ watermarkText: e.target.value })}
            className="w-full h-9 px-2.5 text-[13px] bg-canvas border border-hairline rounded-sm text-ink focus:outline-none focus:border-hairline-strong"
          />
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <label className="text-[13px] font-medium text-body cursor-pointer" htmlFor="darkModeToggle">
          Dark Mode
        </label>
        <button
          id="darkModeToggle"
          type="button"
          onClick={() => update({ isDarkMode: !config.isDarkMode })}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            config.isDarkMode ? 'bg-ink' : 'bg-hairline-strong'
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
              config.isDarkMode ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
