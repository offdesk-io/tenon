import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils';
import './Button.css';

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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', iconOnly = false, pressed, block = false, startIcon, endIcon, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'tenon-button',
        `tenon-button--${variant}`,
        `tenon-button--${size}`,
        iconOnly && 'tenon-button--icon-only',
        pressed && 'tenon-button--pressed',
        block && 'tenon-button--block',
        className,
      )}
      aria-pressed={pressed}
      {...rest}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
});

export interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

/* A link that looks like a Button, for something that goes somewhere rather
   than doing something: Open in Claude, a download. Same skin, and an anchor
   underneath, so middle-click and copy-link keep working. */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(
  { variant = 'secondary', size = 'md', startIcon, endIcon, className, children, ...rest },
  ref,
) {
  return (
    <a ref={ref} className={cx('tenon-button', `tenon-button--${variant}`, `tenon-button--${size}`, className)} {...rest}>
      {startIcon}
      {children}
      {endIcon}
    </a>
  );
});
