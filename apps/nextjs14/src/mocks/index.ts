/**
 * https://jaypedia.tistory.com/382
 * https://ianlog.me/blog/next-server-msw
 */
async function initMocks() {
  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen();
  } else {
    const { worker } = await import('./browser');
    worker.start();
  }
}

export { initMocks };
