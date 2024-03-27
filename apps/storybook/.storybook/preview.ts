/**
 * preview.ts 는 preview (미리보기) 화면에 대한 설정을 적용할 수 있습니다.
 * preview.ts 내부에 CSS를 import 하거나 JavaScript 를 로드할 수 있음
 */
import type { Preview } from '@storybook/react';

const preview: Preview = {
  // parameters는 스토리에 대한 메타데이터 정보들, 주로 스토리북 feature와 addon에 대한 설정
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
