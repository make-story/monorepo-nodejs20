/**
 * https://medium.com/@randombitsdev/advanced-guide-to-module-federation-8f25431cbf3c
 * https://randombits.dev/articles/module-federation-advanced
 */
declare global {
  const __webpack_init_sharing__: (parameter: string) => Promise<void>;
  const __webpack_share_scopes__: { default: any };
  const __webpack_require__: {
    l: (url: string, cb: (event: any) => void, id: string) => {};
  };
  export interface Window {
    [key: string | number | symbol]: any;
  }
}

const loadRemote = (url: string, scope: string) =>
  new Promise<void>((resolve, reject) => {
    const timestamp = `?t=${new Date().getTime()}`;
    __webpack_require__.l(
      `${url}${timestamp}`,
      event => {
        if (event?.type === 'load') {
          resolve();
        } else {
          reject(new Error(`Loading script failed: ${event?.target?.src}`));
        }
      },
      scope,
    );
  });
const initSharing = async () => {
  if (!__webpack_share_scopes__?.default) {
    await __webpack_init_sharing__('default');
  }
};
const initContainer = async (containerScope: any) => {
  if (!containerScope.__initialized && !containerScope.__initializing) {
    containerScope.__initializing = true;
    await containerScope.init(__webpack_share_scopes__.default);
    containerScope.__initialized = true;
    delete containerScope.__initializing;
  }
};
export const importRemote = async <T>(
  url: string,
  scope: string,
  module: string,
): Promise<T> => {
  if (!window[scope]) {
    // Load the remote and initialize the share scope if it's empty
    await Promise.all([loadRemote(url, scope), initSharing()]);
    if (!window[scope]) {
      throw new Error(`${scope} not found on window object`);
    }
    // Initialize the container to get shared modules and get the module factory:
    const [, moduleFactory] = await Promise.all([
      initContainer(window[scope]),
      window[scope].get(module.startsWith('./') ? module : `./${module}`),
    ]);
    return moduleFactory();
  } else {
    const moduleFactory = await window[scope].get(
      module.startsWith('./') ? module : `./${module}`,
    );
    return moduleFactory();
  }
};

const REMOTE_URLS: { [key: string | number | symbol]: any } = {};
export const importRemoteByName = (
  remoteName: string,
  module = 'bootstrap',
) => {
  const url = REMOTE_URLS[remoteName] + '/remoteEntry.js';
  return importRemote(url, remoteName, module);
};
/*
importRemote('http://localhost:3001/remoteEntry.js', 'app1', 'metadata').then((metadata) => {
    console.log(metadata.name);
});
*/

/*
if (!window.customElements.get('app1')) {
    class App1 extends HTMLElement {
        private reactRoot: Root = null;
        connectedCallback() {
            this.reactRoot = createRoot(this);
            this.reactRoot.render(<App/>);
        }
        disconnectedCallback() {
            setTimeout(() => {
                this.reactRoot.unmount();
                this.reactRoot = null;
            })
        }
    }
    window.customElements.define('app1', App1);
}
*/

/*
const RemoteApp = ({appName, params}: Params) => {
    useEffect(() => {
        importRemoteByName(appName).catch((e) => {
            // handle error if needed
        });
    }, []);
    const CustomElement = `remote-${appName}`;
    return <CustomElement {...params}/>;
};
*/
