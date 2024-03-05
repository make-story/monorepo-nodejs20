/**
 * cmd(커멘드라인)에서 실행
 * ts 파일 그대로 실행이 필요한 경우, ts-node 모듈(또는 ts 파일 실행해주는 도구) 설치 후 실행
 *
 * $ yarn ts-node headlessbrowser/cli.ts --uitest --device mobile --testcase main
 */
import childProcess from 'node:child_process';

import { isArgv, getArgv } from '#/utils/process';

if (process.argv.includes(`--uitest`)) {
  const headless = getArgv('headless');
  const device = getArgv('device');
  const testcase = getArgv('testcase');

  console.log('headless', headless);
  console.log('device', device);
  console.log('testcase', testcase);

  const message = childProcess.execSync('playwright test --ui', {
    stdio: 'inherit',
  });
  message && console.log(message);

  process.exit();
}
