import type { Platform } from '@/types';

const PROMPT_PATTERNS: { regex: RegExp; platform: Platform }[] = [
  { regex: /^PS\s*[A-Z]:\\/im, platform: 'windows-powershell' },
  { regex: /^PS>/im, platform: 'windows-powershell' },
  { regex: /^[A-Z]:\\/im, platform: 'windows-cmd' },
  { regex: /^[A-Z]:\//im, platform: 'windows-cmd' },
  { regex: /^┌──\(/im, platform: 'kali-terminal' },
  { regex: /^root@.*:#/im, platform: 'kali-terminal' },
  { regex: /^.*@.*:~\$/im, platform: 'ubuntu-terminal' },
  { regex: /^C:\\Windows\\/im, platform: 'windows-terminal' },
  { regex: /^\$/m, platform: 'macos-terminal' },
  { regex: /^#/m, platform: 'kali-terminal' },
  { regex: /^>/m, platform: 'windows-cmd' },
  { regex: /^% /m, platform: 'windows-cmd' },
];

export function detectPlatform(text: string): Platform | null {
  for (const { regex, platform } of PROMPT_PATTERNS) {
    if (regex.test(text)) {
      return platform;
    }
  }
  return null;
}


