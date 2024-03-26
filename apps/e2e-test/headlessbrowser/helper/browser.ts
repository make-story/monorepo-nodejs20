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

export const BROWSER_TYPE = {
  CHROMIUM: 'chromium',
  WEBKIT: 'webkit',
} as const;

interface CreateBrowserContextParam {
  browserType: (typeof BROWSER_TYPE)[keyof typeof BROWSER_TYPE];
  headless?: boolean;
  devtools?: boolean;
  [key: string]: any;
}
export const createBrowserContext = async (
  { browserType, headless, devtools }: CreateBrowserContextParam = {
    browserType: 'chromium',
    headless: false,
    devtools: true,
  },
) => {
  let browser, context;

  try {
    // https://playwright.dev/docs/api/class-browsertype#browser-type-launch
    browser = await playwright[browserType].launch({
      headless,
      devtools,
    });
    // https://playwright.dev/docs/api/class-browser#browser-new-context
    /*const context = await browser.newContext({
    ...devices['iPhone 11'],
  });*/
    context = await browser.newContext();
    // https://playwright.dev/docs/api/class-browser#browser-new-page
    //const page = await browser.newPage(); // context 가 아닌, browser 로 newPage 호출할 경우, 새 브라우저 컨텍스트에서 새 페이지를 만듭니다.
    //const pageOne = await context.newPage();
    //const pageTwo = await context.newPage();
    //const allPages = context.pages();
  } catch (error) {
    console.error(error);
  }

  return {
    browser,
    context,
  };
};

//export const globalBrowserContext = createBrowserContext(); // 하나의 브라우저 컨텍스트를 Node 스레드에서 공유
