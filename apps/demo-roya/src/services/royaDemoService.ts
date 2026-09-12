import { royaFixture } from '../domain/fixtures.ts';
import type {
  BudgetLine,
  BudgetSnapshot,
  CostStrategy,
  ProjectSummary,
  RoyaFixture,
  ShootingWeeksPreview,
} from '../domain/types.ts';

function clone<T>(value: T): T {
  return structuredClone(value);
}

export function computeLineTotal(
  strategy: CostStrategy,
  inputs: Readonly<Record<string, number | boolean>>,
): number {
  switch (strategy) {
    case 'lump':
      return Number(inputs.amount ?? 0);
    case 'weekly_x_weeks':
      return Number(inputs.weekly_rate ?? 0) * Number(inputs.weeks ?? 0);
    case 'daily_x_days':
      return Number(inputs.daily_rate ?? 0) * Number(inputs.days ?? 0);
    case 'units_x_rate_x_duration':
      return Number(inputs.units ?? 0)
        * Number(inputs.rate_per_unit ?? 0)
        * Number(inputs.days_per_week ?? 0)
        * Number(inputs.weeks ?? 0);
    case 'per_episode':
      return Number(inputs.rate_per_episode ?? 0) * Number(inputs.episodes ?? 0);
  }
}

function isWeeksCandidate(line: BudgetLine): boolean {
  return (line.costStrategy === 'weekly_x_weeks'
      || line.costStrategy === 'units_x_rate_x_duration')
    && line.inputs.uses_project_weeks === true;
}

function approvedTotal(lines: readonly BudgetLine[]): number {
  return lines.reduce(
    (total, line) => line.status === 'approved' ? total + line.plannedTotalPiastres : total,
    0,
  );
}

export class RoyaDemoService {
  private fixture: RoyaFixture;

  constructor(seed: RoyaFixture = royaFixture) {
    this.fixture = clone(seed);
  }

  async getProject(): Promise<ProjectSummary> {
    return clone(this.fixture.project);
  }

  async getBudgetSnapshot(): Promise<BudgetSnapshot> {
    const budget = this.fixture.budget;
    return clone({
      ...budget,
      totalPlannedPiastres: approvedTotal(budget.lines),
    });
  }

  async previewShootingWeeks(newWeeks: number): Promise<ShootingWeeksPreview> {
    if (!Number.isInteger(newWeeks) || newWeeks < 1 || newWeeks > 520) {
      throw new RangeError('Shooting weeks must be a whole number from 1 to 520.');
    }

    const { project, budget } = this.fixture;
    const candidates = budget.lines.filter(isWeeksCandidate);
    const affectedLines = candidates.map((line) => {
      const oldWeeks = Number(line.inputs.weeks ?? 0);
      const current = line.plannedTotalPiastres;
      const newTotal = oldWeeks > 0
        ? Math.round((current / oldWeeks) * newWeeks)
        : current;
      return {
        lineId: line.id,
        nameAr: line.nameAr,
        nameEn: line.nameEn,
        costStrategy: line.costStrategy,
        currentTotalPiastres: current,
        newTotalPiastres: newTotal,
        deltaPiastres: newTotal - current,
      };
    });
    const totalDeltaPiastres = candidates.reduce((total, line, index) => (
      line.status === 'approved'
        ? total + (affectedLines[index]?.deltaPiastres ?? 0)
        : total
    ), 0);
    const budgetTotalBeforePiastres = approvedTotal(budget.lines);
    const budgetTotalAfterPiastres = budgetTotalBeforePiastres + totalDeltaPiastres;

    return clone({
      requestedWeeks: newWeeks,
      affectedLines,
      totalDeltaPiastres,
      budgetTotalBeforePiastres,
      budgetTotalAfterPiastres,
      exceedsTotalBudget: project.totalBudgetPiastres > 0
        && budgetTotalAfterPiastres > project.totalBudgetPiastres,
    });
  }

  reset(): void {
    this.fixture = clone(royaFixture);
  }
}
