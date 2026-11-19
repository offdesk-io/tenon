import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils';
import { Button } from '../Button/Button';
import './Drawer.css';

export interface DrawerProps {
  open: boolean;
  /** The drawer's name: shown in its head and read out as the dialog's label. */
  title: ReactNode;
  onClose: () => void;
  /** Buttons in the head, before Close. */
  actions?: ReactNode;
  children: ReactNode;
  /** Where focus goes on close, if not back to what had it on open (for an opener that may be gone). */
  returnFocus?: () => HTMLElement | null;
  className?: string;
}

/* The element in the drawer's head that content inside the drawer can portal
   its tools into, so they stay put while the body scrolls. Undefined outside a
   drawer; null while the drawer has not yet attached the element. */
const ToolsSlot = createContext<HTMLElement | null | undefined>(undefined);

/** The drawer head's tools slot, for `createPortal`. Undefined outside a drawer, null for the first render inside one. */
export const useDrawerTools = () => useContext(ToolsSlot);

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

/* A panel that slides in from the right over the page, the task board's task
   drawer. Came from Binder, which wrote it to move here unchanged. It is a
   modal dialog: a scrim dims the page, focus moves in and stays in, Escape or
   the scrim or Close shut it, and focus goes back to whatever had it before.
   The page under it does not scroll. On a phone it is the whole screen.
   The panel carries `data-drawer`, so a global shortcut can tell one is open. */
export function Drawer({ open, title, onClose, actions, children, returnFocus, className }: DrawerProps) {
  const panel = useRef<HTMLDivElement>(null);
  const before = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [tools, setTools] = useState<HTMLElement | null>(null);
  /* Read through refs so a parent that passes new functions every render
     does not tear the listener down and put focus back on the opener. */
  const close = useRef(onClose);
  close.current = onClose;
  const giveBack = useRef(returnFocus);
  giveBack.current = returnFocus;

  useEffect(() => {
    if (!open) return;
    before.current = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    panel.current?.focus();
    /* What can be reached now, read on every Tab so a button that renders
       after opening is trapped too. jsdom has no layout, so when nothing
       reports a box the box test is skipped. */
    const reachable = () => {
      const all = Array.from(panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((el) => !el.closest('[inert]'));
      const shown = all.filter((el) => el.getClientRects().length > 0);
      return shown.length > 0 ? shown : all;
    };
    const onKey = (e: KeyboardEvent) => {
      /* Already answered (a Dropdown closing on Escape), or mid-composition in
         an input method, where Escape cancels the composition. */
      if (e.defaultPrevented || e.isComposing) return;
      // A Modal opened from inside the drawer owns Escape and Tab while it is up.
      if (document.querySelector('.tenon-modal')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close.current();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = reachable();
      if (items.length === 0) {
        e.preventDefault();
        panel.current.focus();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement;
      const inside = panel.current.contains(active);
      if (e.shiftKey && (!inside || active === panel.current || active === firstItem)) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && (!inside || active === lastItem)) {
        e.preventDefault();
        firstItem.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      root.style.overflow = overflow;
      // The preferred element first; if it is gone (or not given), what had focus on open; else nothing.
      const target = [giveBack.current?.(), before.current].find((el) => el?.isConnected);
      target?.focus();
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <>
      <div className="tenon-drawer__scrim" data-testid="drawer-scrim" aria-hidden="true" onClick={() => close.current()} />
      <div
        ref={panel}
        className={cx('tenon-drawer', className)}
        data-drawer
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="tenon-drawer__head">
          <h2 id={titleId} className="tenon-drawer__title">{title}</h2>
          <div className="tenon-drawer__tools" ref={setTools} />
          <div className="tenon-drawer__actions">
            {actions}
            <Button size="sm" variant="ghost" onClick={() => close.current()}>Close</Button>
          </div>
        </div>
        <ToolsSlot.Provider value={tools}>
          <div className="tenon-drawer__body">{children}</div>
        </ToolsSlot.Provider>
      </div>
    </>,
    document.body,
  );
}
