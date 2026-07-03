import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'blob:mock-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('dark'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class MockImage {
  onload: null | (() => void) = null;
  onerror: null | (() => void) = null;
  naturalWidth = 1200;
  naturalHeight = 800;
  width = 1200;
  height = 800;

  set src(_value: string) {
    queueMicrotask(() => {
      this.onload?.();
    });
  }
}

Object.defineProperty(globalThis, 'Image', {
  writable: true,
  value: MockImage,
});

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: vi.fn(() => ({
    clearRect: vi.fn(),
    drawImage: vi.fn(),
  })),
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  writable: true,
  value: vi.fn(
    (
      callback: (blob: Blob | null) => void,
      type?: string
    ) => callback(new Blob(['canvas-image'], { type: type ?? 'image/jpeg' }))
  ),
});
