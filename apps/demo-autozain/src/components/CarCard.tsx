import type { CarSummary } from '../domain/types';
import { Icon } from './Icon';

const formatNumber = new Intl.NumberFormat('ar-EG');

interface Props {
  readonly car: CarSummary;
  readonly onSelect: (car: CarSummary) => void;
}

export function CarCard({ car, onSelect }: Props) {
  return (
    <article className="car-card">
      <div className="car-card-image">
        <img src={car.images[0]} alt={`${car.carType} ${car.model} — صورة تجريبية مولّدة`} />
        <button type="button" className="favorite-button" aria-label="إضافة للمفضلة (عرض فقط)">
          <Icon name="heart" />
        </button>
        <span className="sample-image-tag">صورة تجريبية</span>
      </div>
      <div className="car-card-body">
        <h2>{car.carType} {car.model}</h2>
        <p className="price">{formatNumber.format(car.listingPrice)} ج.م</p>
        <div className="pill-row">
          <span><Icon name="gauge" />{formatNumber.format(car.odometer)} كم</span>
          <span><Icon name="settings" />{car.transmission === 'automatic' ? 'أوتوماتيك' : 'عادي'}</span>
          <span>{car.year}</span>
        </div>
        <button type="button" className="card-link" onClick={() => onSelect(car)}>
          عرض العربية <Icon name="arrow" />
        </button>
      </div>
    </article>
  );
}
