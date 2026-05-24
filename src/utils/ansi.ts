export interface ANSISegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  backgroundColor?: string;
}

const ANSI_COLORS: Record<string, string> = {
  '0': '#000000',
  '1': '#cc0000',
  '2': '#4e9a06',
  '3': '#c4a000',
  '4': '#3465a4',
  '5': '#75507b',
  '6': '#06989a',
  '7': '#d3d7cf',
  '8': '#555753',
  '9': '#ef2929',
  '10': '#8ae234',
  '11': '#fce94f',
  '12': '#729fcf',
  '13': '#ad7fa8',
  '14': '#34e2e2',
  '15': '#eeeeee',
};

const DARK_ANSI_COLORS: Record<string, string> = {
  '0': '#000000',
  '1': '#ff3333',
  '2': '#50fa7b',
  '3': '#f1fa8c',
  '4': '#6272a4',
  '5': '#ff79c6',
  '6': '#8be9fd',
  '7': '#f8f8f2',
  '8': '#44475a',
  '9': '#ff5555',
  '10': '#50fa7b',
  '11': '#f1fa8c',
  '12': '#6272a4',
  '13': '#ff79c6',
  '14': '#8be9fd',
  '15': '#ffffff',
};

function getColor(colorCode: string, isDark: boolean): string {
  const palette = isDark ? DARK_ANSI_COLORS : ANSI_COLORS;
  return palette[colorCode] ?? '#ffffff';
}

export function parseANSI(text: string, isDark = true): ANSISegment[] {
  const segments: ANSISegment[] = [];
  const ansiRegex = /\x1b\[([\d;]*)m/g;
  let lastIndex = 0;
  let currentStyle: Partial<ANSISegment> = {};

  let match: RegExpExecArray | null;
  while ((match = ansiRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, match.index),
        ...currentStyle,
      });
    }

    const codes = match[1].split(';');
    for (const code of codes) {
      switch (code) {
        case '0': case '':
          currentStyle = {};
          break;
        case '1':
          currentStyle.bold = true;
          break;
        case '3':
          currentStyle.italic = true;
          break;
        case '4':
          currentStyle.underline = true;
          break;
        case '7':
          break;
        case '30': case '31': case '32': case '33': case '34': case '35': case '36': case '37':
          currentStyle.color = getColor(String(parseInt(code) - 30), isDark);
          break;
        case '38':
          break;
        case '40': case '41': case '42': case '43': case '44': case '45': case '46': case '47':
          currentStyle.backgroundColor = getColor(String(parseInt(code) - 40), isDark);
          break;
        case '90': case '91': case '92': case '93': case '94': case '95': case '96': case '97':
          currentStyle.color = getColor(String(parseInt(code) - 90 + 8), isDark);
          break;
        case '100': case '101': case '102': case '103': case '104': case '105': case '106': case '107':
          currentStyle.backgroundColor = getColor(String(parseInt(code) - 100 + 8), isDark);
          break;
      }
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      ...currentStyle,
    });
  }

  return segments;
}


