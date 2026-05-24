'use client';

import { detectPlatform } from '@/utils/detect-platform';
import type { Platform } from '@/types';

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onDetectPlatform?: (platform: Platform) => void;
}

export default function TerminalInput({ value, onChange, onDetectPlatform }: TerminalInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[280px] resize-none font-mono text-xs leading-relaxed p-3 bg-canvas-soft border border-hairline rounded-md text-ink placeholder-mute/60 focus:outline-none focus:border-hairline-strong transition-colors"
          placeholder={`Paste or type terminal text here...\nExample:\n$ npm run build\n> Building project...\n✓ Build complete\n$`}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              const sample = `$ npm create terminal-shot\n\n> Creating your terminal screenshot...\n\n  ✓ Text parsed\n  ✓ Theme applied\n  ✓ Ready to export\n\n$ echo "Hello, World!"\nHello, World!\n\n$ ls -la\ntotal 42\ndrwxr-xr-x  10 user  staff   320 Apr 15 10:30 .\n-rw-r--r--   1 user  staff   512 Apr 15 10:30 README.md\n-rw-r--r--   1 user  staff  1024 Apr 15 10:30 package.json\n\n$`;
              onChange(sample);
              const detected = detectPlatform(sample);
              if (detected && onDetectPlatform) onDetectPlatform(detected);
            }}
            className="h-7 px-2.5 text-[11px] font-medium rounded-md bg-canvas border border-hairline text-body hover:border-hairline-strong hover:text-ink transition-colors"
          >
            Sample
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.querySelector('textarea');
              if (el) {
                el.select();
                navigator.clipboard.readText().then((t) => {
                  if (t) {
                    onChange(t);
                    const detected = detectPlatform(t);
                    if (detected && onDetectPlatform) onDetectPlatform(detected);
                  }
                }).catch(() => {});
              }
            }}
            className="h-7 px-2.5 text-[11px] font-medium rounded-md bg-canvas border border-hairline text-body hover:border-hairline-strong hover:text-ink transition-colors"
          >
            Paste
          </button>
        </div>
      </div>
    </div>
  );
}
