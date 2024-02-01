/**
 * https://github.com/vercel/next.js/blob/canary/examples/with-styled-components/styled.d.ts
 */
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
    };
  }
}
