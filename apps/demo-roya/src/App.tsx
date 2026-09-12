import { useCallback, useEffect, useRef, useState } from 'react';
import { BudgetView } from './components/BudgetView';
import { SettingsView } from './components/SettingsView';
import { ShootingWeeksModal } from './components/ShootingWeeksModal';
import { copy } from './copy';
import type { BudgetSnapshot, Language, ProjectSummary, ShootingWeeksPreview } from './domain/types';
import { formatPiastres } from './format';
import { isEmbedded, postDemoMessage } from './frameBridge';
import { RoyaDemoService } from './services/royaDemoService';

type Tab = 'budget' | 'settings';

export default function App() {
  const serviceRef = useRef<RoyaDemoService | null>(null);
  if (!serviceRef.current) serviceRef.current = new RoyaDemoService();
  const service = serviceRef.current;
  const changeWeeksButtonRef = useRef<HTMLButtonElement>(null);
  const [project, setProject] = useState<ProjectSummary | null>(null);
  const [budget, setBudget] = useState<BudgetSnapshot | null>(null);
  const [language, setLanguage] = useState<Language>('ar');
  const [tab, setTab] = useState<Tab>('budget');
  const [showWeeksModal, setShowWeeksModal] = useState(false);

  const loadFixture = useCallback(async () => {
    const [nextProject, nextBudget] = await Promise.all([
      service.getProject(),
      service.getBudgetSnapshot(),
    ]);
    setProject(nextProject);
    setBudget(nextBudget);
  }, [service]);

  useEffect(() => {
    void loadFixture().catch(() => {
      postDemoMessage('ERROR', { message: 'The local sample data could not be prepared.' });
    });
  }, [loadFixture]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (!project || !budget) return;
    const frame = window.requestAnimationFrame(() => postDemoMessage('READY'));
    return () => window.cancelAnimationFrame(frame);
  }, [budget, project]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || showWeeksModal) return;
      postDemoMessage('REQUEST_CLOSE');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showWeeksModal]);

  function changeTab(next: Tab) {
    setTab(next);
    postDemoMessage('STEP_CHANGED', {
      guidance: next === 'settings'
        ? 'Open Change shooting weeks, enter 6, and preview the local calculation.'
        : 'Inspect the approved weekly and fixed lines in the fictional active budget.',
    });
  }

  function openWeeksModal() {
    setShowWeeksModal(true);
    postDemoMessage('STEP_CHANGED', {
      guidance: 'Change the proposed value from 4 to 6, then select Preview impact.',
    });
  }

  const closeWeeksModal = useCallback((previewed: boolean) => {
    setShowWeeksModal(false);
    window.requestAnimationFrame(() => changeWeeksButtonRef.current?.focus());
    if (previewed) {
      postDemoMessage('COMPLETE', {
        guidance: 'Preview cancelled. The saved sample remains at 4 weeks and EGP 40,000.',
      });
    }
  }, []);

  async function previewWeeks(weeks: number): Promise<ShootingWeeksPreview> {
    const preview = await service.previewShootingWeeks(weeks);
    postDemoMessage('STEP_CHANGED', {
      guidance: 'Compare the affected weekly line with the unchanged fixed line, then Cancel.',
    });
    return preview;
  }

  async function resetDemo() {
    service.reset();
    setLanguage('ar');
    setTab('budget');
    setShowWeeksModal(false);
    await loadFixture();
    postDemoMessage('STEP_CHANGED', {
      guidance: 'The project, active budget, language, and preview state were reset.',
    });
  }

  if (!project || !budget) {
    return <main className="local-loading" aria-live="polite"><span className="spinner" />Roya</main>;
  }

  const title = language === 'ar' ? project.titleAr : project.titleEn;

  return (
    <div className="demo-root" data-tab={tab} data-language={language} data-saved-weeks={project.shootingWeeks}>
      <section className="demo-control-bar" dir="ltr" aria-label="Demo controls">
        <div className="sample-label"><span className="sample-dot" />{copy(language, 'sample')}</div>
        {!isEmbedded ? (
          <div className="standalone-actions">
            <button type="button" onClick={() => void resetDemo()}>{copy(language, 'reset')}</button>
            <a href="/work/roya/">{copy(language, 'backPortfolio')}</a>
          </div>
        ) : null}
      </section>

      <header className="app-header">
        <a className="roya-mark" href="#project" aria-label="Roya">Roya<span>.</span></a>
        <div className="header-divider" />
        <span className="projects-label">{copy(language, 'projects')}</span>
        <button
          type="button"
          className="language-toggle"
          aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        >
          {language === 'ar' ? 'EN' : 'عربي'}
        </button>
      </header>

      <main className="app-main" id="project">
        <section className="project-intro">
          <div>
            <p className="project-code">{project.code}</p>
            <div className="title-row"><h1>{title}</h1><span className="active-pill"><i />{copy(language, 'active')}</span></div>
            <p>{copy(language, 'film')} · {project.shootingWeeks} {copy(language, 'weeksUnit')}</p>
          </div>
          <dl className="project-kpis">
            <div><dt>{copy(language, 'totalBudget')}</dt><dd>{formatPiastres(project.totalBudgetPiastres)}</dd></div>
            <div><dt>{copy(language, 'plannedApproved')}</dt><dd>{formatPiastres(budget.totalPlannedPiastres)}</dd></div>
            <div><dt>{copy(language, 'shootingWeeks')}</dt><dd>{project.shootingWeeks}</dd></div>
          </dl>
        </section>

        <nav className="project-tabs" role="tablist" aria-label={title}>
          <button type="button" role="tab" aria-selected={tab === 'budget'} onClick={() => changeTab('budget')}>{copy(language, 'budget')}</button>
          <button type="button" role="tab" aria-selected={tab === 'settings'} onClick={() => changeTab('settings')}>{copy(language, 'settings')}</button>
        </nav>

        <div className="tab-content" role="tabpanel">
          {tab === 'budget'
            ? <BudgetView budget={budget} language={language} />
            : <SettingsView ref={changeWeeksButtonRef} project={project} language={language} onOpenWeeks={openWeeksModal} />}
        </div>
      </main>

      {showWeeksModal ? (
        <ShootingWeeksModal
          project={project}
          budget={budget}
          language={language}
          onPreview={previewWeeks}
          onClose={closeWeeksModal}
        />
      ) : null}
    </div>
  );
}
