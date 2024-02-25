/**
 * UI Test 실행
 */
import childProcess from 'node:child_process';
import { isArgv, getArgv } from '../utils/process';

// cmd(커멘드라인)에서 실행
// ts 파일 그대로 실행이 필요한 경우, ts-node 모듈(또는 ts 파일 실행해주는 도구) 설치 후 실행
if (process.argv.includes(`--start`)) {
  console.log('headless', getArgv('headless'));
  console.log('device', getArgv('device'));
  console.log('testcase', getArgv('testcase'));
  const message = childProcess.execSync('playwright test --ui', {
    stdio: 'inherit',
  });
  message && console.log(message);
  process.exit();
}
