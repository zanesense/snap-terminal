'use client';

import { useCallback, useRef, useState } from 'react';

interface ColorPickerControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ColorPickerControl({ label, value, onChange }: ColorPickerControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const presetColors = [
    '#1e1e2e', '#282a36', '#300a24', '#0c0c0c', '#012456',
    '#1e1e1e', '#000000', '#ffffff', '#f5f5f7', '#24292e',
    '#cdd6f4', '#00ff00', '#00ff41', '#50fa7b', '#f8f8f2',
    '#ff3333', '#ff79c6', '#8be9fd', '#f1fa8c', '#6272a4',
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-body">{label}</label>
      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            inputRef.current?.click();
          }}
          className="shrink-0 w-9 h-9 rounded-sm border border-hairline cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: value }}
          aria-label={`Pick color for ${label}`}
        />
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={handleChange}
          className="sr-only"
          aria-label={`Color picker for ${label}`}
        />
        <span className="font-mono text-[12px] text-mute">{value}</span>
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 p-2 bg-canvas border border-hairline rounded-md shadow-modal z-50 grid grid-cols-5 gap-1.5">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                className="w-7 h-7 rounded-sm border border-hairline cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
