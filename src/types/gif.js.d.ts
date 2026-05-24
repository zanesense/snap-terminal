declare module 'gif.js' {
  interface GIFOptions {
    workerScript?: string;
    workers?: number;
    repeat?: number;
    background?: string | null;
    quality?: number;
    width?: number;
    height?: number;
    transparent?: string | null;
    debug?: boolean;
    dither?: boolean;
  }

  interface AddFrameOptions {
    delay?: number;
    copy?: boolean;
  }

  class GIF {
    constructor(options: GIFOptions);
    addFrame(
      element: HTMLImageElement | HTMLCanvasElement | CanvasRenderingContext2D | ImageData,
      options?: AddFrameOptions
    ): void;
    render(): void;
    on(event: 'finished', callback: (blob: Blob, data: Uint8Array) => void): void;
    on(event: 'progress', callback: (progress: number) => void): void;
    on(event: 'start', callback: () => void): void;
    on(event: 'abort', callback: () => void): void;
    abort(): void;
    running: boolean;
    frames: unknown[];
  }

  export default GIF;
}
