/**
 * .main.ts 파일에서 스토리북에 대한 전반적인 설정을 할 수 있습니다.
 */
//import path from 'node:path';
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // 스토리북에 사용할 .mdx, .stories 파일의 위치
  stories: [
    '../../../packages/ui/**/*.mdx',
    '../../../packages/ui/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/stories/**/*.mdx',
    '../src/stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  // 적용할 addon
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  // 프레임워크 종류
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  // docs 관련
  docs: {
    autodocs: 'tag',
  },
};

export default config;
