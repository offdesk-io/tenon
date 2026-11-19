import type { ReactNode } from 'react';
import { cx } from '../../utils';
import './AppHeader.css';

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

const plainLink = ({ tab, className, current, children }: AppHeaderLinkProps) => (
  <a href={tab.to} className={className} aria-current={current ? 'page' : undefined}>{children}</a>
);

/* An app's top bar: sticky, full width on the raised surface, the brand and
   the view tabs on the left, search and actions on the right. Came from
   Binder, which drew it after the task board's header. The tabs are links
   with no router behind them, so a router app passes its own link through
   `renderLink` and the current tab is whichever one the link marks. */
export function AppHeader({ brand, tabs, renderLink = plainLink, search, actions, className }: AppHeaderProps) {
  return (
    <header className={cx('tenon-app-header', className)}>
      {brand && <div className="tenon-app-header__brand">{brand}</div>}
      {tabs && tabs.length > 0 && (
        <nav aria-label="Main">
          <ul className="tenon-app-header__tabs">
            {tabs.map((t) => (
              <li key={t.to}>
                {renderLink({ tab: t, className: 'tenon-app-header__tab', current: !!t.current, children: t.label })}
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="tenon-app-header__gap" />
      {search && <div className="tenon-app-header__search">{search}</div>}
      {actions && <div className="tenon-app-header__actions">{actions}</div>}
    </header>
  );
}
