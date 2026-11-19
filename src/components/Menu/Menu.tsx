import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cx } from '../../utils';
import { Button } from '../Button/Button';
import type { ButtonSize, ButtonVariant } from '../Button/Button';
import './Menu.css';

const CloseMenu = createContext<() => void>(() => {});

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** What the button says. An icon needs `triggerLabel` beside it. */
  trigger: ReactNode;
  /** The button's accessible name, when `trigger` is not words. */
  triggerLabel?: string;
  triggerVariant?: ButtonVariant;
  triggerSize?: ButtonSize;
  /** Which edge of the button the panel hangs from. 'end' for a button at
   *  the right-hand end of a bar, so the panel stays on screen. */
  align?: 'start' | 'end';
  disabled?: boolean;
  /** Menu.Item and Menu.Divider. */
  children: ReactNode;
}

/* A button that opens a list of actions. Enter, Space or the down arrow opens
   it and lands on the first item, the arrows move, Escape shuts it and goes
   back to the button, and choosing an item shuts it too. */
export function Menu({
  trigger, triggerLabel, triggerVariant = 'secondary', triggerSize = 'md', align = 'start',
  disabled = false, className, children, ...rest
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const items = () => Array.from(root.current?.querySelectorAll<HTMLButtonElement>('[role=menuitem]:not(:disabled)') ?? []);
  const close = () => { setOpen(false); root.current?.querySelector<HTMLButtonElement>('button')?.focus(); };

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', away);
    items()[0]?.focus();
    return () => document.removeEventListener('mousedown', away);
  }, [open]);

  const key = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) { e.preventDefault(); close(); return; }
    const step = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    if (!open) { setOpen(true); return; }
    const all = items();
    const at = all.indexOf(document.activeElement as HTMLButtonElement);
    all[(at + step + all.length) % all.length]?.focus();
  };

  return (
    <div ref={root} className={cx('tenon-menu', className)} onKeyDown={key} {...rest}>
      <Button
        variant={triggerVariant}
        size={triggerSize}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerLabel}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </Button>
      {open && !disabled && (
        <CloseMenu.Provider value={close}>
          <div className={cx('tenon-menu__panel', align === 'end' && 'tenon-menu__panel--end')} role="menu" aria-label={triggerLabel}>
            {children}
          </div>
        </CloseMenu.Provider>
      )}
    </div>
  );
}

export interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  /** Runs when the item is chosen, after the menu has shut. */
  onSelect?: () => void;
}

function MenuItem({ onSelect, onClick, className, children, ...rest }: MenuItemProps) {
  const close = useContext(CloseMenu);
  return (
    <button
      type="button"
      role="menuitem"
      className={cx('tenon-menu__item', className)}
      onClick={(e) => { onClick?.(e); if (e.defaultPrevented) return; close(); onSelect?.(); }}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface MenuDividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** A name for what comes after the rule. */
  label?: ReactNode;
}

function MenuDivider({ label, className, ...rest }: MenuDividerProps) {
  return (
    <div role="separator" className={cx('tenon-menu__divider', className)} {...rest}>
      {label ? <span className="tenon-menu__label">{label}</span> : null}
    </div>
  );
}

Menu.Item = MenuItem;
Menu.Divider = MenuDivider;
