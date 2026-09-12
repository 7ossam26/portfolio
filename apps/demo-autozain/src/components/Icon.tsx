import type { SVGProps } from 'react';

const paths = {
  car: 'M5 17h14v-5l-2-5H7l-2 5v5Zm2-5 1.2-3h7.6l1.2 3H7Zm1 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c0-3.3 3.1-6 7-6s7 2.7 7 6',
  search: 'm21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z',
  gauge: 'M4 18a8 8 0 1 1 16 0M12 14l4-4',
  settings: 'M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M8 14v6',
  arrow: 'm9 18 6-6-6-6',
  check: 'm5 12 4 4L19 6',
  close: 'M6 6l12 12M18 6 6 18',
  clock: 'M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  phone: 'M5 4h4l2 5-2.5 1.5a14 14 0 0 0 5 5L15 13l5 2v4c0 1.1-.9 2-2 2C9.7 21 3 14.3 3 6c0-1.1.9-2 2-2Z',
  signal: 'M5 19v-3M10 19v-6M15 19V9M20 19V5',
  reset: 'M4 4v6h6M20 20v-6h-6M5.1 15a8 8 0 0 0 13.2 2M18.9 9A8 8 0 0 0 5.7 7',
} as const;

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d={paths[name]} />
    </svg>
  );
}
