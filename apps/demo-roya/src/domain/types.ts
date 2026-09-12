export type Language = 'ar' | 'en';
export type CostStrategy =
  | 'lump'
  | 'weekly_x_weeks'
  | 'daily_x_days'
  | 'units_x_rate_x_duration'
  | 'per_episode';
export type BudgetLineStatus = 'draft' | 'approved' | 'excluded';

export interface ProjectSummary {
  readonly id: string;
  readonly code: string;
  readonly titleAr: string;
  readonly titleEn: string;
  readonly kind: 'film' | 'series' | 'tv_show';
  readonly shootingWeeks: number;
  readonly totalBudgetPiastres: number;
  readonly baseCurrency: 'EGP';
  readonly contingencyBasis: 'percentage' | 'fixed';
  readonly contingencyRate: number | null;
  readonly contingencyPiastres: number | null;
  readonly producerMarginPiastres: number;
  readonly vatRate: number;
  readonly status: 'active';
}

export interface BudgetLine {
  readonly id: string;
  readonly lineNumber: number;
  readonly departmentAr: string;
  readonly departmentEn: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly costStrategy: CostStrategy;
  readonly inputs: Readonly<Record<string, number | boolean>>;
  readonly plannedTotalPiastres: number;
  readonly currency: 'EGP';
  readonly vatApplicable: boolean;
  readonly status: BudgetLineStatus;
}

export interface BudgetSnapshot {
  readonly versionNumber: number;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly totalPlannedPiastres: number;
  readonly lines: readonly BudgetLine[];
}

export interface AffectedBudgetLine {
  readonly lineId: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly costStrategy: CostStrategy;
  readonly currentTotalPiastres: number;
  readonly newTotalPiastres: number;
  readonly deltaPiastres: number;
}

export interface ShootingWeeksPreview {
  readonly requestedWeeks: number;
  readonly affectedLines: readonly AffectedBudgetLine[];
  readonly totalDeltaPiastres: number;
  readonly budgetTotalBeforePiastres: number;
  readonly budgetTotalAfterPiastres: number;
  readonly exceedsTotalBudget: boolean;
}

export interface RoyaFixture {
  readonly project: ProjectSummary;
  readonly budget: Omit<BudgetSnapshot, 'totalPlannedPiastres'>;
}
