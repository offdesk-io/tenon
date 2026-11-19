import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppHeader, Button, Input } from '../src';
import type { AppHeaderLinkProps, AppTab } from '../src';

const meta = {
  title: 'Components/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  args: {},
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Sticky along the top: the brand and the view tabs on the left, search and actions on the right. Below 768px the search takes a row of its own. The tabs are plain links unless `renderLink` draws them, which is how a router app plugs its own link in.',
      },
    },
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const brand = <a href="#" className="tn-identity">Binder</a>;
const actions = (
  <>
    <Button size="sm" variant="secondary">New</Button>
    <Button size="sm" variant="ghost">Sign out</Button>
  </>
);

export const PlainLinks: Story = {
  args: {
    brand,
    tabs: [
      { to: '#home', label: 'Home', current: true },
      { to: '#pipeline', label: 'Pipeline' },
      { to: '#list', label: 'List' },
    ],
    search: <Input size="sm" type="search" placeholder="Find an organisation" aria-label="Find" />,
    actions,
  },
};

/* A stand-in for a router: renderLink draws a link that moves
   the current tab on click, as react-router's NavLink would. */
function RoutedHeader() {
  const [at, setAt] = useState('/pipeline');
  const tabs: AppTab[] = [
    { to: '/', label: 'Home', end: true },
    { to: '/pipeline', label: 'Pipeline' },
    { to: '/list', label: 'List' },
  ];
  const renderLink = ({ tab, className, children }: AppHeaderLinkProps) => (
    <a
      href={tab.to}
      className={className}
      aria-current={at === tab.to ? 'page' : undefined}
      onClick={(e) => { e.preventDefault(); setAt(tab.to); }}
    >
      {children}
    </a>
  );
  return <AppHeader brand={brand} tabs={tabs} renderLink={renderLink} actions={actions} />;
}

export const WithRenderLink: Story = { render: () => <RoutedHeader /> };

export const BrandAndActionsOnly: Story = { args: { brand, actions } };

/* Framed inside another app, whose own bar already carries the brand. */
export const Framed: Story = {
  args: {
    tabs: [
      { to: '#home', label: 'Home', current: true },
      { to: '#pipeline', label: 'Pipeline' },
    ],
    actions,
  },
};
