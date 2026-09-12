import type { CarSummary, DemoSnapshot, Employee } from './types.ts';

export const FIXTURE_TIME_MS = Date.parse('2026-09-12T10:00:00.000Z');

const cars: readonly CarSummary[] = [
  {
    id: 'demo-car-az-101',
    carType: 'نوفا',
    model: 'كروس X',
    listingPrice: 985000,
    transmission: 'automatic',
    fuelType: 'benzine',
    odometer: 42000,
    color: 'جرافيت',
    year: 2023,
    images: ['/demos/autozain/vehicles/graphite-crossover.webp'],
    additionalInfo: 'سيارة تجريبية بحالة جيدة وسجل صيانة افتراضي لأغراض العرض فقط.',
  },
  {
    id: 'demo-car-az-102',
    carType: 'أوريون',
    model: 'سيدان S',
    listingPrice: 760000,
    transmission: 'automatic',
    fuelType: 'hybrid',
    odometer: 68500,
    color: 'أبيض لؤلؤي',
    year: 2022,
    images: ['/demos/autozain/vehicles/pearl-sedan.webp'],
    additionalInfo: 'سجل خيالي وصورة مولّدة محلياً. لا تمثل سيارة أو عميلاً حقيقياً.',
  },
  {
    id: 'demo-car-az-103',
    carType: 'فيلو',
    model: 'هاتش H',
    listingPrice: 615000,
    transmission: 'manual',
    fuelType: 'benzine',
    odometer: 91000,
    color: 'أزرق داكن',
    year: 2021,
    images: ['/demos/autozain/vehicles/blue-hatchback.webp'],
    additionalInfo: 'بيانات وصورة خيالية مخصصة لتجربة واجهة أوتوزين فقط.',
  },
];

const employees: readonly Employee[] = [
  { id: 'demo-staff-11', fullName: 'سلمى فؤاد · موظفة تجريبية', role: 'employee', status: 'available' },
  { id: 'demo-staff-12', fullName: 'عمر عادل · موظف تجريبي', role: 'employee', status: 'busy' },
];

export function createSeedSnapshot(): DemoSnapshot {
  return structuredClone({ cars, employees, requests: [], events: [] });
}

export const sampleBuyer = {
  name: 'مها ناصر · مشترية تجريبية',
  phone: '01000000000',
} as const;
