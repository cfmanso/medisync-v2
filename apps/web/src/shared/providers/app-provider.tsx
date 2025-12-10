'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { useState } from 'react';
import { store } from '@/store';
import { ToastProvider } from '@medisync/ui';

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
      <QueryClientProvider client={queryClient}>
        <ToastProvider position="bottom-right">
          {children}
        </ToastProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}