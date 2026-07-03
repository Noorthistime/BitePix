export const SUPPORTED_FORMATS = ['png', 'webp', 'jpeg', 'jpg'] as const;

export type SupportedFormat = (typeof SUPPORTED_FORMATS)[number];

export type ConversionStatus = 'idle' | 'ready' | 'converting' | 'done' | 'error';

export interface ImageAsset {
  file: File;
  previewUrl: string;
  format: SupportedFormat;
  width: number;
  height: number;
}

export interface ConvertedAsset {
  file: File;
  previewUrl: string;
  format: SupportedFormat;
  width: number;
  height: number;
}
