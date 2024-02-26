/**
 * UI Test 실행
 */
import * as http from 'node:http';
import childProcess from 'node:child_process';
import {
  chromium,
  devices,
  Page,
  Request,
  Response,
  ConsoleMessage,
} from 'playwright';
import assert from 'node:assert';

import { WebSocketType } from '../websocket/type';
import { isArgv, getArgv } from '../utils/process';

/**
 * cmd(커멘드라인)에서 실행
 * ts 파일 그대로 실행이 필요한 경우, ts-node 모듈(또는 ts 파일 실행해주는 도구) 설치 후 실행
 *
 * $ yarn ts-node headlessbrowser/uitest.ts --start --device mobile --testcase main
 */
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

/**
 * 소켓 전송 메시지 규칙 (포맷 가공)
 */
const messageRules = (type: string, message: string, payload: any) => {
  return JSON.stringify({ type, message, payload });
};

/**
 * page event
 * https://playwright.dev/docs/api/class-page#events
 */
const loggingEvent = (page: Page, ws: WebSocketType) => {
  /**
   * 리소스 요청건
   */
  const request = (request: Request) => {
    const isNavigation = request.isNavigationRequest();
    const pageUrl = page.url();
    const resourceType = request.resourceType(); // document, stylesheet, image, media, font, script, texttrack, xhr, fetch, eventsource, websocket, manifest, other
    const url = request.url();

    // 메시지 전송
    ws.send(
      messageRules('request', [resourceType, url].join(' / '), {
        pageUrl,
        resourceType,
        url,
      }),
    );
  };
  page.off('request', request);
  page.on('request', request);

  /**
   * 요청 실패
   * 404 또는 503과 같은 HTTP 오류 응답은 여전히 ​​HTTP 관점에서의 성공적인 응답으로 판단
   */
  const requestfailed = (request: Request) => {
    const pageUrl = page.url();
    const resourceType = request.resourceType();
    const url = request.url();
    let errorText = '';

    try {
      errorText = request?.failure()?.errorText || '';
    } catch (e) {}

    console.error(
      '[UITest] whoops requestfailed!',
      [resourceType, url, errorText].join(' - '),
    );

    // 메시지 전송
    ws.send(
      messageRules(
        'requestfailed',
        [resourceType, url, errorText].join(' / '),
        { pageUrl, resourceType, url, errorText },
      ),
    );
  };
  page.off('requestfailed', requestfailed);
  page.on('requestfailed', requestfailed);

  /**
   * 요청 성공적 완료
   */
  const requestfinished = (request: Request) => {
    const pageUrl = page.url();
    const resourceType = request.resourceType();
    const url = request.url();
    const failure = request.failure();

    failure &&
      console.log(
        '[UITest] requestfinished',
        [resourceType, url, failure].join(' - '),
      );

    // 메시지 전송
    ws.send(
      messageRules(
        'requestfinished',
        [resourceType, url, failure].join(' / '),
        { pageUrl, resourceType, url, failure },
      ),
    );
  };
  page.off('requestfinished', requestfinished);
  page.on('requestfinished', requestfinished);

  /**
   * 리소스 응답건
   */
  const response = (response: Response) => {
    const pageUrl = page.url();
    const request = response.request();
    const resourceType = request.resourceType();
    const status = response.status();
    const statusText = response.statusText();
    const url = response.url();
    const ok = response.ok(); // HTTP status 3xx 에서는 false

    400 <= status &&
      status < 600 &&
      console.log(
        '[UITest] response',
        [ok, status, statusText, resourceType, url].join(' - '),
      );

    // 메시지 전송
    ws.send(
      messageRules(
        'response',
        [status, statusText, resourceType, url].join(' / '),
        { pageUrl, ok, status, statusText, resourceType, url },
      ),
    );
  };
  page.off('response', response);
  page.on('response', response);

  /**
   * domcontentloaded, load
   */
  //page.on('domcontentloaded', () => console.log('[UITest] page domcontentloaded!'));
  //page.on('load', () => console.log('[UITest] page load!'));

  /**
   * 콘솔 메시지
   */
  const consoleMessage = (consoleMessage: ConsoleMessage) => {
    const pageUrl = page.url();
    // type: 'log', 'debug', 'info', 'error', 'warning', 'dir', 'dirxml', 'table', 'trace', 'clear', 'startGroup', 'startGroupCollapsed', 'endGroup', 'assert', 'profile', 'profileEnd', 'count', 'timeEnd'
    const type = consoleMessage.type();
    // console.log('hello', 5, {foo: 'bar'})); 형태로 log 파라미터에 추가된 값
    const args = consoleMessage.args();
    // 메시지
    const text = consoleMessage.text();

    // 메시지 출력
    //headless && (type in console ? console[type]('[UITest]', text) : console.log('[UITest]', text));

    // 메시지 전송
    ws.send(
      messageRules('console', text, {
        pageUrl,
        text,
        args,
        consoleType: type,
      }),
    );
  };
  page.off('console', consoleMessage);
  page.on('console', consoleMessage);
};

const running = async (request: http.IncomingMessage, ws: WebSocketType) => {
  /**
   * TODO:
   * - 각각의 테스트는 new TestCase 처럼, 여러 소켓에 대응가능하도록 인스턴스 생성하여 실행 한다.
   * - 소켓이 종료 또는 이슈가 발생하면, 테스트도 중단되어야 한다.
   */

  // 브라우저 셋업
  const browser = await chromium.launch();
  const context = await browser.newContext(devices['iPhone 11']);
  const page = await context.newPage();

  // 로깅전달 공통 이벤트
  loggingEvent(page, ws);

  // 테스트 케이스
  await context.route('**.jpg', route => route.abort());
  await page.goto('https://example.com/');
  assert((await page.title()) === 'Example Domain'); // 👎 not a Web First assertion

  // 종료
  await context.close();
  await browser.close();
  ws.close();
};

export { running };
