import assert from 'node:assert/strict';
import test from 'node:test';
import { royaFixture } from '../src/domain/fixtures.ts';
import type { RoyaFixture } from '../src/domain/types.ts';
import { computeLineTotal, RoyaDemoService } from '../src/services/royaDemoService.ts';

test('source cost strategies compute the two fixture totals in integer piastres', () => {
  assert.equal(computeLineTotal('weekly_x_weeks', { weekly_rate: 500_000, weeks: 4 }), 2_000_000);
  assert.equal(computeLineTotal('lump', { amount: 2_000_000 }), 2_000_000);
});

test('four to six weeks changes only the opted-in weekly line', async () => {
  const service = new RoyaDemoService();
  const preview = await service.previewShootingWeeks(6);

  assert.equal(preview.affectedLines.length, 1);
  assert.deepEqual(preview.affectedLines[0], {
    lineId: royaFixture.budget.lines[0]?.id,
    nameAr: 'طاقم الكاميرا الأسبوعي',
    nameEn: 'Weekly camera crew',
    costStrategy: 'weekly_x_weeks',
    currentTotalPiastres: 2_000_000,
    newTotalPiastres: 3_000_000,
    deltaPiastres: 1_000_000,
  });
  assert.equal(preview.budgetTotalBeforePiastres, 4_000_000);
  assert.equal(preview.budgetTotalAfterPiastres, 5_000_000);
  assert.equal(preview.totalDeltaPiastres, 1_000_000);
  assert.equal(preview.exceedsTotalBudget, true);
});

test('preview is isolated and reset preserves the saved four-week fixture', async () => {
  const service = new RoyaDemoService();
  await service.previewShootingWeeks(6);
  assert.equal((await service.getProject()).shootingWeeks, 4);
  assert.equal((await service.getBudgetSnapshot()).totalPlannedPiastres, 4_000_000);
  service.reset();
  assert.equal((await service.getProject()).shootingWeeks, 4);
  assert.deepEqual((await service.getBudgetSnapshot()).lines, royaFixture.budget.lines);
});

test('only approved candidates contribute to the aggregate delta', async () => {
  const draftCandidate = {
    ...royaFixture.budget.lines[0]!,
    id: 'a9b1f4d9-1454-44fa-b477-eece7b6cfa52',
    status: 'draft' as const,
  };
  const fixture: RoyaFixture = {
    project: royaFixture.project,
    budget: { ...royaFixture.budget, lines: [...royaFixture.budget.lines, draftCandidate] },
  };
  const preview = await new RoyaDemoService(fixture).previewShootingWeeks(6);
  assert.equal(preview.affectedLines.length, 2);
  assert.equal(preview.totalDeltaPiastres, 1_000_000);
  assert.equal(preview.budgetTotalAfterPiastres, 5_000_000);
});

test('proportional totals round to the nearest integer piastre', async () => {
  const roundingLine = {
    ...royaFixture.budget.lines[0]!,
    inputs: { weekly_rate: 0, weeks: 3, uses_project_weeks: true },
    plannedTotalPiastres: 10_001,
  };
  const fixture: RoyaFixture = {
    project: { ...royaFixture.project, shootingWeeks: 3, totalBudgetPiastres: 0 },
    budget: { ...royaFixture.budget, lines: [roundingLine] },
  };
  const preview = await new RoyaDemoService(fixture).previewShootingWeeks(4);
  assert.equal(preview.affectedLines[0]?.newTotalPiastres, 13_335);
  assert.equal(preview.totalDeltaPiastres, 3_334);
  assert.equal(preview.exceedsTotalBudget, false);
});

test('invalid week counts are rejected without changing the fixture', async () => {
  const service = new RoyaDemoService();
  await assert.rejects(() => service.previewShootingWeeks(0), RangeError);
  await assert.rejects(() => service.previewShootingWeeks(6.5), RangeError);
  await assert.rejects(() => service.previewShootingWeeks(521), RangeError);
  assert.equal((await service.getProject()).shootingWeeks, 4);
});
