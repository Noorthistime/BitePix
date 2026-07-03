import { memo, useMemo } from 'react';
import { SUPPORTED_FORMATS } from '../types';
import { useConverter } from '../context/ConverterContext';

function ControlPanelComponent() {
  const {
    sourceImage,
    outputFormat,
    quality,
    outputWidth,
    outputHeight,
    setOutputFormat,
    setQuality,
    setOutputWidth,
    setOutputHeight,
    convertCurrentImage,
    status,
  } = useConverter();

  const controlsDisabled = !sourceImage || status === 'converting';

  const formatOptions = useMemo(
    () =>
      SUPPORTED_FORMATS.map((format) => ({
        label: format.toUpperCase(),
        value: format,
      })),
    []
  );

  return (
    <section className="panel control-panel" aria-labelledby="controls-heading">
      <div className="panel-header">
        <p className="eyebrow">Step 2</p>
        <h2 id="controls-heading">Conversion controls</h2>
        <p className="muted">
          Choose the target format and fine-tune the compression quality before converting.
        </p>
      </div>

      <div className="field-group">
        <label className="field" htmlFor="output-format">
          <span>
            Output format
            <span className="tooltip" title="Choose the file type for the converted image.">
              i
            </span>
          </span>
          <div className="select-shell">
            <select
              id="output-format"
              value={outputFormat}
              onChange={(event) => setOutputFormat(event.target.value as typeof outputFormat)}
              disabled={controlsDisabled}
            >
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="select-arrow" aria-hidden="true">
              <span />
            </span>
          </div>
        </label>

        <label className="field" htmlFor="quality-range">
          <span className="field-label">
            Quality
            <span className="tooltip" title="Higher quality keeps more detail but may create a larger file.">
              i
            </span>
          </span>
          <div className="range-header">
            <span>{quality}%</span>
            <span className="muted">1 to 100</span>
          </div>
          <input
            id="quality-range"
            type="range"
            min="1"
            max="100"
            value={quality}
            disabled={controlsDisabled}
            onChange={(event) => setQuality(Number(event.target.value))}
          />
        </label>

        <div className="dimension-grid">
          <label className="field" htmlFor="output-width">
            <span className="field-label">
              Width
              <span className="tooltip" title="Set the exact output width in pixels.">
                i
              </span>
            </span>
            <input
              id="output-width"
              type="number"
              min="1"
              inputMode="numeric"
              value={outputWidth || ''}
              disabled={controlsDisabled}
              onChange={(event) => setOutputWidth(Number(event.target.value))}
            />
          </label>

          <label className="field" htmlFor="output-height">
            <span className="field-label">
              Height
              <span className="tooltip" title="Set the exact output height in pixels.">
                i
              </span>
            </span>
            <input
              id="output-height"
              type="number"
              min="1"
              inputMode="numeric"
              value={outputHeight || ''}
              disabled={controlsDisabled}
              onChange={(event) => setOutputHeight(Number(event.target.value))}
            />
          </label>
        </div>
      </div>

      <button
        type="button"
        className="primary-button"
        onClick={() => void convertCurrentImage()}
        disabled={controlsDisabled}
        title="Convert the uploaded image to the selected format"
      >
        {status === 'converting' ? 'Converting...' : 'Convert image'}
      </button>
    </section>
  );
}

export const ControlPanel = memo(ControlPanelComponent);
