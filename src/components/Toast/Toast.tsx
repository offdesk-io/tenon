import { useSyncExternalStore } from 'react';
import type { HTMLAttributes } from 'react';
import { cx } from '../../utils';
import './Toast.css';

export type ToastTone = 'default' | 'warning' | 'error' | 'success';

export interface ToastOptions {
  tone?: ToastTone;
  /** How long it stays, in milliseconds. 4000 unless said. */
  duration?: number;
}

interface Item { id: number; text: string; tone: ToastTone; leaving: boolean }

/* One queue for the page, outside React, so toast() can be called from
   anywhere: an event handler, a fetch's catch, code that is not a component.
   The Toaster is the only thing that reads it. */
let items: Item[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => { for (const l of listeners) l(); };
const set = (next: Item[]) => { items = next; emit(); };

/** Shows a toast in the page's Toaster and returns a function that takes it
 *  down early. */
export function toast(text: string, { tone = 'default', duration = 4000 }: ToastOptions = {}): () => void {
  const id = nextId++;
  set([...items, { id, text, tone, leaving: false }]);
  const dismiss = () => {
    if (!items.some((t) => t.id === id && !t.leaving)) return;
    set(items.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => set(items.filter((t) => t.id !== id)), 150);
  };
  setTimeout(dismiss, duration);
  return dismiss;
}

const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const snapshot = () => items;

export type ToasterProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/** Where toasts appear. Render one, once, near the root of the app. */
export function Toaster({ className, ...rest }: ToasterProps) {
  const list = useSyncExternalStore(subscribe, snapshot, snapshot);
  return (
    <div className={cx('tenon-toaster', className)} {...rest}>
      {list.map((t) => (
        <div
          key={t.id}
          role={t.tone === 'error' ? 'alert' : 'status'}
          className={cx('tenon-toast', t.tone !== 'default' && `tenon-toast--${t.tone}`, t.leaving && 'tenon-toast--leaving')}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
