/*export default function App() {
  return (
    <TemplateContext.Provider>
      <UserContext.Provider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </UserContext.Provider>
    </TemplateContext.Provider>
  );
}*/

import { PropsWithChildren } from 'react';

const buildProvidersTree = (componentsWithProps: any) => {
  const initialComponent = ({ children }: PropsWithChildren) => <>{children}</>;
  return componentsWithProps.reduce(
    (AccumulatedCoomponents: any, [Provider, props = {}]: any) => {
      const Node = ({ children }: PropsWithChildren) => {
        return (
          <AccumulatedCoomponents>
            <Provider {...props}>{children}</Provider>
          </AccumulatedCoomponents>
        );
      };
      Node.displayName = 'Node';
      return Node;
    },
    initialComponent,
  );
};

/*const ProvidersTree = buildProvidersTree([
  [TemplateContext.Provider],
  [UserContext.Provider],
  [QueryClientProvider, { client: queryClient }],
]);*/
const ProvidersTree = buildProvidersTree([]);

export default function App() {
  return (
    <ProvidersTree>
      <App />
    </ProvidersTree>
  );
}
