/**
 * cmd(커멘드라인)에서 실행
 * ts 파일 그대로 실행이 필요한 경우, ts-node 모듈(또는 ts 파일 실행해주는 도구) 설치 후 실행
 *
 * $ yarn ts-node headlessbrowser/cli.ts --uitest --device mobile --testcase main
 */
import childProcess from 'node:child_process';
import playwright, {
  chromium,
  firefox,
  webkit,
  request,
  devices,
  errors,
  selectors,
} from 'playwright';

import { isArgv, getArgv } from '#/utils/process';
import { globalBrowserContext } from '#/headlessbrowser/helper/browser';
import { createChromeDevtoolsProtocol } from '#/headlessbrowser/helper/devtools';
import temp from '#/testcase/temp';

if (process.argv.includes(`--uitest`)) {
  const headless = getArgv('headless');
  const device = getArgv('device');
  const testcase = getArgv('testcase');

  console.log('headless', headless);
  console.log('device', device);
  console.log('testcase', testcase);

  /*const message = childProcess.execSync('playwright test --ui', {
    stdio: 'inherit',
  });
  message && console.log(message);*/

  (async () => {
    const { browser, context } = await globalBrowserContext;
    const page = await context.newPage();
    const client = await createChromeDevtoolsProtocol({ page });
    await client.send('Emulation.setUserAgentOverride', {
      userAgent: devices['iPhone 11'].userAgent,
    });
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: devices['iPhone 11'].viewport.width,
      height: devices['iPhone 11'].viewport.height,
      mobile: true,
      deviceScaleFactor: 0,
    });
    await temp({ browser, page });
    //process.exit();
  })();
} else {
  console.warn('실행가능한 명령이 없습니다.');
  process.exit();
}
