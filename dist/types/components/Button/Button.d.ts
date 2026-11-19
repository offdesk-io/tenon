import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'dashed' | 'ghost' | 'danger' | 'confirm' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Renders as a square. The label still has to be given, via aria-label. */
    iconOnly?: boolean;
    /** Toggled on. Sets aria-pressed too, so give it to a button that toggles
     *  and leave it undefined on one that does not. */
    pressed?: boolean;
    /** Fills the width of its row. */
    block?: boolean;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}
export declare const Button: import('react').ForwardRefExoticComponent<ButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}
export declare const LinkButton: import('react').ForwardRefExoticComponent<LinkButtonProps & import('react').RefAttributes<HTMLAnchorElement>>;
