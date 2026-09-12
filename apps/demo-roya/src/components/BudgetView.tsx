import type { BudgetLine, BudgetSnapshot, Language } from '../domain/types';
import { copy } from '../copy';
import { formatPiastres } from '../format';

function strategyLabel(line: BudgetLine, language: Language): string {
  if (line.costStrategy === 'weekly_x_weeks') {
    return `${formatPiastres(Number(line.inputs.weekly_rate ?? 0))} × ${line.inputs.weeks}`;
  }
  return formatPiastres(Number(line.inputs.amount ?? 0));
}

export function BudgetView({ budget, language }: { budget: BudgetSnapshot; language: Language }) {
  return (
    <section className="content-card budget-view" aria-labelledby="budget-heading">
      <header className="section-heading">
        <div>
          <div className="heading-line">
            <h2 id="budget-heading">{copy(language, 'budget')}</h2>
            <span>{copy(language, 'version')}</span>
          </div>
          <p>{copy(language, 'budgetIntro')}</p>
        </div>
        <strong className="section-total">{formatPiastres(budget.totalPlannedPiastres)}</strong>
      </header>

      <div className="budget-table" role="list" aria-label={copy(language, 'budget')}>
        {budget.lines.map((line) => (
          <article className="budget-row" role="listitem" key={line.id} data-line-id={line.id}>
            <div className="line-number" aria-hidden="true">{String(line.lineNumber).padStart(2, '0')}</div>
            <div className="line-copy">
              <span className="department-name">
                {line.costStrategy === 'weekly_x_weeks'
                  ? copy(language, 'shootingCrew')
                  : copy(language, 'equipment')}
              </span>
              <h3>{line.costStrategy === 'weekly_x_weeks'
                ? copy(language, 'weeklyCrew')
                : copy(language, 'fixedEquipment')}</h3>
              <div className="line-meta">
                <span>{line.costStrategy === 'weekly_x_weeks'
                  ? copy(language, 'weeklyStrategy')
                  : copy(language, 'lumpStrategy')}</span>
                <span>{strategyLabel(line, language)}</span>
                <span>{copy(language, 'noVat')}</span>
              </div>
            </div>
            <span className="status-pill">{copy(language, 'approved')}</span>
            <strong className="line-total">{formatPiastres(line.plannedTotalPiastres)}</strong>
          </article>
        ))}
      </div>

      <footer className="budget-footer">
        <span>{copy(language, 'plannedApproved')}</span>
        <strong>{formatPiastres(budget.totalPlannedPiastres)}</strong>
      </footer>
    </section>
  );
}
