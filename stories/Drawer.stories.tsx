import { useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Drawer, Field, SegmentedControl, useDrawerTools } from '../src';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { open: false, onClose: () => {}, title: 'Title', children: null },
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 520 },
      description: {
        component: 'A side panel from the right, 440px wide, and the whole screen on a phone. Escape, the scrim and Close shut it. Tab stays inside, the page does not scroll, and focus goes back to the button.',
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

function Opener({ label, children }: { label: string; children: (open: boolean, close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>{label}</Button>
      {children(open, () => setOpen(false))}
    </>
  );
}

export const TaskDrawer: Story = {
  render: () => (
    <Opener label="Open the drawer">
      {(open, close) => (
        <Drawer open={open} onClose={close} title="Acme Ltd" actions={<Button size="sm" variant="secondary">Edit</Button>}>
          <Field label="Contact" defaultValue="Ana P." />
          {Array.from({ length: 24 }, (_, i) => <p key={i} className="tenon-body-sm">Note {i + 1}. The body scrolls and the head stays.</p>)}
        </Drawer>
      )}
    </Opener>
  ),
};

/* Content that keeps its own state but puts its controls in the drawer's
   head, where they stay while the body scrolls. */
function StagePicker() {
  const slot = useDrawerTools();
  const [stage, setStage] = useState('lead');
  const picker = (
    <SegmentedControl
      aria-label="Stage"
      value={stage}
      onChange={setStage}
      options={[{ value: 'lead', label: 'Lead' }, { value: 'talking', label: 'Talking' }, { value: 'won', label: 'Won' }]}
    />
  );
  return (
    <>
      {slot ? createPortal(picker, slot) : slot === undefined ? picker : null}
      <p className="tenon-body">Stage: {stage}. The picker above lives in this component and renders in the head.</p>
    </>
  );
}

export const ToolsInTheHead: Story = {
  render: () => (
    <Opener label="Open with tools">
      {(open, close) => (
        <Drawer open={open} onClose={close} title="Organisation">
          <StagePicker />
        </Drawer>
      )}
    </Opener>
  ),
};
