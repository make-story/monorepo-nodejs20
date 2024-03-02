/**
 * https://vitejs.dev/config/
 * https://ko.vitejs.dev/config/build-options.html#build-options
 * https://ko.vitejs.dev/plugins/
 */
import * as path from 'node:path';
import * as fs from 'node:fs';
import { defineConfig } from 'vite';
//import react from '@vitejs/plugin-react'; // "ReferenceError: React is not defined" 이슈 대응
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts'; // Typescript *.d.ts 파일 생성
//import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'logging-manager', // 전역 변수 (예: window[name설정값])
      fileName: 'index', // 기본값: package.json 파일의 name 옵션
      formats: ['es', 'umd'], // 기본값: ['es', 'umd'], 여러 entry 가 존재할 경우 기본값: ['es', 'cjs']
    },
    // 빌드 커스터마이즈하기
    // https://rollupjs.org/configuration-options/
    rollupOptions: {
      external: ['react', 'react-dom'], // 라이브러리에 포함하지 않을 dependency 명시
      // 번들 출력에 대한 옵션 설정
      output: {
        //format: 'es', // 기본값: es
        banner: '"use client";', // "use client" 컴포넌트의 모든 사용을 클라이언트 컴포넌트로 보장 (리액트 서버 컴포넌트 대응)
        interop: 'auto',
      },
    },
    commonjsOptions: {
      esmExternals: ['react'],
    },
    sourcemap: true,
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      // "ReferenceError: React is not defined" 이슈 대응
      jsx: 'automatic',
    },
  },
});
