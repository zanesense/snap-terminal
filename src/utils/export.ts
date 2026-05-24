import { toPng, toJpeg, toBlob } from 'html-to-image';
import JSZip from 'jszip';

const MAX_PAGE_HEIGHT = 4096;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportAsPNG(
  element: HTMLElement,
  filename: string = 'terminal-screenshot',
  scale: number = 2
): Promise<void> {
  const dataUrl = await toPng(element, { pixelRatio: scale });
  const img = await loadImage(dataUrl);
  if (img.height <= MAX_PAGE_HEIGHT) {
    downloadBlob(await (await fetch(dataUrl)).blob(), `${filename}.png`);
    return;
  }
  const zip = new JSZip();
  const pages = Math.ceil(img.height / MAX_PAGE_HEIGHT);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  for (let i = 0; i < pages; i++) {
    const h = Math.min(MAX_PAGE_HEIGHT, img.height - i * MAX_PAGE_HEIGHT);
    canvas.width = img.width;
    canvas.height = h;
    ctx.drawImage(img, 0, -i * MAX_PAGE_HEIGHT);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
    if (blob) zip.file(`${filename}-part-${i + 1}.png`, blob);
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, `${filename}.zip`);
}

export async function exportAsJPEG(
  element: HTMLElement,
  filename: string = 'terminal-screenshot',
  scale: number = 2,
  quality: number = 0.95
): Promise<void> {
  const dataUrl = await toJpeg(element, { quality, pixelRatio: scale });
  const img = await loadImage(dataUrl);
  if (img.height <= MAX_PAGE_HEIGHT) {
    downloadBlob(await (await fetch(dataUrl)).blob(), `${filename}.jpg`);
    return;
  }
  const zip = new JSZip();
  const pages = Math.ceil(img.height / MAX_PAGE_HEIGHT);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  for (let i = 0; i < pages; i++) {
    const h = Math.min(MAX_PAGE_HEIGHT, img.height - i * MAX_PAGE_HEIGHT);
    canvas.width = img.width;
    canvas.height = h;
    ctx.drawImage(img, 0, -i * MAX_PAGE_HEIGHT);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', quality));
    if (blob) zip.file(`${filename}-part-${i + 1}.jpg`, blob);
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, `${filename}.zip`);
}

export async function exportAsWebP(
  element: HTMLElement,
  filename: string = 'terminal-screenshot',
  scale: number = 2
): Promise<void> {
  const dataUrl = await toPng(element, { pixelRatio: scale });
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  if (img.height <= MAX_PAGE_HEIGHT) {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.95));
    if (blob) downloadBlob(blob, `${filename}.webp`);
    return;
  }
  const zip = new JSZip();
  const pages = Math.ceil(img.height / MAX_PAGE_HEIGHT);
  for (let i = 0; i < pages; i++) {
    const h = Math.min(MAX_PAGE_HEIGHT, img.height - i * MAX_PAGE_HEIGHT);
    canvas.width = img.width;
    canvas.height = h;
    ctx.drawImage(img, 0, -i * MAX_PAGE_HEIGHT);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.95));
    if (blob) zip.file(`${filename}-part-${i + 1}.webp`, blob);
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, `${filename}.zip`);
}

export async function exportAsSVG(
  element: HTMLElement,
  filename: string = 'terminal-screenshot'
): Promise<void> {
  const rect = element.getBoundingClientRect();
  const clone = element.cloneNode(true) as HTMLElement;
  const serializer = new XMLSerializer();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(rect.width));
  svg.setAttribute('height', String(rect.height));
  svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  foreignObject.setAttribute('width', String(rect.width));
  foreignObject.setAttribute('height', String(rect.height));
  foreignObject.appendChild(clone);
  svg.appendChild(foreignObject);
  const svgStr = serializer.serializeToString(svg);
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  downloadBlob(blob, `${filename}.svg`);
}

export async function copyToClipboard(element: HTMLElement): Promise<void> {
  try {
    const blob = await toBlob(element, { pixelRatio: 2 });
    if (blob) {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      return;
    }
  } catch {}
  const dataUrl = await toPng(element, { pixelRatio: 2 });
  const blob = await (await fetch(dataUrl)).blob();
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}
