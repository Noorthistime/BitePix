import { memo } from 'react';
import { formatBytes } from '../lib/imageUtils';
import { useConverter } from '../context/ConverterContext';

function ImageDetailsComponent() {
  const { sourceImage, clearImages } = useConverter();

  if (!sourceImage) {
    return (
      <section className="panel image-panel placeholder-panel" aria-labelledby="details-heading">
        <div className="panel-header">
          <p className="eyebrow">Source</p>
          <h2 id="details-heading">Image details</h2>
          <p className="muted">
            Upload an image to preview its file name, source format, and original size here.
          </p>
        </div>

        <div className="image-placeholder-shell" aria-hidden="true">
          <span className="placeholder-badge">Awaiting upload</span>
        </div>
      </section>
    );
  }

  return (
    <section className="panel image-panel" aria-labelledby="details-heading">
      <div className="panel-header panel-header-inline">
        <div>
          <p className="eyebrow">Source</p>
          <h2 id="details-heading">Image details</h2>
        </div>
        <button type="button" className="ghost-button" onClick={clearImages}>
          Remove
        </button>
      </div>

      <div className="image-preview-shell">
        <img
          className="image-preview"
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

export const ImageDetails = memo(ImageDetailsComponent);
