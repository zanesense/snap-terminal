'use client';

import { useMemo, forwardRef } from 'react';
import type { TerminalConfig } from '@/types';
import { parseANSI } from '@/utils/ansi';

interface TerminalWindowProps {
  config: TerminalConfig;
  text: string;
}

function MacOSButtons() {
  return (
    <div className="flex items-center gap-[8px] ml-[8px] shrink-0">
      <span className="w-[12px] h-[12px] rounded-full bg-[#ff5f57] border border-[#e0443e]" />
      <span className="w-[12px] h-[12px] rounded-full bg-[#febc2e] border border-[#dea123]" />
      <span className="w-[12px] h-[12px] rounded-full bg-[#28c840] border border-[#1aab29]" />
    </div>
  );
}

function WindowsClassicButtons() {
  return (
    <div className="flex items-center h-full ml-auto">
      <button type="button" className="w-[46px] h-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors" aria-label="Minimize">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"><line x1="2" y1="5" x2="8" y2="5" /></svg>
      </button>
      <button type="button" className="w-[46px] h-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors" aria-label="Maximize">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1.5" y="1.5" width="7" height="7" rx="0.5" /></svg>
      </button>
      <button type="button" className="w-[46px] h-full flex items-center justify-center text-white/70 hover:text-white hover:bg-[#e81123] transition-colors" aria-label="Close">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" /></svg>
      </button>
    </div>
  );
}

function AdwaitaButtons() {
  const btn = 'w-[14px] h-[14px] rounded-full border flex items-center justify-center shrink-0';
  return (
    <div className="flex items-center gap-[6px] shrink-0 ml-[8px]">
      <span className={`${btn} bg-[#e95420] border-[#c8431a]`}>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" stroke="white" strokeWidth="1.5"><line x1="1" y1="1" x2="5" y2="5" /><line x1="5" y1="1" x2="1" y2="5" /></svg>
      </span>
      <span className={`${btn} bg-[#f5c211] border-[#d9a710]`}>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" stroke="black" strokeWidth="1.5"><line x1="1" y1="3" x2="5" y2="3" /></svg>
      </span>
      <span className={`${btn} bg-[#87b556] border-[#6e9643]`}>
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" stroke="black" strokeWidth="1.5"><rect x="0.8" y="0.8" width="4.4" height="4.4" rx="0.5" /></svg>
      </span>
    </div>
  );
}

