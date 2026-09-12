import type { ReactNode, SVGProps } from 'react';

type IconName =
  | 'arrow'
  | 'check'
  | 'chevron'
  | 'close'
  | 'factory'
  | 'history'
  | 'inventory'
  | 'recipe'
  | 'search'
  | 'warning';

const paths: Record<IconName, ReactNode> = {
  arrow: <path d="M19 12H5m5-5-5 5 5 5" />,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m7 10 5 5 5-5" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  factory: <path d="M4 21V9l6 3V7l6 3V3h4v18H4Zm4-4h1m4 0h1m4 0h1" />,
  history: <path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5m4-2v6l4 2" />,
  inventory: <path d="m4 7 8-4 8 4v10l-8 4-8-4V7Zm0 0 8 4 8-4m-8 4v10" />,
  recipe: <path d="M7 3h10v4H7V3ZM5 5H3v16h18V5h-2M8 12h8m-8 4h5" />,
  search: <path d="m20 20-4.5-4.5m2.5-5A7.5 7.5 0 1 1 3 10.5a7.5 7.5 0 0 1 15 0Z" />,
  warning: <path d="M12 4 3 20h18L12 4Zm0 5v5m0 3h.01" />,
};

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
