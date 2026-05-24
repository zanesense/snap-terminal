'use client';

import { useState } from 'react';

interface ScriptStep {
  command: string;
  response: string;
}

interface ScriptEditorProps {
  prompt: string;
  onExport: (steps: ScriptStep[]) => void;
  exporting?: boolean;
  progress?: number;
}

export default function ScriptEditor({ prompt, onExport, exporting = false, progress = 0 }: ScriptEditorProps) {
  const [steps, setSteps] = useState<ScriptStep[]>([
    { command: 'npm run build', response: '> snap-terminal@0.1.0 build\n> next build\n\n  ✓ Compiled successfully\n  ✓ Build complete' },
    { command: 'echo "Done!"', response: 'Done!' },
  ]);

  const updateStep = (index: number, field: 'command' | 'response', value: string) => {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addStep = () => {
    setSteps((prev) => [...prev, { command: '', response: '' }]);
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    setSteps((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-mute">
          {steps.length} step{steps.length !== 1 ? 's' : ''}
        </span>
        <button
          type="button"
          onClick={addStep}
          disabled={exporting}
          className="h-7 px-2.5 text-xs rounded-md border border-hairline text-body hover:border-hairline-strong hover:text-ink transition-colors disabled:opacity-40"
        >
          + Add Step
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
        {steps.map((step, i) => (
          <div key={i} className="border border-hairline rounded-md p-2.5 bg-canvas-soft">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-mute font-mono">
                Step {i + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveStep(i, -1)}
                  disabled={i === 0 || exporting}
                  className="p-0.5 text-mute hover:text-body disabled:opacity-30 transition-colors"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveStep(i, 1)}
                  disabled={i === steps.length - 1 || exporting}
                  className="p-0.5 text-mute hover:text-body disabled:opacity-30 transition-colors"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  disabled={exporting}
                  className="p-0.5 text-mute hover:text-error transition-colors disabled:opacity-30"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-mute shrink-0">{prompt}</span>
                <input
                  type="text"
                  value={step.command}
                  onChange={(e) => updateStep(i, 'command', e.target.value)}
                  placeholder="Type a command..."
                  disabled={exporting}
                  className="flex-1 h-7 px-2 text-xs font-mono bg-canvas border border-hairline rounded-md text-ink focus:outline-none focus:border-hairline-strong disabled:opacity-50"
                />
              </div>
              <textarea
                value={step.response}
                onChange={(e) => updateStep(i, 'response', e.target.value)}
                placeholder="Command output..."
                rows={2}
                disabled={exporting}
                className="w-full h-14 px-2 py-1.5 text-xs font-mono bg-canvas border border-hairline rounded-md text-ink focus:outline-none focus:border-hairline-strong resize-none disabled:opacity-50"
              />
            </div>
          </div>
        ))}
      </div>

      {exporting && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-mute">
            <span>Rendering GIF...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-canvas-soft rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 bg-hairline-strong"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => onExport(steps)}
        disabled={steps.length === 0 || steps.some((s) => !s.command.trim()) || exporting}
        className="w-full h-9 px-4 text-xs font-medium text-on-ink bg-ink rounded-full hover:opacity-90 transition-all duration-150 disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {exporting ? (
          <>
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" />
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            Export GIF
          </>
        )}
      </button>
    </div>
  );
}
