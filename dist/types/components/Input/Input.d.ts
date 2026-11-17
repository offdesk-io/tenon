import { InputHTMLAttributes } from 'react';
export type InputType = 'text' | 'email' | 'number' | 'search' | 'url' | 'tel' | 'password';
export type InputSize = 'md' | 'sm';
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    type?: InputType;
    invalid?: boolean;
    /** 'md' is 40px, Textarea's one-row height. 'sm' is 32px, a md Button's,
     *  for a control in a toolbar. */
    size?: InputSize;
}
export declare const Input: import('react').ForwardRefExoticComponent<InputProps & import('react').RefAttributes<HTMLInputElement>>;
