/* The public surface. A consumer imports from here and from the two CSS
   files; nothing reaches into src/components directly. */
export { Button, LinkButton } from './components/Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize, LinkButtonProps } from './components/Button/Button';

/* Card and Badge came from a task board, which had already run them
   across five views. Their anatomy is a task board's; only the names changed. */
export { Card } from './components/Card/Card';
export type { CardProps, CardSlot, CardElevation } from './components/Card/Card';

export { Badge } from './components/Badge/Badge';
export type { BadgeProps, BadgeTone } from './components/Badge/Badge';

export { Tag } from './components/Tag/Tag';
export type { TagProps, TagTone, TagChart } from './components/Tag/Tag';

export { Column, ColumnEmpty } from './components/Column/Column';
export type { ColumnProps, ColumnEmptyProps, ColumnTone, ColumnLayout, ColumnDropState } from './components/Column/Column';

export { Stat } from './components/Stat/Stat';
export type { StatProps, StatTone, StatSize } from './components/Stat/Stat';

export { Field } from './components/Field/Field';
export type { FieldProps } from './components/Field/Field';

/* The rest came from the chat engine and a dashboard, two apps that
   had each drawn their own. Neither loads them: both are plain JavaScript
   with no React, so for now this is where the anatomy is written down. */
export { Modal, ModalPane } from './components/Modal/Modal';
export type { ModalProps, ModalPaneProps, ModalSize } from './components/Modal/Modal';

export { Textarea } from './components/Textarea/Textarea';
export type { TextareaProps } from './components/Textarea/Textarea';

/* Textarea's siblings, for a settings page: one line of text, and a
   native select in the same skin. */
export { Input } from './components/Input/Input';
export type { InputProps, InputType, InputSize } from './components/Input/Input';

export { Select } from './components/Select/Select';
export type { SelectProps } from './components/Select/Select';

export { Spinner } from './components/Spinner/Spinner';
export type { SpinnerProps, SpinnerSize, SpinnerState } from './components/Spinner/Spinner';

export { Pill } from './components/Pill/Pill';
export type { PillProps, PillTone } from './components/Pill/Pill';

export { Alert } from './components/Alert/Alert';
export type { AlertProps, AlertTone } from './components/Alert/Alert';

export { Switch } from './components/Switch/Switch';
export type { SwitchProps } from './components/Switch/Switch';

export { SegmentedControl } from './components/SegmentedControl/SegmentedControl';
export type { SegmentedControlProps, SegmentOption } from './components/SegmentedControl/SegmentedControl';

export { ToggleGroup } from './components/ToggleGroup/ToggleGroup';
export type { ToggleGroupProps, ToggleOption } from './components/ToggleGroup/ToggleGroup';

export { ToggleChip } from './components/ToggleChip/ToggleChip';
export type { ToggleChipProps } from './components/ToggleChip/ToggleChip';

export { StepSlider } from './components/StepSlider/StepSlider';
export type { StepSliderProps, Step } from './components/StepSlider/StepSlider';

export { TagChip, TagChipAdd } from './components/TagChip/TagChip';
export type { TagChipProps, TagChipAddProps } from './components/TagChip/TagChip';

export { Calendar, toIsoDate } from './components/Calendar/Calendar';
export type { CalendarProps } from './components/Calendar/Calendar';
export { DateButton } from './components/Calendar/DateButton';
export type { DateButtonProps } from './components/Calendar/DateButton';

export { Dropdown } from './components/Dropdown/Dropdown';
export type { DropdownProps, DropdownOption } from './components/Dropdown/Dropdown';

/* From the task board in 0.20.0: a list of actions under a button, and a
   short line that answers an action where the eye already is. */
export { Menu } from './components/Menu/Menu';
export type { MenuProps, MenuItemProps, MenuDividerProps } from './components/Menu/Menu';

export { Toaster, toast } from './components/Toast/Toast';
export type { ToasterProps, ToastOptions, ToastTone } from './components/Toast/Toast';

/* From Binder in 0.22.0, which drew them after the task board: an app's top
   bar, and the side panel a task opens in. */
export { AppHeader } from './components/AppHeader/AppHeader';
export type { AppHeaderProps, AppHeaderLinkProps, AppTab } from './components/AppHeader/AppHeader';

export { Drawer, useDrawerTools } from './components/Drawer/Drawer';
export type { DrawerProps } from './components/Drawer/Drawer';

/* Added for the chat window, which became a React component in the chat
   engine and needed more than the first fourteen had. Each is a thing another
   window, a dashboard or a reader of model output will want too. */
export { Window } from './components/Window/Window';
export type { WindowProps, WindowRect, WindowOrigin } from './components/Window/Window';

export { Markdown, inlineNodes } from './components/Markdown/Markdown';
export type { MarkdownProps } from './components/Markdown/Markdown';

export { EditableText } from './components/EditableText/EditableText';
export type { EditableTextProps } from './components/EditableText/EditableText';

export { Disclosure } from './components/Disclosure/Disclosure';
export type { DisclosureProps } from './components/Disclosure/Disclosure';

/* Drag to reorder. Written for a dashboard's agents and targets,
   with a task board's drop line, so the two apps drag the same way. */
export { useReorder, reorderKeys, applySavedOrder } from './components/Reorder/useReorder';
export type {
  ReorderOptions, ReorderItem, ReorderItemProps, ReorderHandleProps, ReorderAxis, DropSide,
} from './components/Reorder/useReorder';
export { bindReorder } from './components/Reorder/bindReorder';
export type { BindReorderOptions } from './components/Reorder/bindReorder';
export { DragHandle, dragHandleHTML } from './components/Reorder/DragHandle';
export type { DragHandleProps } from './components/Reorder/DragHandle';
export { DropLine } from './components/Reorder/DropLine';

export { cx } from './utils';
