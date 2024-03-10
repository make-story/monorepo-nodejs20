/**
 * playwright helper
 * https://playwright.dev/docs/library
 * https://playwright.dev/docs/api/class-playwright
 */
import playwright, {
  chromium,
  firefox,
  webkit,
  request,
  devices,
  errors,
  selectors,
} from 'playwright';

interface CreateBrowserContextParam {
  browserType: 'chromium' | 'webkit';
  headless?: boolean;
  [key: string]: any;
}
export const createBrowserContext = async (
  { browserType, headless }: CreateBrowserContextParam = {
    browserType: 'chromium',
    headless: false,
  },
) => {
  // https://playwright.dev/docs/api/class-browsertype#browser-type-launch
  const browser = await playwright[browserType].launch({ headless });
  // https://playwright.dev/docs/api/class-browser#browser-new-context
  /*const context = await browser.newContext({
    ...devices['iPhone 11'],
  });*/
  const context = await browser.newContext();
  // https://playwright.dev/docs/api/class-browser#browser-new-page
  //const page = await browser.newPage(); // context 가 아닌, browser 로 newPage 호출할 경우, 새 브라우저 컨텍스트에서 새 페이지를 만듭니다.
  //const pageOne = await context.newPage();
  //const pageTwo = await context.newPage();
  //const allPages = context.pages();
  return {
    browser,
    context,
  };
};

export const globalBrowserContext = createBrowserContext(); // 하나의 브라우저 컨텍스트를 Node 스레드에서 공유
