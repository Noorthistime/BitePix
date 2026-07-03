import { memo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { MAX_FILE_SIZE_BYTES, formatBytes } from '../lib/imageUtils';
import { useConverter } from '../context/ConverterContext';

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

function UploadZoneComponent() {
  const { setSourceFile, setExternalError, error, sourceImage, clearImages } = useConverter();

  const onDrop = useCallback(
    (files: File[]) => {
      const [file] = files;

      if (file) {
        setSourceFile(file);
      }
    },
    [setSourceFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    onDropRejected: () => {
      setExternalError('Only JPG, JPEG, PNG, and WebP images up to 50MB are allowed.');
    },
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES,
  });

  if (sourceImage) {
    return (
      <section className="panel upload-panel" aria-labelledby="details-heading">
        <div className="panel-header panel-header-inline">
          <div>
            <p className="eyebrow">Source</p>
            <h2 id="details-heading">Image details</h2>
          </div>
          <button type="button" className="ghost-button" onClick={clearImages}>
            Remove
          </button>
        </div>

        <div className="image-preview-shell" style={{ height: '15.5rem', aspectRatio: 'auto' }}>
          <img
            className="image-preview"
            style={{ objectFit: 'contain' }}
            src={sourceImage.previewUrl}
            alt={`Preview of ${sourceImage.file.name}`}
          />
        </div>

        <dl className="detail-grid">
          <div>
            <dt>File name</dt>
            <dd>{sourceImage.file.name}</dd>
          </div>
          <div>
            <dt>Original size</dt>
            <dd>{formatBytes(sourceImage.file.size)}</dd>
          </div>
          <div>
            <dt>Original format</dt>
            <dd>{sourceImage.format.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Original dimensions</dt>
            <dd>
              {sourceImage.width} x {sourceImage.height}px
            </dd>
          </div>
        </dl>
      </section>
    );
  }

  return (
    <section className="panel upload-panel" aria-labelledby="upload-heading">
      <div className="panel-header">
        <p className="eyebrow">Step 1</p>
        <h2 id="upload-heading">Upload an image</h2>
        <p className="muted">
          Drag and drop a JPEG, PNG, or WebP image, or browse your device.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${isDragReject ? 'dropzone-reject' : ''}`}
        role="button"
        tabIndex={0}
        aria-labelledby="upload-heading"
        aria-describedby="upload-help upload-error"
      >
        <input
          {...getInputProps({
            'aria-label': 'Upload image',
            'aria-describedby': 'upload-help upload-error',
          })}
        />
        <div className="dropzone-icon" aria-hidden="true">
          <span />
        </div>
        <p className="dropzone-title">
          {isDragActive ? 'Release to upload your image' : 'Drop your image here'}
        </p>
        <p className="muted" id="upload-help">
          Or click to browse. Maximum file size: 50MB.
        </p>
        <span className="browse-chip">Choose file</span>
      </div>

      <p className="assistive-text" id="upload-error" aria-live="polite">
        {error ?? ''}
      </p>
    </section>
  );
}

export const UploadZone = memo(UploadZoneComponent);
