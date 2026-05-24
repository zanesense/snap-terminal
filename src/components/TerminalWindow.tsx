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
    <div className="flex items-center gap-[7px]">
      <span className="w-[13px] h-[13px] rounded-full bg-[#ff5f56] border border-[#e0443e] shadow-inner" />
      <span className="w-[13px] h-[13px] rounded-full bg-[#ffbd2e] border border-[#dea123] shadow-inner" />
      <span className="w-[13px] h-[13px] rounded-full bg-[#27c93f] border border-[#1aab29] shadow-inner" />
    </div>
  );
}

function WindowsClassicButtons() {
  return (
    <div className="flex items-center gap-px">
      <button type="button" className="w-[46px] h-[30px] flex items-center justify-center text-current opacity-70 hover:opacity-100 hover:bg-white/10 transition-colors" aria-label="Minimize">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="2" y1="5" x2="8" y2="5" /></svg>
      </button>
      <button type="button" className="w-[46px] h-[30px] flex items-center justify-center text-current opacity-70 hover:opacity-100 hover:bg-white/10 transition-colors" aria-label="Maximize">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="1.5" width="7" height="7" rx="0.5" /></svg>
      </button>
      <button type="button" className="w-[46px] h-[30px] flex items-center justify-center text-current opacity-70 hover:opacity-100 hover:bg-[#e81123]/80 transition-colors" aria-label="Close">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" /></svg>
      </button>
    </div>
  );
}

function LinuxButtons() {
  return (
    <div className="flex items-center gap-[6px]">
      <button type="button" className="w-[14px] h-[14px] rounded-full bg-[#e95420] border border-[#c8431a] flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity" aria-label="Close">
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" stroke="white" strokeWidth="1.2"><line x1="1" y1="1" x2="5" y2="5" /><line x1="5" y1="1" x2="1" y2="5" /></svg>
      </button>
      <button type="button" className="w-[14px] h-[14px] rounded-full bg-[#f5c211] border border-[#d9a710] opacity-80 hover:opacity-100 transition-opacity" aria-label="Minimize">
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" stroke="black" strokeWidth="1.2"><line x1="1" y1="3" x2="5" y2="3" /></svg>
      </button>
      <button type="button" className="w-[14px] h-[14px] rounded-full bg-[#87b556] border border-[#6e9643] opacity-80 hover:opacity-100 transition-opacity" aria-label="Maximize">
        <svg width="6" height="6" viewBox="0 0 6 6" fill="none" stroke="black" strokeWidth="1.2"><rect x="0.8" y="0.8" width="4.4" height="4.4" rx="0.5" /></svg>
      </button>
    </div>
  );
}

