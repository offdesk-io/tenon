import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from '../src';

const meta = { title: 'Components/Menu', component: Menu, tags: ['autodocs'],
  args: { trigger: 'Data', children: null } } satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithDivider: Story = {
  render: () => (
    <div style={{ height: 280 }}>
      <Menu trigger="Data">
        <Menu.Item onSelect={() => {}}>Undo last save</Menu.Item>
        <Menu.Item onSelect={() => {}}>Download a copy</Menu.Item>
        <Menu.Item disabled>Backups</Menu.Item>
        <Menu.Divider label="Switch list" />
        <Menu.Item onSelect={() => {}}>Personal</Menu.Item>
        <Menu.Item onSelect={() => {}}>Work and career</Menu.Item>
      </Menu>
    </div>
  ),
};

export const AlignedToTheEnd: Story = {
  render: () => (
    <div style={{ height: 160, display: 'flex', justifyContent: 'flex-end' }}>
      <Menu trigger="More" align="end" triggerVariant="ghost">
        <Menu.Item onSelect={() => {}}>Settings</Menu.Item>
        <Menu.Item onSelect={() => {}}>Sign out</Menu.Item>
      </Menu>
    </div>
  ),
};
