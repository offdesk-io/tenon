import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { ButtonSize, ButtonVariant } from '../Button/Button';
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
export declare function Menu({ trigger, triggerLabel, triggerVariant, triggerSize, align, disabled, className, children, ...rest }: MenuProps): import("react").JSX.Element;
export declare namespace Menu {
    var Item: typeof MenuItem;
    var Divider: typeof MenuDivider;
}
export interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
    /** Runs when the item is chosen, after the menu has shut. */
    onSelect?: () => void;
}
declare function MenuItem({ onSelect, onClick, className, children, ...rest }: MenuItemProps): import("react").JSX.Element;
export interface MenuDividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** A name for what comes after the rule. */
    label?: ReactNode;
}
declare function MenuDivider({ label, className, ...rest }: MenuDividerProps): import("react").JSX.Element;
export {};
