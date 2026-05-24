'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { TerminalConfig, Platform } from '@/types';
import { DEFAULT_CONFIG, DEFAULT_TERMINAL_TEXT } from '@/types';
import TerminalInput from './TerminalInput';
import TerminalWindow from './TerminalWindow';
import PlatformPresetSelector from './PlatformPresetSelector';
import ThemeCustomizer from './ThemeCustomizer';
import FontSettingsPanel from './FontSettingsPanel';
import ExportPanel from './ExportPanel';
import PresetManager from './PresetManager';
import CollapsibleSection from './CollapsibleSection';
import ScriptEditor from './ScriptEditor';
import Modal from './Modal';
import { PLATFORM_PRESETS } from '@/utils/terminal-presets';
import { exportAsPNG as exportPNG } from '@/utils/export';
import { exportAsGIF } from '@/utils/gif-export';
import { useToast } from './Toast';

const WINDOW_PRESETS = [
  { label: '800×500', w: 800, h: 500 },
  { label: '1024×600', w: 1024, h: 600 },
  { label: '1280×768', w: 1280, h: 768 },
  { label: '1440×900', w: 1440, h: 900 },
  { label: 'Auto', w: 0, h: 0 },
];

const PLATFORM_LABELS: Record<string, string> = {
  'macos-terminal': 'macOS Terminal',
  'windows-cmd': 'Windows CMD',
  'windows-powershell': 'Windows PowerShell',
  'windows-terminal': 'Windows Terminal',
  'ubuntu-terminal': 'Ubuntu Terminal',
  'kali-terminal': 'Kali Linux Terminal',
  'vscode-terminal': 'VS Code Terminal',
  'iterm2': 'iTerm2',
  'custom': 'Custom',
};

