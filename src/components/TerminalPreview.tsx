'use client';

import { useRef } from 'react';
import type { TerminalConfig } from '@/types';
import TerminalWindow from './TerminalWindow';

interface TerminalPreviewProps {
  config: TerminalConfig;
  text: string;
}

export default function TerminalPreview({ config, text }: TerminalPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium text-body">
          Preview
        </label>
        <span className="text-[11px] text-mute font-mono">
          {config.isDarkMode ? 'Dark' : 'Light'} · {config.platform.replace(/-/g, ' ')}
        </span>
      </div>
      <div
        className="flex-1 flex items-center justify-center min-h-[400px] p-6 bg-canvas-soft border border-hairline rounded-sm overflow-auto"
        style={{ backgroundColor: config.backgroundCanvasColor }}
      >
        <div
          ref={previewRef}
          className="relative"
          style={{
            width: `${Math.min(config.terminalWidth, 780)}px`,
          }}
        >
          <TerminalWindow ref={previewRef} config={config} text={text} />
        </div>
      </div>
    </div>
  );
}
