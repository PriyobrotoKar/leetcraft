import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import AuthContextProvider from '../providers/AuthProvider';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <AuthContextProvider>
        <Outlet />
      </AuthContextProvider>
    </React.Fragment>
  );
}
