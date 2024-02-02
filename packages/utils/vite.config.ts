/**
 * https://vitejs.dev/config/
 * https://ko.vitejs.dev/plugins/
 */
import * as path from 'node:path';
import * as fs from 'node:fs';
import { defineConfig } from 'vite';
//import dts from 'vite-plugin-dts';
//import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

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
    sourcemap: true,
  },
  //plugins: [dts(), cssInjectedByJsPlugin()],
});
