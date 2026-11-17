import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cx } from '../../utils';
import './Input.css';

/* The kinds of input that are a line of text. A checkbox, a radio or a
   range drawn in this skin would be a box pretending to be something else. */
export type InputType = 'text' | 'email' | 'number' | 'search' | 'url' | 'tel' | 'password';

export type InputSize = 'md' | 'sm';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  type?: InputType;
  invalid?: boolean;
  /** 'md' is 40px, Textarea's one-row height. 'sm' is 32px, a md Button's,
   *  for a control in a toolbar. */
  size?: InputSize;
}

/* The bare control, Textarea's one-line sibling, for anywhere the label is
   drawn by something else. When there is a label, use Field. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = 'text', invalid, size = 'md', className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid ? true : undefined}
      className={cx('tenon-input', size === 'sm' && 'tenon-input--sm', invalid && 'tenon-input--invalid', className)}
      {...rest}
    />
  );
});
