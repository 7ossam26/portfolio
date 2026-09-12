import { useEffect, useRef, useState } from 'react';
import type { BudgetSnapshot, Language, ProjectSummary, ShootingWeeksPreview } from '../domain/types';
import { copy } from '../copy';
import { formatPiastres } from '../format';

interface ShootingWeeksModalProps {
  readonly project: ProjectSummary;
  readonly budget: BudgetSnapshot;
  readonly language: Language;
  readonly onPreview: (weeks: number) => Promise<ShootingWeeksPreview>;
  readonly onClose: (previewed: boolean) => void;
}

export function ShootingWeeksModal({ project, budget, language, onPreview, onClose }: ShootingWeeksModalProps) {
  const [newWeeks, setNewWeeks] = useState(String(project.shootingWeeks));
  const [preview, setPreview] = useState<ShootingWeeksPreview | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose(preview !== null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, preview]);

  async function runPreview() {
    const parsed = Number(newWeeks);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 520) {
      setError(copy(language, 'invalidWeeks'));
      setPreview(null);
      return;
    }
    setPreviewing(true);
    setError(null);
    try {
      setPreview(await onPreview(parsed));
    } catch {
      setError(copy(language, 'invalidWeeks'));
      setPreview(null);
    } finally {
      setPreviewing(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose(preview !== null);
    }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="weeks-modal-title">
        <header className="modal-header">
          <div>
            <h2 id="weeks-modal-title">{copy(language, 'changeWeeks')}</h2>
            <p>{copy(language, 'modalSubtitle')}</p>
          </div>
          <button type="button" className="icon-button" onClick={() => onClose(preview !== null)} aria-label={copy(language, 'close')}>×</button>
        </header>

        <form onSubmit={(event) => { event.preventDefault(); void runPreview(); }}>
          <div className="weeks-fields">
            <div className="current-field">
              <span>{copy(language, 'current')}</span>
              <strong>{project.shootingWeeks}</strong>
            </div>
            <label className="number-field">
              <span>{copy(language, 'newValue')}</span>
              <input
                ref={inputRef}
                type="number"
                min="1"
                max="520"
                step="1"
                value={newWeeks}
                aria-invalid={error ? 'true' : undefined}
                onChange={(event) => {
                  setNewWeeks(event.target.value);
                  setPreview(null);
                  setError(null);
                }}
              />
            </label>
          </div>
          <div className="preview-action">
            <button type="submit" className="button secondary small" disabled={previewing}>
              {previewing ? <span className="spinner" aria-hidden="true" /> : null}
              {copy(language, 'previewImpact')}
            </button>
          </div>
        </form>

        {error ? <p className="form-error" role="alert">{error}</p> : null}

        {preview ? (
          <div className="impact-panel" data-preview-weeks={preview.requestedWeeks}>
            <div className="impact-stats">
              <div><span>{copy(language, 'before')}</span><strong>{formatPiastres(preview.budgetTotalBeforePiastres)}</strong></div>
              <div><span>{copy(language, 'after')}</span><strong>{formatPiastres(preview.budgetTotalAfterPiastres)}</strong></div>
              <div className="delta"><span>{copy(language, 'delta')}</span><strong>+{formatPiastres(preview.totalDeltaPiastres)}</strong></div>
            </div>
            {preview.exceedsTotalBudget ? <p className="cap-warning">{copy(language, 'capWarning')}</p> : null}
            <div className="impact-table-wrap">
              <table className="impact-table">
                <thead><tr><th>{copy(language, 'line')}</th><th>{copy(language, 'current')}</th><th>{copy(language, 'newValue')}</th><th>{copy(language, 'delta')}</th></tr></thead>
                <tbody>
                  {preview.affectedLines.map((line) => (
                    <tr key={line.lineId}>
                      <td><strong>{language === 'ar' ? line.nameAr : line.nameEn}</strong><span>{copy(language, 'inherited')}</span></td>
                      <td>{formatPiastres(line.currentTotalPiastres)}</td>
                      <td>{formatPiastres(line.newTotalPiastres)}</td>
                      <td className="positive">+{formatPiastres(line.deltaPiastres)}</td>
                    </tr>
                  ))}
                  {budget.lines.filter((line) => line.costStrategy === 'lump').map((line) => (
                    <tr className="unchanged-row" key={line.id}>
                      <td><strong>{language === 'ar' ? line.nameAr : line.nameEn}</strong><span>{copy(language, 'lumpStrategy')}</span></td>
                      <td>{formatPiastres(line.plannedTotalPiastres)}</td>
                      <td>{formatPiastres(line.plannedTotalPiastres)}</td>
                      <td>{copy(language, 'unchanged')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <footer className="modal-footer">
          <p><span aria-hidden="true">◇</span>{copy(language, 'previewOnly')}</p>
          <button type="button" className="button secondary" onClick={() => onClose(preview !== null)}>{copy(language, 'cancel')}</button>
        </footer>
      </section>
    </div>
  );
}
