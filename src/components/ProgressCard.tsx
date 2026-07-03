import { memo } from 'react';
import { useConverter } from '../context/ConverterContext';

function ProgressCardComponent() {
  const { status, progress, error } = useConverter();

  const stageLabel =
    status === 'converting'
      ? 'Processing'
      : status === 'done'
        ? 'Ready to download'
        : status === 'error'
          ? 'Needs attention'
          : 'Waiting for input';

  return (
    <section className="panel progress-panel" aria-labelledby="progress-heading">
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
    </section>
  );
}

export const ProgressCard = memo(ProgressCardComponent);
