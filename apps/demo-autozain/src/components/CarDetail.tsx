import type { CarSummary } from '../domain/types';
import { Icon } from './Icon';

const formatNumber = new Intl.NumberFormat('ar-EG');

interface Props {
  readonly car: CarSummary;
  readonly onBack: () => void;
  readonly onContact: () => void;
}

export function CarDetail({ car, onBack, onContact }: Props) {
  return (
    <main className="detail-view" id="main-content">
      <button type="button" className="breadcrumb" onClick={onBack}>العربيات <Icon name="arrow" /> {car.carType} {car.model}</button>
      <div className="detail-grid">
        <section className="detail-main">
          <figure className="detail-image">
            <img src={car.images[0]} alt={`${car.carType} ${car.model} — صورة تجريبية مولّدة`} />
            <figcaption>صورة خيالية مولّدة لهذا العرض المحلي.</figcaption>
          </figure>
          <div className="surface detail-title">
            <div>
              <p className="section-kicker">سيارة تجريبية · {car.year}</p>
              <h1>{car.carType} {car.model}</h1>
              <p className="price">{formatNumber.format(car.listingPrice)} ج.م</p>
            </div>
            <button type="button" className="favorite-button static" aria-label="إضافة للمفضلة (عرض فقط)"><Icon name="heart" /></button>
          </div>
          <section className="surface specs">
            <h2>المواصفات</h2>
            <div className="spec-grid">
              <span><small>العداد</small>{formatNumber.format(car.odometer)} كم</span>
              <span><small>ناقل الحركة</small>{car.transmission === 'automatic' ? 'أوتوماتيك' : 'عادي'}</span>
              <span><small>اللون</small>{car.color}</span>
              <span><small>الوقود</small>{car.fuelType === 'benzine' ? 'بنزين' : car.fuelType === 'hybrid' ? 'هايبرد' : 'كهرباء'}</span>
            </div>
          </section>
          <section className="surface additional-info">
            <h2>معلومات إضافية</h2>
            <p>{car.additionalInfo}</p>
          </section>
        </section>
        <aside className="surface contact-card">
          <Icon name="user" />
          <h2>عجبتك العربية؟</h2>
          <p>اختار موظف تجريبي وابعث طلب محلي لمتابعة السيناريو.</p>
          <button type="button" className="primary-button" onClick={onContact}>تواصل مع موظف</button>
          <small>لن يتم إجراء مكالمة أو إرسال رسالة.</small>
        </aside>
      </div>
    </main>
  );
}
