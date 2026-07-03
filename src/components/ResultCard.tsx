import { memo } from 'react';
import { buildDownloadName, formatBytes } from '../lib/imageUtils';
import { useConverter } from '../context/ConverterContext';

function ResultCardComponent() {
  const { convertedImage, outputFormat, sourceImage, status, progress, error } = useConverter();

  const stageLabel =
    status === 'converting'
      ? 'Processing'
      : status === 'done'
        ? 'Ready to download'
        : status === 'error'
          ? 'Needs attention'
          : 'Waiting for input';

  const progressJsx = (
    <div style={{ marginBottom: '2.5rem' }}>
      <div className="panel-header panel-header-inline">
        <div>
          <p className="eyebrow">Step 3</p>
          <h2 id="progress-heading">Progress tracker</h2>
        </div>
        <span className={`status-badge status-${status}`}>{stageLabel}</span>
      </div>

      <div className="progress-track" aria-hidden="true">
        <span className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="progress-meta" aria-live="polite">
        <span>{progress}% complete</span>
        <span className="muted">
          {status === 'converting'
            ? 'Optimizing image data in your browser'
            : 'Your files stay on this device'}
        </span>
      </div>

      {error ? (
        <p className="error-banner" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );

  if (!convertedImage || !sourceImage) {
    return (
      <section className="panel result-panel" aria-labelledby="download-heading">
        {progressJsx}

        <div className="panel-header">
          <p className="eyebrow">Step 4</p>
          <h2 id="download-heading">Download your file</h2>
          <p className="muted">
            Converted output appears here after processing is complete.
          </p>
        </div>
      </section>
    );
  }

  const downloadName = buildDownloadName(sourceImage.file.name, outputFormat);

  return (
    <section className="panel result-panel" aria-labelledby="download-heading">
      {progressJsx}

      <div className="panel-header">
        <p className="eyebrow">Step 4</p>
        <h2 id="download-heading">Download your file</h2>
        <p className="muted">The converted image is ready with the correct MIME type.</p>
      </div>

      <div className="image-preview-shell compact">
        <img
          className="image-preview"
          src={convertedImage.previewUrl}
          alt={`Converted preview for ${downloadName}`}
        />
      </div>

      <dl className="detail-grid">
        <div>
          <dt>Output name</dt>
          <dd>{downloadName}</dd>
        </div>
        <div>
          <dt>Output size</dt>
          <dd>{formatBytes(convertedImage.file.size)}</dd>
        </div>
        <div>
          <dt>Output format</dt>
          <dd>{outputFormat.toUpperCase()}</dd>
        </div>
        <div>
          <dt>Output dimensions</dt>
          <dd>
            {convertedImage.width} x {convertedImage.height}px
          </dd>
        </div>
      </dl>

      <a
        className="primary-button"
        href={convertedImage.previewUrl}
        download={downloadName}
        title="Download the converted image to your device"
      >
        Download converted image
      </a>
    </section>
  );
}

export const ResultCard = memo(ResultCardComponent);
