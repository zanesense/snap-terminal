'use client';

import { useState, useCallback } from 'react';
import type { ExportFormat } from '@/types';
import { exportAsPNG, exportAsJPEG, exportAsWebP, exportAsSVG, copyToClipboard } from '@/utils/export';

interface ExportPanelProps {
  config: { windowTitle: string; exportScale: number };
  terminalRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExportPanel({ config, terminalRef }: ExportPanelProps) {
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(config.exportScale);
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('png');

  const getFilename = useCallback(() => {
    const ts = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const base = config.windowTitle
      ? config.windowTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 30)
      : 'terminal';
    return `${base}-${ts}`;
  }, [config.windowTitle]);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (!terminalRef.current) return;
      setExporting(true);
      try {
        const el = terminalRef.current;
        const filename = getFilename();
        switch (format) {
          case 'png':
            await exportAsPNG(el, filename, scale);
            break;
          case 'jpg':
            await exportAsJPEG(el, filename, scale);
            break;
          case 'webp':
            await exportAsWebP(el, filename, scale);
            break;
          case 'svg':
            await exportAsSVG(el, filename);
            break;
        }
      } finally {
        setExporting(false);
      }
    },
    [terminalRef, scale, getFilename]
  );

  const handleCopy = useCallback(async () => {
    if (!terminalRef.current) return;
    setExporting(true);
    try {
      await copyToClipboard(terminalRef.current);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setExporting(false);
    }
  }, [terminalRef]);

  const FORMAT_LABELS: Record<ExportFormat, string> = {
    png: 'PNG',
    jpg: 'JPEG',
    webp: 'WebP',
    svg: 'SVG',
  };

  return (
    <div className="flex flex-col gap-4 p-5 bg-canvas border border-hairline rounded-sm">
      <div className="text-[15px] font-semibold text-ink tracking-tight">
        Download Screenshot
      </div>

      <button
        type="button"
        onClick={() => handleExport(activeFormat)}
        disabled={exporting}
        className="w-full py-3 px-5 text-[15px] font-medium bg-ink text-on-ink rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2.5 shadow-sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {exporting ? 'Exporting...' : `Download ${FORMAT_LABELS[activeFormat]}`}
      </button>

      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-medium text-mute uppercase tracking-wider">Format</label>
        <div className="grid grid-cols-4 gap-1.5">
          {(Object.keys(FORMAT_LABELS) as ExportFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setActiveFormat(fmt)}
              className={`py-1.5 text-[12px] font-mono rounded-sm border transition-all ${
                activeFormat === fmt
                  ? 'border-ink bg-ink/5 text-ink font-medium'
                  : 'border-hairline text-body hover:border-hairline-strong'
              }`}
            >
              {FORMAT_LABELS[fmt]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-medium text-mute uppercase tracking-wider">Scale</label>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScale(s)}
              className={`flex-1 py-1.5 text-[12px] font-mono rounded-sm border transition-all ${
                scale === s
                  ? 'border-ink bg-ink/5 text-ink font-medium'
                  : 'border-hairline text-body hover:border-hairline-strong'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-hairline pt-3">
        <button
          type="button"
          onClick={handleCopy}
          disabled={exporting}
          className="w-full py-2 px-4 text-[13px] font-medium bg-canvas text-ink border border-hairline rounded-full hover:bg-canvas-soft transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied to Clipboard
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy Image
            </>
          )}
        </button>
      </div>

      <div className="flex items-start gap-2 text-[11px] text-mute leading-relaxed pt-1 border-t border-hairline/50">
        <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span>Tall screenshots are split into pages and packed as a ZIP.</span>
      </div>
    </div>
  );
}