function Windows11TabBar({ showButtons }: { isDark?: boolean; windowTitle?: string; showButtons: boolean }) {
  const barBg = '#2d2d2d';
  const tabBg = '#1a1a1a';
  const textClr = 'rgba(255,255,255,0.88)';
  const muteText = 'rgba(255,255,255,0.45)';

  return (
    <div className="select-none" style={{ background: barBg }}>
      <div className="flex items-center h-[48px] px-0">
        <div className="w-12 shrink-0 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        <div
          className="flex items-center gap-0 h-[34px] px-3 min-w-0"
          style={{
            background: tabBg,
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
          }}
        >
          <svg className="w-4 h-4 shrink-0 mr-1.5" viewBox="0 0 24 24" fill="none" stroke={textClr} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
          <span className="text-[13px] font-medium truncate" style={{ color: textClr }}>
            Administrator: C:\Windows\s
          </span>
          <button type="button" className="w-5 h-5 ml-2 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-60 hover:opacity-100 hover:bg-white/10 transition-all" aria-label="Close tab">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={muteText} strokeWidth="1.5"><line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" /></svg>
          </button>
        </div>

        <button type="button" className="w-[38px] h-[34px] flex items-center justify-center text-current opacity-50 hover:opacity-90 hover:bg-white/8 transition-colors" aria-label="New tab">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="square"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <button type="button" className="w-[30px] h-[34px] flex items-center justify-center text-current opacity-50 hover:opacity-90 hover:bg-white/8 transition-colors" aria-label="Dropdown">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>

        <div className="flex-1" />

        {showButtons && (
          <div className="flex items-center h-full">
            {[
              {
                svg: <svg key="min" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeLinecap="square"><line x1="2" y1="5" x2="8" y2="5" /></svg>,
                label: 'Minimize',
                hover: 'hover:bg-white/10',
              },
              {
                svg: <svg key="max" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2"><rect x="1.5" y="1.5" width="7" height="7" rx="0.5" /></svg>,
                label: 'Maximize',
                hover: 'hover:bg-white/10',
              },
              {
                svg: <svg key="close" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="square"><line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" /></svg>,
                label: 'Close',
                hover: 'hover:bg-[#e81123]',
              },
            ].map((b, i) => (
              <button
                key={i}
                type="button"
                className={`w-[48px] h-full flex items-center justify-center transition-colors ${b.hover}`}
                aria-label={b.label}
              >
                {b.svg}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getPlatformButtons(platform: string) {
  if (platform === 'windows-cmd' || platform === 'windows-powershell') {
    return <WindowsClassicButtons />;
  }
  if (platform === 'ubuntu-terminal' || platform === 'kali-terminal') {
    return <LinuxButtons />;
  }
  return <MacOSButtons />;
}

function getChromeStyle(platform: string, isDark: boolean) {
  switch (platform) {
    case 'windows-cmd':
    case 'windows-powershell':
      return {
        background: isDark ? '#0c0c0c' : '#e1e1e1',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)'}`,
        height: '30px',
        padding: '0 0 0 12px',
      };
    case 'windows-terminal':
      return null;
    case 'ubuntu-terminal':
      return {
        background: '#2d0922',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        height: '34px',
        padding: '0 12px',
      };
    case 'kali-terminal':
      return {
        background: '#1a1a2e',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        height: '32px',
        padding: '0 10px',
      };
    case 'vscode-terminal':
      return {
        background: isDark ? '#323233' : '#e8e8e8',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        height: '28px',
        padding: '0 12px',
      };
    default:
      return {
        background: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.06)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        height: '38px',
        padding: '0 14px',
      };
  }
}

function getTitlePosition(platform: string) {
  if (platform === 'windows-cmd' || platform === 'windows-powershell' || platform === 'windows-terminal') {
    return 'left';
  }
  if (platform === 'vscode-terminal') {
    return 'left';
  }
  return 'center';
}

function getContentFont(config: TerminalConfig) {
  if (config.platform === 'windows-cmd' || config.platform === 'windows-powershell') {
    return "'Consolas', 'Courier New', monospace";
  }
  if (config.platform === 'ubuntu-terminal') {
    return "'Ubuntu Mono', 'JetBrains Mono', monospace";
  }
  return config.fontFamily;
}

const TerminalWindow = forwardRef<HTMLDivElement, TerminalWindowProps>(
  ({ config, text }, ref) => {
    const {
      backgroundColor,
      textColor,
      fontSize,
      lineHeight,
      padding,
      borderRadius,
      showWindowChrome,
      showWindowButtons,
      windowTitle,
      terminalHeight,
      isDarkMode,
      supportsANSI,
      cursorVisible,
      cursorStyle,
      cursorColor,
      blinkCursor,
      wrapLongLines,
      platform,
    } = config;

    const lines = useMemo(() => text.split('\n'), [text]);
    const fontFamily = getContentFont(config);
    const chromeStyle = getChromeStyle(platform, isDarkMode);
    const titlePos = getTitlePosition(platform);

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
                cursorStyle === 'underline'
                  ? 'border-b-2'
                  : cursorStyle === 'bar'
                  ? 'border-l-2'
                  : ''
              } ${blinkCursor ? 'animate-pulse' : ''}`}
              style={{
                backgroundColor:
                  cursorStyle === 'block' ? cursorColor : 'transparent',
                borderColor: cursorColor,
              }}
            />
          </span>
        );
      }

      return <span key={lineIndex}>{line}</span>;
    };

    const windowChrome = showWindowChrome && (
      platform === 'windows-terminal' ? (
        <Windows11TabBar showButtons={showWindowButtons} />
      ) : (
        <div
          className="flex items-center select-none shrink-0"
          style={{
            ...chromeStyle,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
          }}
        >
          {titlePos === 'left' ? (
            <>
              <span
                className="text-[11px] font-medium truncate flex-1"
                style={{
                  color: isDarkMode
                    ? 'rgba(255,255,255,0.65)'
                    : 'rgba(0,0,0,0.55)',
                }}
              >
                {windowTitle}
              </span>
              {showWindowButtons && getPlatformButtons(platform)}
            </>
          ) : (
            <>
              {showWindowButtons && (
                <div className="flex items-center shrink-0 w-[68px]">
                  {getPlatformButtons(platform)}
                </div>
              )}
              <span
                className="flex-1 text-center text-[12px] font-medium truncate mx-2"
                style={{
                  color: isDarkMode
                    ? 'rgba(255,255,255,0.55)'
                    : 'rgba(0,0,0,0.5)',
                }}
              >
                {windowTitle}
              </span>
              {showWindowButtons && <div className="w-[68px] shrink-0" />}
            </>
          )}
        </div>
      )
    );

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
        <div
          className="overflow-auto"
          style={{
            padding: `${padding}px`,
            maxHeight: `${terminalHeight}px`,
            whiteSpace: wrapLongLines ? 'pre-wrap' : 'pre',
            wordBreak: wrapLongLines ? 'break-all' : 'normal',
          }}
        >
          <div className="leading-relaxed" style={{ lineHeight: `${lineHeight}` }}>
            {lines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap" style={{ minHeight: `${fontSize * lineHeight}px` }}>
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
