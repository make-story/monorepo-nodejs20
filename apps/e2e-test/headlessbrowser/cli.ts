/**
 * cmd(커멘드라인)에서 실행
 * ts 파일 그대로 실행이 필요한 경우, ts-node 모듈(또는 ts 파일 실행해주는 도구) 설치 후 실행
 *
 * $ yarn ts-node headlessbrowser/cli.ts --uitest --device mobile --testcase main
 */
import childProcess from 'node:child_process';

import uitestRunner from '#/headlessbrowser/runner/uitest';
import { isArgv, getArgv } from '#/utils/process';

/**
 * UITest
 */
if (process.argv.includes(`--uitest`)) {
  const headless = getArgv('headless');
  const device = getArgv('device');
  const testcase = getArgv('testcase');
  const browser = getArgv('browser');

  // playwright 기본 명령으로 테스트케이스 실행
  /*const message = childProcess.execSync('playwright test --ui', {
    stdio: 'inherit',
  });
  message && console.log(message);*/

  (async () => {
    try {
      await uitestRunner({
        params: { device, testcase },
        query: { headless, browser },
      });
    } catch (error) {
      console.error(error);
    } finally {
      process.exit();
    }
  })();
} else {
  console.warn('실행가능한 명령이 없습니다.');
  process.exit();
}
