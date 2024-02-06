import type { Meta, StoryObj } from '@storybook/react';

import Button from './Button';

const meta: Meta<typeof Button> = {
  // 사이드바에 표시할 카테고리
  title: '@lotte/elements/Button',
  // 컴포넌트
  component: Button,
  // 컴포넌트에 대한 문서를 자동으로 생성
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Button>;
export const Default: Story = {
  args: {
    attr: {
      disabled: false,
    },
    children: 'Test1',
  },
};
export const Disabled: Story = {
  args: {
    attr: {
      disabled: true,
    },
    children: 'Test2',
  },
};
