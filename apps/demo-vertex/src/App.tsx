import { useCallback, useEffect, useState } from 'react';
import type { ProductionOrder, VertexSnapshot } from './domain/types.ts';
import { vertexDemoService } from './services/vertexDemoService.ts';
import { BomManager } from './components/BomManager.tsx';
import { InventoryView } from './components/InventoryView.tsx';
import { ProductionHistory } from './components/ProductionHistory.tsx';
import { Icon } from './components/Icon.tsx';
import { isEmbedded, postDemoMessage } from './frameBridge.ts';

type View = 'recipes' | 'inventory' | 'history';

export default function App() {
  const [snapshot, setSnapshot] = useState<VertexSnapshot | null>(null);
  const [view, setView] = useState<View>('recipes');
  const [notice, setNotice] = useState('');
  const [loadError, setLoadError] = useState('');

  const refresh = useCallback(async () => {
    setSnapshot(await vertexDemoService.getSnapshot());
  }, []);

  useEffect(() => {
    refresh().catch(() => {
      setLoadError('تعذر تجهيز البيانات التجريبية.');
      postDemoMessage('ERROR', { message: 'The local Vertex sample could not be prepared.' });
    });
  }, [refresh]);

  useEffect(() => {
    if (!snapshot) return;
    const frame = window.requestAnimationFrame(() => postDemoMessage('READY'));
    return () => window.cancelAnimationFrame(frame);
  }, [snapshot]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || document.querySelector('[data-vertex-modal]')) return;
      postDemoMessage('REQUEST_CLOSE');
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const changeView = (nextView: View) => {
    setView(nextView);
    const guidance = nextView === 'recipes'
      ? 'Choose the prepared recipe and review its material requirements.'
      : nextView === 'inventory'
        ? 'The stock table reflects the same local production transaction.'
        : 'Expand the newest order to reconcile quantities and cost.';
    postDemoMessage('STEP_CHANGED', { guidance });
  };

  const handleSuccess = async (order: ProductionOrder) => {
    await refresh();
    setNotice(`تم تنفيذ أمر الإنتاج #${order.id} بنجاح. راجع المخزون أو سجل الإنتاج.`);
    changeView('history');
    postDemoMessage('COMPLETE', { guidance: 'Production completed. Inspect the expanded order, then review stock or reset the sample.' });
  };

  const reset = async () => {
    vertexDemoService.reset();
    await refresh();
    setView('recipes');
    setNotice('تمت استعادة كل بيانات العينة.');
    postDemoMessage('STEP_CHANGED', { guidance: 'The complete Vertex sample seed has been restored.' });
  };

  if (loadError) return <main className="min-h-screen grid place-items-center p-6"><p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{loadError}</p></main>;
  if (!snapshot) return <main className="min-h-screen grid place-items-center p-6"><p className="text-gray-500">جاري تجهيز بيانات Vertex التجريبية…</p></main>;

  return (
    <div className="min-h-screen bg-background-light text-text-light font-body" dir="rtl">
      <header className="demo-toolbar">
        <div className="flex items-center gap-3 min-w-0"><span className="vertex-logo">v:</span><div className="min-w-0"><p className="font-bold leading-tight">Vertex ERP</p><p className="text-xs text-gray-500 truncate">{snapshot.persona.name} · {snapshot.branch.name}</p></div></div>
        <div className="flex items-center gap-2 shrink-0"><span className="sample-badge">بيانات تجريبية</span>{!isEmbedded && <><button type="button" onClick={reset} className="toolbar-action">إعادة الضبط</button><a href="/work/vertex/" className="toolbar-action">العودة للملف</a></>}</div>
      </header>

      <nav className="view-nav" aria-label="أقسام تجربة Vertex">
        <button type="button" onClick={() => changeView('recipes')} aria-current={view === 'recipes' ? 'page' : undefined}><Icon name="recipe" className="size-4" />الوصفة</button>
        <button type="button" onClick={() => changeView('inventory')} aria-current={view === 'inventory' ? 'page' : undefined}><Icon name="inventory" className="size-4" />المخزون</button>
        <button type="button" onClick={() => changeView('history')} aria-current={view === 'history' ? 'page' : undefined}><Icon name="history" className="size-4" />سجل الإنتاج</button>
      </nav>

      {notice && <div className="status-notice" role="status"><Icon name="check" className="size-5" /><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="إخفاء الرسالة"><Icon name="close" className="size-4" /></button></div>}

      <main className="p-4 sm:p-6 lg:p-8">
        {view === 'recipes' && <BomManager boms={snapshot.boms} inventory={snapshot.inventory} warehouses={snapshot.warehouses} service={vertexDemoService} onSuccess={handleSuccess} onShowHistory={() => changeView('history')} />}
        {view === 'inventory' && <InventoryView branch={snapshot.branch} inventory={snapshot.inventory} onBack={() => changeView('recipes')} />}
        {view === 'history' && <ProductionHistory orders={snapshot.orders} onBack={() => changeView('recipes')} />}
      </main>
    </div>
  );
}
