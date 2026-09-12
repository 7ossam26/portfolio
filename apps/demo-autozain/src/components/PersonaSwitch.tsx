import type { Persona } from '../domain/types';

interface Props {
  readonly persona: Persona;
  readonly onChange: (persona: Persona) => void;
}

export function PersonaSwitch({ persona, onChange }: Props) {
  return (
    <div className="persona-switch" role="group" aria-label="Demo persona">
      <span className="persona-label">Demo persona</span>
      <button type="button" aria-pressed={persona === 'buyer'} onClick={() => onChange('buyer')}>
        Buyer · مشتري
      </button>
      <button type="button" aria-pressed={persona === 'staff'} onClick={() => onChange('staff')}>
        Staff · موظف
      </button>
    </div>
  );
}
