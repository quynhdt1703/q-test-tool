import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { App as AntdApp, ConfigProvider, Spin } from 'antd';
import enUS from 'antd/locale/en_US';

import { useAppStore } from './modules/app/app.zustand';
import { routeTree } from './routeTree.gen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Import the generated route tree

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const theme = useAppStore((state) => state.theme);
  const loading = useAppStore((state) => state.loading);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme} locale={enUS}>
        <AntdApp>
          <Spin fullscreen spinning={loading} />
          <RouterProvider router={router} />
        </AntdApp>
      </ConfigProvider>

      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}

export default App;
