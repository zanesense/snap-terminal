import { toPng } from 'html-to-image';

interface ScriptStep {
  command: string;
  response: string;
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function exportAsGIF(
  terminalElement: HTMLElement,
  steps: ScriptStep[],
  prompt: string,
  filename: string = 'terminal-script',
  typeSpeed: number = 80,
  responseDelay: number = 600,
  onProgress?: (progress: number) => void
): Promise<void> {
  await document.fonts.ready;

  const GIFModule = await import('gif.js');
  const GIF = GIFModule.default ?? GIFModule;

  const contentEl = terminalElement.querySelector('[class*="overflow-auto"]') as HTMLElement;
  if (!contentEl) return;

  const originalContent = contentEl.innerHTML;

  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: terminalElement.offsetWidth,
    height: terminalElement.offsetHeight,
    workerScript: '/gif.worker.js',
    repeat: 0,
  });

  const totalFrames = steps.reduce((acc, s) => acc + s.command.length + 1, 0);
  let framesDone = 0;

  const captureFrame = async () => {
    const dataUrl = await toPng(terminalElement, { pixelRatio: 1, cacheBust: true });
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    gif.addFrame(img, { delay: typeSpeed * 2, copy: true });
    framesDone++;
    onProgress?.(Math.round((framesDone / totalFrames) * 100));
  };

  try {
    for (const step of steps) {
      const chars = step.command.split('');

      for (let i = 1; i <= chars.length; i++) {
        contentEl.innerHTML = `${prompt} ${chars.slice(0, i).join('')}<span class="inline-block w-[0.55em] h-[1.15em] align-middle ml-px -mb-px" style="background-color:currentColor"></span>`;
        await captureFrame();
      }

      contentEl.innerHTML = `${prompt} ${step.command}\n${step.response}`;
      await sleep(responseDelay);
      await captureFrame();
    }

    return new Promise<void>((resolve, reject) => {
      gif.on('finished', (blob: Blob) => {
        contentEl.innerHTML = originalContent;
        downloadBlob(blob, `${filename}.gif`);
        onProgress?.(100);
        resolve();
      });

      gif.on('abort', () => {
        contentEl.innerHTML = originalContent;
        reject(new Error('GIF rendering aborted'));
      });

      gif.render();
    });
  } catch (err) {
    contentEl.innerHTML = originalContent;
    throw err;
  }
}
