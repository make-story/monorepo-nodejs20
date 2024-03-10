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
  BrowserContext,
  Page,
} from 'playwright';

// CDP - Chrome Devtools Protocol
// https://playwright.dev/docs/api/class-cdpsession
// https://playwright.dev/docs/api/class-browsercontext#browser-context-new-cdp-session
// https://chromedevtools.github.io/devtools-protocol/tot/Emulation
// node_modules/playwright-core/types/protocol.d.ts
export const createChromeDevtoolsProtocol = ({
  context,
  page,
}: {
  context?: BrowserContext;
  page: Page;
}) => {
  if (context) {
    return context.newCDPSession(page);
  } else {
    return page.context().newCDPSession(page);
  }
};
