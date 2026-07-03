import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { ConvertedAsset, ConversionStatus, ImageAsset, SupportedFormat } from '../types';
import { convertImage, toImageAsset, validateImageFile } from '../lib/imageUtils';

interface ConverterContextValue {
  sourceImage: ImageAsset | null;
  convertedImage: ConvertedAsset | null;
  outputFormat: SupportedFormat;
  quality: number;
  outputWidth: number;
  outputHeight: number;
  error: string | null;
  status: ConversionStatus;
  progress: number;
  setOutputFormat: (format: SupportedFormat) => void;
  setQuality: (quality: number) => void;
  setOutputWidth: (width: number) => void;
  setOutputHeight: (height: number) => void;
  setSourceFile: (file: File) => Promise<void>;
  setExternalError: (message: string) => void;
  clearImages: () => void;
  convertCurrentImage: () => Promise<void>;
}

const ConverterContext = createContext<ConverterContextValue | undefined>(undefined);

function revokeAsset(asset: { previewUrl: string } | null) {
  if (asset?.previewUrl) {
    URL.revokeObjectURL(asset.previewUrl);
  }
}

export function ConverterProvider({ children }: PropsWithChildren) {
  const [sourceImage, setSourceImage] = useState<ImageAsset | null>(null);
  const [convertedImage, setConvertedImage] = useState<ConvertedAsset | null>(null);
  const [outputFormat, setOutputFormat] = useState<SupportedFormat>('webp');
  const [quality, setQuality] = useState(82);
  const [outputWidth, setOutputWidth] = useState(0);
  const [outputHeight, setOutputHeight] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState(0);

  const clearImages = useCallback(() => {
    revokeAsset(sourceImage);
    revokeAsset(convertedImage);
    setSourceImage(null);
    setConvertedImage(null);
    setError(null);
    setStatus('idle');
    setProgress(0);
    setOutputWidth(0);
    setOutputHeight(0);
  }, [convertedImage, sourceImage]);

  const setExternalError = useCallback((message: string) => {
    setError(message);
    setStatus('error');
  }, []);

  const setSourceFile = useCallback(
    async (file: File) => {
      const validationError = validateImageFile(file);

      if (validationError) {
        setError(validationError);
        setStatus('error');
        return;
      }

      revokeAsset(sourceImage);
      revokeAsset(convertedImage);
      const nextSource = await toImageAsset(file);

      setSourceImage(nextSource);
      setConvertedImage(null);
      setOutputFormat(nextSource.format === 'webp' ? 'jpeg' : 'webp');
      setOutputWidth(nextSource.width);
      setOutputHeight(nextSource.height);
      setError(null);
      setStatus('ready');
      setProgress(0);
    },
    [convertedImage, sourceImage]
  );

  const convertCurrentImage = useCallback(async () => {
    if (!sourceImage) {
      return;
    }

    if (outputWidth < 1 || outputHeight < 1) {
      setError('Width and height must both be greater than zero.');
      setStatus('error');
      return;
    }

    setStatus('converting');
    setProgress(0);
    setError(null);

    try {
      revokeAsset(convertedImage);
      const result = await convertImage(sourceImage.file, outputFormat, quality, setProgress, {
        width: outputWidth,
        height: outputHeight,
      });
      setConvertedImage(result);
      setStatus('done');
      setProgress(100);
    } catch {
      setError('Conversion failed. Try another format or lower the quality setting.');
      setStatus('error');
      setProgress(0);
    }
  }, [convertedImage, outputFormat, outputHeight, outputWidth, quality, sourceImage]);

  useEffect(() => {
    return () => {
      revokeAsset(sourceImage);
      revokeAsset(convertedImage);
    };
  }, [convertedImage, sourceImage]);

  const value = useMemo<ConverterContextValue>(
    () => ({
      sourceImage,
      convertedImage,
      outputFormat,
      quality,
      outputWidth,
      outputHeight,
      error,
      status,
      progress,
      setOutputFormat,
      setQuality,
      setOutputWidth,
      setOutputHeight,
      setSourceFile,
      setExternalError,
      clearImages,
      convertCurrentImage,
    }),
    [
      clearImages,
      convertCurrentImage,
      convertedImage,
      error,
      outputFormat,
      outputHeight,
      outputWidth,
      progress,
      quality,
      setOutputHeight,
      setExternalError,
      setOutputWidth,
      setSourceFile,
      sourceImage,
      status,
    ]
  );

  return <ConverterContext.Provider value={value}>{children}</ConverterContext.Provider>;
}

export function useConverter() {
  const context = useContext(ConverterContext);

  if (!context) {
    throw new Error('useConverter must be used within a ConverterProvider');
  }

  return context;
}
