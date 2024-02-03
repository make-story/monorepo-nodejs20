const getModuleFederation = async ({
  url = '/_next/static/chunks/remoteEntry.js',
  scope = 'microfrontend',
  module = './home',
} = {}) => {
  const remote = await import(url);
  const container = window?.[scope] || {};
  container?.init();
  return container.get(module).then(factory => ({ default: factory() }));
};
(async () => {
  const component = await getModuleFederation();
  console.log(component?.default);
})();