function Win11AcrylicBar({ windowTitle, showButtons }: { windowTitle: string; showButtons: boolean }) {
  return (
    <div className="select-none" style={{ background: 'rgba(45,45,45,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="flex items-center h-[32px] px-0">
        <div className="w-[36px] shrink-0 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </div>
        <div className="flex items-center h-[26px] px-2.5 rounded-t-md" style={{ background: '#1a1a1a' }}>
          <svg className="w-3.5 h-3.5 shrink-0 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
          <span className="text-[12px] font-medium truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>{windowTitle}</span>
          <button type="button" className="w-4 h-4 ml-2 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-60 hover:opacity-100 hover:bg-white/10" aria-label="Close tab">
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"><line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" /></svg>
          </button>
        </div>
        <button type="button" className="w-[30px] h-[26px] flex items-center justify-center text-white/40 hover:text-white/80" aria-label="New tab">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <div className="flex-1" />
        {showButtons && WindowsClassicButtons()}
      </div>
    </div>
  );
}

function VSCodePanel() {
  return (
    <div className="select-none shrink-0">
      <div className="flex h-[35px] bg-[#2d2d2d]">
        <div className="flex items-center px-3 gap-1.5" style={{ background: '#1e1e1e' }}>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#569cd6"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" stroke="#569cd6" strokeWidth="1" /><line x1="9" y1="3" x2="9" y2="21" stroke="#569cd6" strokeWidth="1" /></svg>
          <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>TERMINAL</span>
        </div>
        <div className="flex items-center px-3 gap-1.5 opacity-50">
          <svg className="w-3.5 h-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
          <span className="text-[12px]">PROBLEMS</span>
        </div>
        <div className="flex items-center px-3 gap-1.5 opacity-50">
          <span className="text-[12px]">OUTPUT</span>
        </div>
        <div className="flex items-center px-3 gap-1.5 opacity-50">
          <span className="text-[12px]">DEBUG CONSOLE</span>
        </div>
      </div>
      <div className="h-[22px] flex items-center text-[11px] px-3 gap-3" style={{ background: '#252526', color: 'rgba(255,255,255,0.5)' }}>
        <span>bash</span>
        <span className="flex-1" />
        <span>+</span>
        <span className="w-px h-3 bg-white/10 mx-1" />
        <span>⚭</span>
      </div>
    </div>
  );
}

function Iterm2TabBar() {
  return (
    <div className="flex items-center h-[28px] px-2 gap-1.5 shrink-0 select-none" style={{ background: 'rgba(0,0,0,0.15)' }}>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-t-sm" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
        <span className="text-[11px] font-medium ml-1" style={{ color: 'rgba(255,255,255,0.7)' }}>zsh</span>
      </div>
    </div>
  );
}

function getChromeConfig(platform: string, isDark: boolean) {
  switch (platform) {
    case 'macos-terminal':
    case 'iterm2':
      return {
        titleBar: { background: isDark ? '#2d2d2d' : '#ececec', height: 28, textColor: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)', fontSize: 12 },
        left: 'buttons',
      };
    case 'windows-cmd':
      return {
        titleBar: { background: '#1e1e1e', height: 32, textColor: 'rgba(255,255,255,0.85)', fontSize: 12 },
        left: 'title',
      };
    case 'windows-powershell':
      return {
        titleBar: { background: '#012456', height: 32, textColor: 'rgba(255,255,255,0.85)', fontSize: 12 },
        left: 'title',
      };
    case 'windows-terminal':
      return null;
    case 'ubuntu-terminal':
      return {
        titleBar: { background: '#2d2d2d', height: 46, textColor: 'rgba(255,255,255,0.6)', fontSize: 13 },
        left: 'buttons',
      };
    case 'kali-terminal':
      return {
        titleBar: { background: '#1a1a2e', height: 46, textColor: 'rgba(255,255,255,0.6)', fontSize: 13 },
        left: 'buttons',
      };
    case 'vscode-terminal':
      return 'vscode';
    default:
      return {
        titleBar: { background: isDark ? '#2d2d2d' : '#ececec', height: 28, textColor: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)', fontSize: 12 },
        left: 'buttons',
      };
  }
}

function getContentFont(config: TerminalConfig) {
  return config.fontFamily;
}

const TerminalWindow = forwardRef<HTMLDivElement, TerminalWindowProps>(
  ({ config, text }, ref) => {
    const {
      backgroundColor, textColor, fontSize, lineHeight, padding, borderRadius,
      showWindowChrome, showWindowButtons, windowTitle, terminalHeight,
      isDarkMode, supportsANSI, cursorVisible, cursorStyle, cursorColor,
      blinkCursor, wrapLongLines, platform, showLineNumbers,
    } = config;

    const lines = useMemo(() => text.split('\n'), [text]);
    const fontFamily = getContentFont(config);
    const chromeConfig = getChromeConfig(platform, isDarkMode);

    const renderLine = (line: string, lineIndex: number) => {
      if (supportsANSI) {
        const segments = parseANSI(line, isDarkMode);
        if (segments.length > 0) {
          return (
            <span key={lineIndex}>
              {segments.map((seg, i) => (
                <span
                  key={i}
                  style={{
                    fontWeight: seg.bold ? 700 : 400,
                    fontStyle: seg.italic ? 'italic' : 'normal',
                    textDecoration: seg.underline ? 'underline' : 'none',
                    color: seg.color ?? undefined,
                    backgroundColor: seg.backgroundColor ?? undefined,
                  }}
                >
                  {seg.text}
                </span>
              ))}
            </span>
          );
        }
      }

      if (lineIndex === lines.length - 1 && cursorVisible && line.trim() !== '') {
        return (
          <span key={lineIndex}>
            {line}
            <span
              className={`inline-block w-[0.55em] h-[1.15em] align-middle ml-px -mb-px ${
                cursorStyle === 'underline' ? 'border-b-2' : cursorStyle === 'bar' ? 'border-l-2' : ''
              } ${blinkCursor ? 'animate-pulse' : ''}`}
              style={{
                backgroundColor: cursorStyle === 'block' ? cursorColor : 'transparent',
                borderColor: cursorColor,
              }}
            />
          </span>
        );
      }

      return <span key={lineIndex}>{line}</span>;
    };

    const windowChrome = showWindowChrome && (() => {
      if (chromeConfig === 'vscode') {
        return <VSCodePanel />;
      }
      if (platform === 'windows-terminal') {
        return <Win11AcrylicBar windowTitle={windowTitle} showButtons={showWindowButtons} />;
      }
      if (!chromeConfig) return null;

      const { titleBar, left } = chromeConfig;
      return (
        <div
          className="flex items-center select-none shrink-0"
          style={{
            height: titleBar.height,
            background: titleBar.background,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            paddingLeft: platform === 'windows-cmd' || platform === 'windows-powershell' ? 12 : 0,
          }}
        >
          {left === 'buttons' ? (
            <>
              <div className="flex items-center shrink-0" style={{ width: 76 }}>
                {platform === 'ubuntu-terminal' || platform === 'kali-terminal'
                  ? <AdwaitaButtons />
                  : <MacOSButtons />
                }
              </div>
              <span
                className="flex-1 text-center font-medium truncate mx-2"
                style={{ fontSize: titleBar.fontSize, color: titleBar.textColor }}
              >
                {windowTitle}
              </span>
              <div className="w-[76px] shrink-0" />
            </>
          ) : (
            <>
              <span
                className="flex-1 font-medium truncate"
                style={{ fontSize: titleBar.fontSize, color: titleBar.textColor }}
              >
                {windowTitle}
              </span>
              {showWindowButtons && <WindowsClassicButtons />}
            </>
          )}
        </div>
      );
    })();

    const shadow = showWindowChrome
      ? config.shadowIntensity > 0
        ? `0 ${config.shadowIntensity * 0.5}px ${config.shadowIntensity * 1.5}px rgba(0,0,0,${(config.shadowIntensity * 0.008).toFixed(3)}), 0 0 0 1px rgba(0,0,0,${(config.shadowIntensity * 0.004).toFixed(3)})`
        : '0 0 0 1px rgba(0,0,0,0.04)'
      : 'none';

    return (
      <div
        ref={ref}
        className="overflow-hidden font-mono"
        style={{
          backgroundColor,
          color: textColor,
          fontFamily,
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}`,
          borderRadius: `${borderRadius}px`,
          width: '100%',
          boxShadow: shadow,
        }}
      >
        {windowChrome}
        {platform === 'iterm2' && showWindowChrome && <Iterm2TabBar />}
        <div
          className="overflow-auto"
          style={{
            padding: `${padding}px`,
            maxHeight: terminalHeight > 0 ? `${terminalHeight}px` : 'none',
            whiteSpace: wrapLongLines ? 'pre-wrap' : 'pre',
            wordBreak: wrapLongLines ? 'break-all' : 'normal',
          }}
        >
          <div className="leading-relaxed" style={{ lineHeight: `${lineHeight}` }}>
            {lines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap flex" style={{ minHeight: `${fontSize * lineHeight}px` }}>
                {showLineNumbers && (
                  <span
                    className="text-right shrink-0 select-none mr-3"
                    style={{
                      width: `${String(lines.length).length * 0.6 + 0.8}em`,
                      color: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    }}
                  >
                    {i + 1}
                  </span>
                )}
                {renderLine(line, i)}
              </div>
            ))}
          </div>
        </div>
        {config.watermarkEnabled && (
          <div
            className="absolute bottom-2 right-3 text-[9px] opacity-35 select-none pointer-events-none"
            style={{ color: textColor }}
          >
            {config.watermarkText}
          </div>
        )}
      </div>
    );
  }
);

TerminalWindow.displayName = 'TerminalWindow';
export default TerminalWindow;
