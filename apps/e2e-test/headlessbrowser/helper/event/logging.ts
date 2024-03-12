/**
 * page event
 * https://playwright.dev/docs/api/class-page#events
 */
import {
  chromium,
  devices,
  Browser,
  BrowserContext,
  Page,
  Request,
  Response,
  ConsoleMessage,
} from 'playwright';

import { WebSocketType } from '#/websocket/type';
import { messageRules } from '#/headlessbrowser/utils/index';

const loggingBrowser = (browser: Browser, ws: WebSocketType) => {
  browser.off('disconnected', data => {});
  browser.on('disconnected', data => {});
};
const loggingContext = (context: BrowserContext, ws: WebSocketType) => {
  context.on('console', async msg => {
    const values = [];
    for (const arg of msg.args()) values.push(await arg.jsonValue());
    console.log(...values);
  });
};
const loggingPage = (page: Page, ws: WebSocketType) => {
  /**
   * page 로드 완료
   */
  const load = () => {
    // 메시지 전송
    ws.send(messageRules('load', '페이지 로드 완료!'));
  };
  page.once('load', () => load);

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

export const loggingEvent = ({
  browser,
  context,
  page,
  ws,
}: {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  ws: WebSocketType;
}) => {
  browser && loggingBrowser(browser, ws);
  context && loggingContext(context, ws);
  page && loggingPage(page, ws);
};
