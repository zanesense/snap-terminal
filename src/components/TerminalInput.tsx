'use client';

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TerminalInput({ value, onChange }: TerminalInputProps) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium text-body">
          Terminal Text
        </label>
        <span className="text-[11px] text-mute font-mono">
          {value.split('\n').length} lines
        </span>
      </div>
      <div className="relative flex-1 min-h-0">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full min-h-[320px] resize-none font-mono text-[13px] leading-relaxed p-4 bg-canvas border border-hairline rounded-sm text-ink placeholder-mute/60 focus:outline-none focus:border-hairline-strong transition-colors"
          placeholder={`Paste or type terminal text here...\nExample:\n$ npm run build\n> Building project...\n✓ Build complete\n$`}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const sample = `$ npm create terminal-shot\n\n> Creating your terminal screenshot...\n\n  ✓ Text parsed\n  ✓ Theme applied\n  ✓ Ready to export\n\n$ echo "Hello, World!"\nHello, World!\n\n$ ls -la\ntotal 42\ndrwxr-xr-x  10 user  staff   320 Apr 15 10:30 .\n-rw-r--r--   1 user  staff   512 Apr 15 10:30 README.md\n-rw-r--r--   1 user  staff  1024 Apr 15 10:30 package.json\n\n$`;
              onChange(sample);
            }}
            className="text-[11px] px-2.5 py-1 rounded-full bg-canvas-soft border border-hairline text-body hover:bg-canvas-soft-2 transition-colors"
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
                  if (t) onChange(t);
                }).catch(() => {});
              }
            }}
            className="text-[11px] px-2.5 py-1 rounded-full bg-canvas-soft border border-hairline text-body hover:bg-canvas-soft-2 transition-colors"
          >
            Paste
          </button>
        </div>
      </div>
    </div>
  );
}
