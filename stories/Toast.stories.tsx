import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Toaster, toast } from '../src';

const meta = { title: 'Components/Toast', component: Toaster, tags: ['autodocs'] } satisfies Meta<typeof Toaster>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <div className="sb-grid">
      <Button onClick={() => toast('Saved')}>Default</Button>
      <Button onClick={() => toast('Done takes tasks only', { tone: 'warning' })}>Warning</Button>
      <Button onClick={() => toast('Could not save the list', { tone: 'error' })}>Error</Button>
      <Button onClick={() => toast('Plan agreed', { tone: 'success' })}>Success</Button>
      <Toaster />
    </div>
  ),
};
