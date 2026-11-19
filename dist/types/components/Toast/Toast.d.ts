import { HTMLAttributes } from 'react';
export type ToastTone = 'default' | 'warning' | 'error' | 'success';
export interface ToastOptions {
    tone?: ToastTone;
    /** How long it stays, in milliseconds. 4000 unless said. */
    duration?: number;
}
/** Shows a toast in the page's Toaster and returns a function that takes it
 *  down early. */
export declare function toast(text: string, { tone, duration }?: ToastOptions): () => void;
export type ToasterProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
/** Where toasts appear. Render one, once, near the root of the app. */
export declare function Toaster({ className, ...rest }: ToasterProps): import("react").JSX.Element;
