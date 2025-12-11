'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { useState } from 'react';
import { persistor, store } from '@/store';
import { ToastProvider } from '@medisync/ui';
import { PersistGate } from 'redux-persist/lib/integration/react';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 1000 * 60, 
      },
    },
  }));

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider position="bottom-right">
            {children}
          </ToastProvider>
        </QueryClientProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
