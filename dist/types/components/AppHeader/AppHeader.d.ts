import { ReactNode } from 'react';
export interface AppTab {
    /** Where the tab goes. Also its key, so two tabs never share one. */
    to: string;
    label: string;
    /** Match the address exactly, for a tab at "/". Tenon does nothing with it; it is passed on to `renderLink` for a router's link. */
    end?: boolean;
    /** The tab of the view on screen. The default link marks it `aria-current="page"`. */
    current?: boolean;
}
export interface AppHeaderLinkProps {
    tab: AppTab;
    /** The tab's class. Put it on the link, or the pill style is lost. */
    className: string;
    /** `tab.current`, as a boolean. A router link that works out the current view itself can ignore it. */
    current: boolean;
    children: ReactNode;
}
export interface AppHeaderProps {
    /** The wordmark, usually a link home. Left out when the page is framed and the host shows its own. */
    brand?: ReactNode;
    /** The app's views, drawn as one segmented pill of links. Leave them out on a phone if they move to a tab bar. */
    tabs?: AppTab[];
    /** Draws each tab's link. A plain `<a href>` unless given, so a router's link can stand in without Tenon knowing the router. */
    renderLink?: (props: AppHeaderLinkProps) => ReactNode;
    /** Between the tabs and the actions, pushed right. On a phone it takes a row of its own. */
    search?: ReactNode;
    /** The right-hand end. */
    actions?: ReactNode;
    className?: string;
}
export declare function AppHeader({ brand, tabs, renderLink, search, actions, className }: AppHeaderProps): import("react").JSX.Element;
