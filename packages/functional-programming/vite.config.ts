import * as path from 'path';
import { defineConfig } from 'vite';
//import dts from 'vite-plugin-dts';
//import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'index', // 전역 변수 (예: window[name설정값])
      fileName: 'index', // 기본값: package.json 파일의 name 옵션
      formats: ['es', 'umd'], // 기본값: ['es', 'umd'], 여러 entry 가 존재할 경우 기본값: ['es', 'cjs']
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
