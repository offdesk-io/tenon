import { ReactNode } from 'react';
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
/** The drawer head's tools slot, for `createPortal`. Undefined outside a drawer, null for the first render inside one. */
export declare const useDrawerTools: () => HTMLElement | null | undefined;
export declare function Drawer({ open, title, onClose, actions, children, returnFocus, className }: DrawerProps): import('react').ReactPortal | null;
