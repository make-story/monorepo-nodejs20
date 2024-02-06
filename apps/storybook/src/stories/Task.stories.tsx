import type { Meta, StoryObj } from '@storybook/react';

import Task from './Task';

// 메타 데이터, 제네릭에 Task 컴포넌트의 타입을 넘겨준다.
const meta: Meta<typeof Task> = {
  // 사이드바에 표시할 카테고리
  title: 'Components/Common/Task',
  // 컴포넌트
  component: Task,
  // 컴포넌트에 대한 문서를 자동으로 생성
  tags: ['autodocs'],
  argTypes: {},
};

// 메타 데이터를 디폴트로 export
export default meta;

// 스토리 타입, StoryObj의 제네릭에 컴포넌트의 타입을 넘겨준다.
type Story = StoryObj<typeof Task>;

/**
 * 아래는 각각의 스토리
 */
export const Default: Story = {
  args: {
    task: {
      id: '1',
      title: 'Test Task',
      state: 'TASK_INBOX',
    },
  },
};
export const Pinned: Story = {
  args: {
    task: {
      ...Default?.args?.task,
      state: 'TASK_PINNED',
    },
  },
};
export const Archived: Story = {
  args: {
    task: {
      ...Default?.args?.task,
      state: 'TASK_ARCHIVED',
    },
  },
};
