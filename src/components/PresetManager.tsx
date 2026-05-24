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
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {THEME_PRESETS.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => applyThemePreset(theme.id)}
            className="h-7 px-2.5 text-[11px] rounded-md border border-hairline text-body hover:border-hairline-strong hover:text-ink transition-colors"
          >
            {theme.name}
          </button>
        ))}
      </div>

      {presets.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-xs text-mute font-medium mt-1">Saved Presets</div>
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between h-8 px-2 rounded-md hover:bg-canvas-soft group"
            >
              <button
                type="button"
                onClick={() => loadPreset(preset)}
                className="text-xs text-body hover:text-ink text-left flex-1"
              >
                {preset.name}
              </button>
              <button
                type="button"
                onClick={() => deletePreset(preset.id)}
                className="opacity-0 group-hover:opacity-100 text-xs text-mute hover:text-error transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => setShowSaveDialog(!showSaveDialog)}
          className="flex-1 h-7 text-xs rounded-md border border-hairline text-body hover:border-hairline-strong hover:text-ink transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={importConfig}
          className="flex-1 h-7 text-xs rounded-md border border-hairline text-body hover:border-hairline-strong hover:text-ink transition-colors"
        >
          Import
        </button>
        <button
          type="button"
          onClick={exportConfig}
          className="flex-1 h-7 text-xs rounded-md border border-hairline text-body hover:border-hairline-strong hover:text-ink transition-colors"
        >
          Export
        </button>
        <button
          type="button"
          onClick={shareConfig}
          className="flex-1 h-7 text-xs rounded-md border border-hairline text-body hover:border-hairline-strong hover:text-ink transition-colors"
        >
          Share
        </button>
        <button
          type="button"
          onClick={resetConfig}
          className="h-7 px-2 text-xs rounded-md border border-error/30 text-error hover:bg-error-soft transition-colors"
        >
          Reset
        </button>
      </div>

      {showSaveDialog && (
        <div className="flex gap-1.5 items-center">
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Preset name..."
            className="flex-1 h-8 px-2 text-xs bg-canvas border border-hairline rounded-md text-ink focus:outline-none focus:border-hairline-strong"
            onKeyDown={(e) => e.key === 'Enter' && saveCurrentAsPreset()}
          />
          <button
            type="button"
            onClick={saveCurrentAsPreset}
            className="h-8 px-3 text-xs font-medium text-on-ink bg-ink rounded-md hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
