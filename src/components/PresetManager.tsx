'use client';

import { useState, useCallback } from 'react';
import type { Preset, TerminalConfig } from '@/types';
import { DEFAULT_CONFIG } from '@/types';
import { THEME_PRESETS } from '@/utils/terminal-presets';

interface PresetManagerProps {
  config: TerminalConfig;
  onChange: (config: TerminalConfig) => void;
}

const STORAGE_KEY = 'snap-terminal-presets';

export default function PresetManager({ config, onChange }: PresetManagerProps) {
  const [presets, setPresets] = useState<Preset[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');

  const savePresets = useCallback((newPresets: Preset[]) => {
    setPresets(newPresets);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPresets));
    } catch {}
  }, []);

  const saveCurrentAsPreset = useCallback(() => {
    if (!presetName.trim()) return;
    const newPreset: Preset = {
      id: `preset-${Date.now()}`,
      name: presetName.trim(),
      config: { ...config },
    };
    savePresets([...presets, newPreset]);
    setPresetName('');
    setShowSaveDialog(false);
  }, [presetName, config, presets, savePresets]);

  const deletePreset = useCallback(
    (id: string) => {
      savePresets(presets.filter((p) => p.id !== id));
    },
    [presets, savePresets]
  );

  const loadPreset = useCallback(
    (preset: Preset) => {
      onChange({ ...preset.config });
      const text = btoa(JSON.stringify(preset.config));
      try {
        window.history.replaceState(null, '', `?preset=${text}`);
      } catch {}
    },
    [onChange]
  );

  const applyThemePreset = useCallback(
    (themeId: string) => {
      const theme = THEME_PRESETS.find((t) => t.id === themeId);
      if (theme) {
        onChange({ ...config, ...theme.config });
      }
    },
    [config, onChange]
  );

  const shareConfig = useCallback(() => {
    try {
      const encoded = btoa(JSON.stringify(config));
      const url = `${window.location.origin}${window.location.pathname}?config=${encoded}`;
      navigator.clipboard.writeText(url).catch(() => {});
    } catch {}
  }, [config]);

  const importConfig = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = JSON.parse(text) as TerminalConfig;
        onChange(imported);
      } catch {}
    };
    input.click();
  }, [onChange]);

  const exportConfig = useCallback(() => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'terminal-preset.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [config]);

  const resetConfig = useCallback(() => {
    if (window.confirm('Reset all settings to default?')) {
      onChange({ ...DEFAULT_CONFIG });
    }
  }, [onChange]);

  return (
    <div className="flex flex-col gap-3 p-4 bg-canvas border border-hairline rounded-sm">
      <div className="text-[13px] font-medium text-body">Presets & Themes</div>

      <div className="flex flex-wrap gap-1.5">
        {THEME_PRESETS.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => applyThemePreset(theme.id)}
            className="px-2.5 py-1 text-[11px] rounded-full border border-hairline text-body hover:border-hairline-strong hover:text-ink transition-colors"
          >
            {theme.name}
          </button>
        ))}
      </div>

      {presets.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-[11px] text-mute mt-1">Saved Presets</div>
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between py-1.5 px-2 rounded-sm hover:bg-canvas-soft group"
            >
              <button
                type="button"
                onClick={() => loadPreset(preset)}
                className="text-[13px] text-body hover:text-ink text-left flex-1"
              >
                {preset.name}
              </button>
              <button
                type="button"
                onClick={() => deletePreset(preset.id)}
                className="opacity-0 group-hover:opacity-100 text-[11px] text-mute hover:text-error transition-all"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-1.5 mt-1">
        <button
          type="button"
          onClick={() => setShowSaveDialog(!showSaveDialog)}
          className="flex-1 py-1.5 text-[12px] rounded-sm border border-hairline text-body hover:border-hairline-strong transition-colors"
        >
          Save Preset
        </button>
        <button
          type="button"
          onClick={importConfig}
          className="flex-1 py-1.5 text-[12px] rounded-sm border border-hairline text-body hover:border-hairline-strong transition-colors"
        >
          Import
        </button>
        <button
          type="button"
          onClick={exportConfig}
          className="flex-1 py-1.5 text-[12px] rounded-sm border border-hairline text-body hover:border-hairline-strong transition-colors"
        >
          Export
        </button>
        <button
          type="button"
          onClick={shareConfig}
          className="flex-1 py-1.5 text-[12px] rounded-sm border border-hairline text-body hover:border-hairline-strong transition-colors"
        >
          Share
        </button>
        <button
          type="button"
          onClick={resetConfig}
          className="py-1.5 px-2 text-[12px] rounded-sm border border-error/30 text-error hover:bg-error-soft transition-colors"
        >
          Reset
        </button>
      </div>

      {showSaveDialog && (
        <div className="flex gap-1.5 items-center mt-1">
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Preset name..."
            className="flex-1 h-8 px-2 text-[12px] bg-canvas border border-hairline rounded-sm text-ink focus:outline-none focus:border-hairline-strong"
            onKeyDown={(e) => e.key === 'Enter' && saveCurrentAsPreset()}
          />
          <button
            type="button"
            onClick={saveCurrentAsPreset}
            className="h-8 px-3 text-[12px] font-medium bg-ink text-on-ink rounded-full hover:opacity-90"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
