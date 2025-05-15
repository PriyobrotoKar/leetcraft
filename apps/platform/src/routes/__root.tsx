import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import AuthContextProvider from '@/providers/AuthProvider';
import { Toaster } from '@leetcraft/ui/components/sonner';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <ReactQueryProvider>
        <AuthContextProvider>
          <Toaster richColors />
          <Outlet />
        </AuthContextProvider>
      </ReactQueryProvider>
    </React.Fragment>
  );
}
