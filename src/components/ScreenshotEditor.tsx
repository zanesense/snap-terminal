'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { TerminalConfig, Platform } from '@/types';
import { DEFAULT_CONFIG } from '@/types';
import TerminalInput from './TerminalInput';
import TerminalWindow from './TerminalWindow';
import PlatformPresetSelector from './PlatformPresetSelector';
import ThemeCustomizer from './ThemeCustomizer';
import FontSettingsPanel from './FontSettingsPanel';
import ExportPanel from './ExportPanel';
import PresetManager from './PresetManager';
import { PLATFORM_PRESETS } from '@/utils/terminal-presets';
import { exportAsPNG as exportPNG } from '@/utils/export';

export default function ScreenshotEditor() {
  const [text, setText] = useState(DEFAULT_TERMINAL_TEXT);
  const [config, setConfig] = useState<TerminalConfig>(() => {
    try {
      const params = new URLSearchParams(
        typeof window !== 'undefined' ? window.location.search : ''
      );
      const configParam = params.get('config');
      if (configParam) {
        const decoded = JSON.parse(atob(configParam));
        return { ...DEFAULT_CONFIG, ...decoded };
      }
    } catch {}
    return { ...DEFAULT_CONFIG };
  });
  const [activeTab, setActiveTab] = useState<'customize' | 'font' | 'presets'>('customize');
  const [showEditor, setShowEditor] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleConfigChange = useCallback((newConfig: TerminalConfig) => {
    setConfig(newConfig);
  }, []);

  const handlePlatformChange = useCallback(
    (platform: Platform) => {
      const preset = PLATFORM_PRESETS.find((p) => p.id === platform);
      if (preset) {
        setConfig((prev) => ({
          ...prev,
          ...preset.config,
          platform: platform,
        }));
      }
    },
    []
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (terminalRef.current) {
          exportPNG(terminalRef.current, 'terminal-screenshot', config.exportScale);
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config.exportScale]);

  return (
    <div className="flex flex-col min-h-screen bg-canvas-soft">
      <header className="sticky top-0 z-50 bg-canvas border-b border-hairline">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg mesh-gradient flex items-center justify-center text-white text-sm font-bold">
              ST
            </div>
            <div>
              <h1 className="text-[15px] font-semibold text-ink tracking-tight">
                Snap Terminal
              </h1>
              <p className="text-[11px] text-mute leading-none mt-0.5">
                Terminal Screenshot Generator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEditor(!showEditor)}
              className="h-8 px-3 text-[12px] rounded-full border border-hairline text-body hover:border-hairline-strong transition-colors lg:hidden"
            >
              {showEditor ? 'Preview' : 'Edit'}
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 flex items-center justify-center rounded-full border border-hairline text-body hover:border-hairline-strong transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 lg:p-6 gap-6 flex flex-col lg:flex-row">
        <div
          className={`w-full lg:w-[380px] xl:w-[420px] shrink-0 ${
            showEditor ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="bg-canvas border border-hairline rounded-sm p-4">
              <TerminalInput value={text} onChange={setText} />
            </div>

            <div className="bg-canvas border border-hairline rounded-sm p-4">
              <PlatformPresetSelector
                value={config.platform}
                onChange={handlePlatformChange}
              />
            </div>

            <div className="bg-canvas border border-hairline rounded-sm">
              <div className="flex border-b border-hairline">
                {(['customize', 'font', 'presets'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 text-[12px] font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-ink border-b-2 border-ink'
                        : 'text-mute hover:text-body'
                    }`}
                  >
                    {tab === 'customize' ? 'Theme' : tab === 'font' ? 'Font' : 'Presets'}
                  </button>
                ))}
              </div>
              <div className="p-4 max-h-[500px] overflow-y-auto">
                {activeTab === 'customize' && (
                  <ThemeCustomizer config={config} onChange={handleConfigChange} />
                )}
                {activeTab === 'font' && (
                  <FontSettingsPanel config={config} onChange={handleConfigChange} />
                )}
                {activeTab === 'presets' && (
                  <PresetManager config={config} onChange={handleConfigChange} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 bg-canvas border border-hairline rounded-sm p-4 lg:p-6 flex items-start justify-center overflow-auto">
            <div
              className="relative"
              style={{
                width: `${Math.min(config.terminalWidth, 1600)}px`,
                maxWidth: '100%',
              }}
            >
              <TerminalWindow ref={terminalRef} config={config} text={text} />
            </div>
          </div>

          <div className="w-full lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-20">
              <ExportPanel config={config} terminalRef={terminalRef} />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-hairline py-4 px-6 text-center text-[11px] text-mute">
        Snap Terminal — Built with Next.js & Tailwind CSS
      </footer>
    </div>
  );
}

const DEFAULT_TERMINAL_TEXT = `Microsoft Windows [Version 10.0.22621.4317]
(c) Microsoft Corporation. All rights reserved.

C:\\Users\\Hp>`;