export default function ScreenshotEditor() {
  const [text, setText] = useState(DEFAULT_TERMINAL_TEXT);
  const [config, setConfig] = useState<TerminalConfig>(() => ({ ...DEFAULT_CONFIG }));

  useEffect(() => {
    try {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const decoded = JSON.parse(atob(hash));
        if (decoded.text) setText(decoded.text);
        if (decoded.config) setConfig({ ...DEFAULT_CONFIG, ...decoded.config });
      }
    } catch {}
  }, []);

  const [activeTab, setActiveTab] = useState<'customize' | 'font' | 'presets'>('customize');
  const [showEditor, setShowEditor] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [gifExporting, setGifExporting] = useState(false);
  const [gifProgress, setGifProgress] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [watermarkRemoved, setWatermarkRemoved] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('snapTerminal_starred') === 'true';
    }
    return false;
  });
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { show: showToast, ToastContainer } = useToast();

  const [showStarModal, setShowStarModal] = useState(false);
  const [starModalStep, setStarModalStep] = useState<'prompt' | 'verifying' | 'polling' | 'success' | 'error' | 'rate_limited' | 'inconclusive'>('prompt');
  const [starErrorMsg, setStarErrorMsg] = useState('');
  const [pollCount, setPollCount] = useState(0);
  const initialStarCountRef = useRef<number | null>(null);
  const [starCount, setStarCount] = useState<number | null>(null);

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

  const handleDetectPlatform = useCallback(
    (platform: Platform) => {
      const prevPlatform = config.platform;
      handlePlatformChange(platform);
      const name = PLATFORM_LABELS[platform] ?? platform;
      showToast(`Detected: ${name} — switched automatically`, {
        label: 'Undo',
        onClick: () => {
          const prevPreset = PLATFORM_PRESETS.find((p) => p.id === prevPlatform);
          if (prevPreset) {
            setConfig((prev) => ({ ...prev, ...prevPreset.config, platform: prevPlatform }));
          }
        },
      });
    },
    [config.platform, handlePlatformChange, showToast]
  );

  const applyWindowPreset = useCallback((w: number, h: number) => {
    setConfig((prev) => ({ ...prev, terminalWidth: w || prev.terminalWidth, terminalHeight: h || 0 }));
  }, []);

  const handleGifExport = useCallback(
    async (steps: { command: string; response: string }[]) => {
      if (!terminalRef.current) return;
      setGifExporting(true);
      setGifProgress(0);
      try {
        const total = steps.reduce((acc, s) => acc + s.command.length + 1, 0);
        const progressInterval = setInterval(() => {
          setGifProgress((p) => Math.min(p + 5, 90));
        }, 200);
        await exportAsGIF(terminalRef.current, steps, config.promptStyle);
        clearInterval(progressInterval);
        setGifProgress(100);
      } finally {
        setTimeout(() => {
          setGifExporting(false);
          setGifProgress(0);
        }, 500);
      }
    },
    [config.promptStyle]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (terminalRef.current) {
          exportPNG(terminalRef.current, 'terminal-screenshot', config.exportScale);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config.exportScale]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const encoded = btoa(JSON.stringify({ text, config }));
        window.history.replaceState(null, '', `#${encoded}`);
      } catch {}
    }, 300);
    return () => clearTimeout(timeout);
  }, [text, config]);

  const [dragging, setDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setConfig((prev) => {
        const newW = Math.max(320, Math.min(1600, prev.terminalWidth + e.movementX));
        const newH = Math.max(100, Math.min(2000, prev.terminalHeight + e.movementY));
        return { ...prev, terminalWidth: newW, terminalHeight: newH };
      });
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  useEffect(() => {
    let cancelled = false;
    fetch('https://api.github.com/repos/zanesense/snap-terminal')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && !cancelled) {
          initialStarCountRef.current = data.stargazers_count;
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (starModalStep !== 'polling') return;
    let retries = 0;
    const interval = setInterval(async () => {
      retries++;
      setPollCount(retries);
      try {
        const res = await fetch('https://api.github.com/repos/zanesense/snap-terminal');
        if (res.ok) {
          const data = await res.json();
          setStarCount(data.stargazers_count);
          if (initialStarCountRef.current !== null && data.stargazers_count > initialStarCountRef.current) {
            clearInterval(interval);
            localStorage.setItem('snapTerminal_starred', 'true');
            setWatermarkRemoved(true);
            setStarModalStep('success');
            setTimeout(() => setShowStarModal(false), 2000);
            return;
          }
        }
      } catch {}
      if (retries >= 5) {
        clearInterval(interval);
        setStarModalStep('inconclusive');
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [starModalStep]);

  const openStarModal = useCallback(() => {
    setStarModalStep('prompt');
    setStarErrorMsg('');
    setPollCount(0);
    setShowStarModal(true);
  }, []);

  const handleVerifyStar = useCallback(async () => {
    setStarModalStep('verifying');
    setStarErrorMsg('');
    try {
      const res = await fetch('https://api.github.com/repos/zanesense/snap-terminal');
      if (res.status === 403) {
        localStorage.setItem('snapTerminal_starred', 'true');
        setWatermarkRemoved(true);
        setStarModalStep('rate_limited');
        return;
      }
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setStarCount(data.stargazers_count);
      if (initialStarCountRef.current !== null && data.stargazers_count > initialStarCountRef.current) {
        localStorage.setItem('snapTerminal_starred', 'true');
        setWatermarkRemoved(true);
        setStarModalStep('success');
        setTimeout(() => setShowStarModal(false), 2000);
        return;
      }
      if (initialStarCountRef.current === null) {
        setStarModalStep('inconclusive');
        return;
      }
      setStarModalStep('polling');
    } catch {
      setStarModalStep('error');
      setStarErrorMsg('Could not connect to GitHub. Make sure you are online.');
    }
  }, []);

  const handleUnlockAnyway = useCallback(() => {
    localStorage.setItem('snapTerminal_starred', 'true');
    setWatermarkRemoved(true);
    setStarModalStep('success');
    setTimeout(() => setShowStarModal(false), 2000);
  }, []);

  const handleCloseStarModal = useCallback(() => {
    setStarModalStep('prompt');
    setShowStarModal(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-canvas-soft">
      <ToastContainer />

      <header className="sticky top-0 z-50 bg-canvas border-b border-hairline" style={{ height: 64 }}>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-ink">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="3" width="20" height="16" rx="2" stroke="white" strokeWidth="1.5"/>
                <path d="M6 8l4 4-4 4" stroke="#50e3c2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 16h5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.4"/>
              </svg>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-ink">
                Snap
              </span>
              <span className="text-sm text-hairline-strong">/</span>
              <span className="text-sm text-body">
                terminal
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {['Features', 'Templates', 'Docs'].map((link) => (
              <button
                key={link}
                type="button"
                className="px-3 py-1.5 text-sm text-body hover:text-ink hover:bg-canvas-soft rounded-full transition-colors"
              >
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!watermarkRemoved && (
              <button
                type="button"
                onClick={openStarModal}
                className="h-8 px-3 flex items-center gap-1.5 rounded-md border border-warning/30 text-xs text-warning-deep bg-warning-soft hover:bg-warning-soft/80 transition-colors"
                title="Remove watermark"
              >
                <span className="text-sm">⭐</span>
                <span className="hidden sm:inline">Remove watermark</span>
              </button>
            )}
            {watermarkRemoved && (
              <div className="flex items-center gap-1.5 h-8 px-2.5 text-xs text-success rounded-md border border-success/20 bg-success/5 select-none">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="hidden sm:inline">Watermark free</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="h-8 px-3 flex items-center gap-1.5 rounded-md bg-ink text-on-ink text-sm font-medium hover:opacity-90 transition-opacity"
              title="Export"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              type="button"
              onClick={() => setShowEditor(!showEditor)}
              className="h-8 px-3 flex items-center gap-1.5 rounded-md border border-hairline text-sm text-body hover:text-ink hover:border-hairline-strong transition-colors bg-canvas"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
              <span className="hidden sm:inline">{showEditor ? 'Sidebar' : 'Sidebar'}</span>
            </button>
            <a
              href="https://github.com/zanesense"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 flex items-center justify-center rounded-md border border-hairline text-body hover:text-ink hover:border-hairline-strong transition-colors bg-canvas"
              title="GitHub"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 lg:p-6 gap-6 flex flex-col lg:flex-row">
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${
            showEditor
              ? 'max-lg:max-h-[2000px] lg:max-w-[420px] lg:opacity-100'
              : 'max-lg:max-h-0 lg:max-w-0 lg:opacity-0'
          }`}
        >
          <div className="w-full lg:w-[380px] flex flex-col gap-3">
            <CollapsibleSection title="Content" badge={`${text.split('\n').length} lines`} defaultOpen={true}>
              <TerminalInput value={text} onChange={setText} onDetectPlatform={handleDetectPlatform} />
            </CollapsibleSection>

            <CollapsibleSection title="Appearance" defaultOpen={true}>
              <div className="flex flex-col gap-3">
                <PlatformPresetSelector
                  value={config.platform}
                  onChange={handlePlatformChange}
                />
                <div className="bg-canvas border border-hairline rounded-lg overflow-hidden shadow-card">
                  <div className="flex border-b border-hairline">
                    {(['customize', 'font', 'presets'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 h-8 text-xs font-medium capitalize transition-colors ${
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
                      <ThemeCustomizer config={config} onChange={handleConfigChange} watermarkRemoved={watermarkRemoved} onOpenStarModal={openStarModal} />
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
            </CollapsibleSection>

            <CollapsibleSection title="Window" badge="resize" defaultOpen={false}>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-mute mb-2 block">Preset Size</label>
                  <div className="flex flex-wrap gap-1.5">
                    {WINDOW_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyWindowPreset(preset.w, preset.h)}
                        className={`h-7 px-2.5 text-xs font-mono rounded-md border transition-colors ${
                          (preset.w === 0 && config.terminalHeight === 0) || (config.terminalWidth === preset.w && (preset.h === 0 || config.terminalHeight === preset.h))
                            ? 'border-ink bg-ink/5 text-ink'
                            : 'border-hairline text-body hover:border-hairline-strong'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-mute">Width</label>
                    <input
                      type="number"
                      min={320}
                      max={1600}
                      value={config.terminalWidth}
                      onChange={(e) => {
                        const v = Math.max(320, Math.min(1600, Number(e.target.value) || 800));
                        setConfig((prev) => ({ ...prev, terminalWidth: v }));
                      }}
                      className="w-full h-8 px-2.5 text-xs font-mono bg-canvas border border-hairline rounded-md text-ink focus:outline-none focus:border-hairline-strong transition-colors"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-mute">Height</label>
                    <input
                      type="number"
                      min={0}
                      max={2000}
                      value={config.terminalHeight || ''}
                      placeholder="Auto"
                      onChange={(e) => {
                        const v = e.target.value === '' ? 0 : Math.max(0, Math.min(2000, Number(e.target.value) || 0));
                        setConfig((prev) => ({ ...prev, terminalHeight: v }));
                      }}
                      className="w-full h-8 px-2.5 text-xs font-mono bg-canvas border border-hairline rounded-md text-ink focus:outline-none focus:border-hairline-strong transition-colors"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Animation" badge="GIF" defaultOpen={false}>
              <ScriptEditor
                prompt={config.promptStyle}
                onExport={handleGifExport}
                exporting={gifExporting}
                progress={gifProgress}
              />
            </CollapsibleSection>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-4" ref={containerRef}>
          <div className="flex-1 bg-dot-grid border border-hairline rounded-lg p-4 lg:p-6 flex items-start justify-center overflow-auto relative">
            <div
              className="relative"
              style={{
                width: `${Math.min(config.terminalWidth || 800, 1600)}px`,
                maxWidth: '100%',
              }}
            >
              <TerminalWindow ref={terminalRef} config={{ ...config, watermarkEnabled: watermarkRemoved ? config.watermarkEnabled : true }} text={text} />
              <div
                className="absolute -bottom-3 -right-3 w-6 h-6 cursor-se-resize opacity-40 hover:opacity-80 transition-opacity"
                onMouseDown={handleMouseDown}
                style={dragging ? { opacity: 0.8 } : {}}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-mute">
                  <path d="M21 15v6h-6M21 9v6M21 3v6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Terminal Screenshot"
      >
        <ExportPanel
          config={config}
          terminalRef={terminalRef}
        />
      </Modal>

      <Modal open={showStarModal} onClose={handleCloseStarModal}>
        {starModalStep === 'prompt' && (
          <div className="flex flex-col items-center text-center gap-4 py-2">
            <div className="w-12 h-12 rounded-full bg-warning-soft flex items-center justify-center text-xl">
              ⭐
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink mb-1">Enjoying Snap Terminal?</h3>
              <p className="text-sm text-body leading-relaxed max-w-sm">
                Star the repo on GitHub to unlock watermark-free exports.
                It's free and helps the project grow.
              </p>
            </div>
            {starCount !== null && (
              <div className="flex items-center gap-1.5 text-xs text-mute bg-canvas-soft rounded-full px-3 py-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{starCount} stars</span>
              </div>
            )}
            <div className="flex flex-col gap-2 w-full mt-1">
              <a
                href="https://github.com/zanesense/snap-terminal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 flex items-center justify-center gap-2 rounded-full text-sm font-medium text-on-ink bg-ink hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Star on GitHub
              </a>
              <button
                type="button"
                onClick={handleVerifyStar}
                className="w-full h-10 flex items-center justify-center gap-2 rounded-full text-sm font-medium border border-hairline text-body hover:text-ink hover:border-hairline-strong transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                I've starred it — verify
              </button>
            </div>
          </div>
        )}

        {starModalStep === 'verifying' && (
          <div className="flex flex-col items-center text-center gap-4 py-8">
            <svg className="w-8 h-8 animate-spin text-mute" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" />
            </svg>
            <p className="text-sm text-body">Verifying your star on GitHub...</p>
          </div>
        )}

        {starModalStep === 'polling' && (
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <svg className="w-8 h-8 animate-spin text-mute" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" />
            </svg>
            <div>
              <p className="text-sm text-body mb-1">We couldn't verify your star yet — it may take a moment.</p>
              <p className="text-xs text-mute">Checking again in 3 seconds... (attempt {pollCount}/5)</p>
            </div>
          </div>
        )}

        {starModalStep === 'success' && (
          <div className="flex flex-col items-center text-center gap-4 py-8">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink mb-1">Watermark removed! Thank you ⭐</h3>
            </div>
          </div>
        )}

        {starModalStep === 'error' && (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-10 h-10 rounded-full bg-error-soft flex items-center justify-center">
              <svg className="w-5 h-5 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <p className="text-sm text-body">{starErrorMsg}</p>
            <button
              type="button"
              onClick={handleVerifyStar}
              className="h-9 px-4 text-sm font-medium rounded-full border border-hairline text-body hover:text-ink hover:border-hairline-strong transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {starModalStep === 'rate_limited' && (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-10 h-10 rounded-full bg-warning-soft flex items-center justify-center">
              <svg className="w-5 h-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-body mb-1">Verification temporarily unavailable — we'll trust you on this one.</p>
              <p className="text-xs text-mute">Watermark has been removed.</p>
            </div>
          </div>
        )}

        {starModalStep === 'inconclusive' && (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-10 h-10 rounded-full bg-warning-soft flex items-center justify-center">
              <svg className="w-5 h-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <p className="text-sm text-body">Having trouble? Guess we gotta trust you on this one.</p>
            <button
              type="button"
              onClick={handleUnlockAnyway}
              className="h-9 px-4 text-sm font-medium rounded-full border border-ink/20 text-body hover:text-ink hover:border-ink/40 transition-colors"
            >
              Unlock anyway
            </button>
          </div>
        )}
      </Modal>

      <footer className="border-t border-hairline bg-canvas">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-ink">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="20" height="16" rx="2" stroke="white" strokeWidth="1.5"/>
                    <path d="M6 8l4 4-4 4" stroke="#50e3c2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 16h5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.4"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-ink">snap/terminal</span>
              </div>
              <p className="text-xs text-body leading-relaxed">
                Generate beautiful, realistic terminal screenshots from text.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Features</h4>
              <ul className="space-y-1.5 text-xs text-body">
                <li>Multiple platforms</li>
                <li>Custom themes &amp; fonts</li>
                <li>ANSI color support</li>
                <li>GIF typewriter export</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Export</h4>
              <ul className="space-y-1.5 text-xs text-body">
                <li>PNG / JPEG / WebP / SVG</li>
                <li>1x – 4x resolution</li>
                <li>Copy to clipboard</li>
                <li>Shareable links</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Links</h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a
                    href="https://github.com/zanesense/snap-terminal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link hover:underline transition-opacity"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/zanesense"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link hover:underline transition-opacity"
                  >
                    @zanesense
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/zanesense/snap-terminal/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link hover:underline transition-opacity"
                  >
                    Report Issue
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-hairline pt-6 text-center text-xs text-body">
            Built with Next.js &amp; Tailwind CSS &middot; &copy; {new Date().getFullYear()} Snap Terminal
          </div>
        </div>
      </footer>
    </div>
  );
}
