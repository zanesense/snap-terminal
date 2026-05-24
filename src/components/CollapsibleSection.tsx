'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function CollapsibleSection({ title, badge, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>(defaultOpen ? 'none' : '0');

  useEffect(() => {
    if (open) {
      const el = contentRef.current;
      if (el) {
        const height = el.scrollHeight;
        setMaxHeight(`${height}px`);
        requestAnimationFrame(() => {
          setMaxHeight(`${el.scrollHeight}px`);
        });
      }
    } else {
      setMaxHeight(`${contentRef.current?.scrollHeight ?? 0}px`);
      requestAnimationFrame(() => {
        setMaxHeight('0');
      });
    }
  }, [open]);

  return (
    <div className="bg-canvas border border-hairline rounded-lg overflow-hidden shadow-card transition-shadow duration-150">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 h-10 text-sm font-medium text-ink hover:bg-canvas-soft transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {badge && (
            <span className="text-[11px] font-mono text-mute bg-canvas-soft px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-3.5 h-3.5 text-mute transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight }}
      >
        <div className="px-4 pb-4 pt-1">{children}</div>
      </div>
    </div>
  );
}
