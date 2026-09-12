import { useMemo, useState } from 'react';
import type { CarSummary } from '../domain/types';
import { CarCard } from './CarCard';
import { Icon } from './Icon';

interface Props {
  readonly cars: readonly CarSummary[];
  readonly onSelect: (car: CarSummary) => void;
}

export function MarketplaceView({ cars, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [transmission, setTransmission] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visibleCars = useMemo(() => cars.filter((car) => {
    const query = search.trim().toLocaleLowerCase('ar');
    const queryMatches = !query || `${car.carType} ${car.model} ${car.color}`.toLocaleLowerCase('ar').includes(query);
    return queryMatches && (!transmission || car.transmission === transmission);
  }), [cars, search, transmission]);

  return (
    <main className="marketplace-view" id="main-content">
      <div className="marketplace-heading">
        <div>
          <p className="section-kicker">مخزون محلي خيالي</p>
          <h1>كل العربيات</h1>
          <p>{visibleCars.length} عربية متاحة للتجربة</p>
        </div>
        <label className="search-control">
          <span className="sr-only">ابحث عن عربية</span>
          <Icon name="search" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث…" />
        </label>
      </div>

      <button className="mobile-filter-toggle" type="button" onClick={() => setFiltersOpen((value) => !value)} aria-expanded={filtersOpen}>
        <Icon name="settings" /> الفلاتر
      </button>

      <div className="marketplace-grid">
        <section className="car-grid" aria-label="العربيات التجريبية">
          {visibleCars.map((car) => <CarCard key={car.id} car={car} onSelect={onSelect} />)}
          {visibleCars.length === 0 && <p className="empty-state">مفيش عربيات بتطابق البحث ده.</p>}
        </section>
        <aside className={`filter-sidebar ${filtersOpen ? 'filter-sidebar-open' : ''}`}>
          <div className="filter-title">
            <h2>الفلاتر</h2>
            <button type="button" onClick={() => { setTransmission(''); setSearch(''); }}>مسح الكل</button>
          </div>
          <fieldset>
            <legend>ناقل الحركة</legend>
            <label><input type="radio" name="transmission" checked={transmission === ''} onChange={() => setTransmission('')} /> الكل</label>
            <label><input type="radio" name="transmission" checked={transmission === 'automatic'} onChange={() => setTransmission('automatic')} /> أوتوماتيك</label>
            <label><input type="radio" name="transmission" checked={transmission === 'manual'} onChange={() => setTransmission('manual')} /> عادي</label>
          </fieldset>
          <div className="filter-note">
            <strong>حدود التجربة</strong>
            <span>بحث وفلترة واختيار فقط. لا تحميل ولا بيانات خارجية.</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
