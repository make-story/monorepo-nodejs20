import * as path from 'path';
import { defineConfig } from 'vite';
//import dts from 'vite-plugin-dts';
//import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'index',
      fileName: 'index',
    },
    // 빌드 커스터마이즈하기
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
      output: {
        format: 'umd', // 기본값: es
      },
    },
  },
  //plugins: [dts(), cssInjectedByJsPlugin()],
});
