import imageCompression from 'browser-image-compression';
import type { ConvertedAsset, ImageAsset, SupportedFormat } from '../types';

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export const MIME_MAP: Record<SupportedFormat, string> = {
  png: 'image/png',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
};

const EXTENSION_MAP: Record<string, SupportedFormat> = {
  png: 'png',
  webp: 'webp',
  jpg: 'jpeg',
  jpeg: 'jpeg',
};

async function loadImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        resolve({
          width: image.naturalWidth || image.width,
          height: image.naturalHeight || image.height,
        });
      };

      image.onerror = () => reject(new Error('Unable to read image dimensions.'));
      image.src = objectUrl;
    });

    return dimensions;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function resizeImageWithCanvas(
  file: File,
  targetFormat: SupportedFormat,
  quality: number,
  width: number,
  height: number
): Promise<File> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();

      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error('Unable to decode the source image.'));
      nextImage.src = objectUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas rendering is unavailable in this browser.');
    }

    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
            return;
          }

          reject(new Error('Image export failed.'));
        },
        MIME_MAP[targetFormat],
        targetFormat === 'png' ? undefined : quality / 100
      );
    });

    return new File([blob], buildDownloadName(file.name, targetFormat), {
      type: MIME_MAP[targetFormat],
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function getFormatFromFile(file: File): SupportedFormat | null {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!extension) {
    return null;
  }

  return EXTENSION_MAP[extension] ?? null;
}

export function validateImageFile(file: File): string | null {
  const detectedFormat = getFormatFromFile(file);

  if (!detectedFormat || !file.type.startsWith('image/')) {
    return 'Only JPG, JPEG, PNG, and WebP images are supported.';
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'Image size must be 50MB or smaller.';
  }

  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

export async function toImageAsset(file: File): Promise<ImageAsset> {
  const format = getFormatFromFile(file) ?? 'jpeg';
  const dimensions = await loadImageDimensions(file);

  return {
    file,
    format,
    previewUrl: URL.createObjectURL(file),
    width: dimensions.width,
    height: dimensions.height,
  };
}

export function buildDownloadName(fileName: string, format: SupportedFormat): string {
  const baseName = fileName.replace(/\.[^.]+$/, '');
  return `converted_${baseName}.${format}`;
}

export async function convertImage(
  sourceFile: File,
  targetFormat: SupportedFormat,
  quality: number,
  onProgress: (value: number) => void,
  dimensions: { width: number; height: number }
): Promise<ConvertedAsset> {
  onProgress(15);
  const file = await resizeImageWithCanvas(
    sourceFile,
    targetFormat,
    quality,
    dimensions.width,
    dimensions.height
  );
  onProgress(100);

  return {
    file,
    format: targetFormat,
    previewUrl: URL.createObjectURL(file),
    width: dimensions.width,
    height: dimensions.height,
  };
}
