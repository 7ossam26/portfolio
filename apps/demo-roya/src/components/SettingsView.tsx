import { forwardRef } from 'react';
import type { Language, ProjectSummary } from '../domain/types';
import { copy } from '../copy';
import { formatPercent, formatPiastres } from '../format';

export const SettingsView = forwardRef<HTMLButtonElement, {
  project: ProjectSummary;
  language: Language;
  onOpenWeeks: () => void;
}>(function SettingsView({ project, language, onOpenWeeks }, ref) {
  return (
    <div className="settings-grid">
      <section className="content-card" aria-labelledby="financial-heading">
        <header className="section-heading compact">
          <div>
            <h2 id="financial-heading">{copy(language, 'financialSettings')}</h2>
            <p>{copy(language, 'fixtureSettings')}</p>
          </div>
        </header>
        <dl className="settings-list">
          <div><dt>{copy(language, 'contingency')}</dt><dd>{formatPercent(project.contingencyRate)}</dd></div>
          <div><dt>{copy(language, 'producerMargin')}</dt><dd>{formatPiastres(project.producerMarginPiastres)}</dd></div>
          <div><dt>{copy(language, 'vatRate')}</dt><dd>{formatPercent(project.vatRate)}</dd></div>
          <div><dt>{copy(language, 'sourceRule')}</dt><dd>{copy(language, 'approvedLinesOnly')}</dd></div>
        </dl>
      </section>

      <section className="content-card weeks-card" aria-labelledby="weeks-heading">
        <header className="section-heading compact">
          <div>
            <h2 id="weeks-heading">{copy(language, 'shootingWeeks')}</h2>
            <p>{copy(language, 'shootingWeeksDescription')}</p>
          </div>
        </header>
        <div className="weeks-action">
          <div><strong>{project.shootingWeeks}</strong><span>{copy(language, 'weeksUnit')}</span></div>
          <button ref={ref} type="button" className="button secondary" onClick={onOpenWeeks}>
            {copy(language, 'changeWeeks')}
          </button>
        </div>
      </section>
    </div>
  );
});
