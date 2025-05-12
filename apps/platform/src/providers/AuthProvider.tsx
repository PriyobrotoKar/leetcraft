import { createContext, ReactNode, useContext, useState } from 'react';
import { User } from '@leetcraft/db';

type CurrentUser = Pick<User, 'id' | 'name' | 'email' | 'role'>;

interface IAuthContext {
  auth: {
    user: CurrentUser | null;
  };
  setAuth: ({ user }: { user: CurrentUser | null }) => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<{ user: CurrentUser | null }>({
    user: null,
  });

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth should be used within AuthContextProvider');
  }

  return context;
}
