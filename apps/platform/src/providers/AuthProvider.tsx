import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User } from '@leetcraft/db';
import AuthService from '@/api/services/auth';

type CurrentUser = Pick<User, 'name' | 'email' | 'role'>;

interface IAuthContext {
  auth: {
    user: CurrentUser | null;
  };
  setAuth: ({ user }: { user: CurrentUser | null }) => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const storageUser = localStorage.getItem('user');
  const [auth, setAuth] = useState<{ user: CurrentUser | null }>({
    user: storageUser ? JSON.parse(storageUser) : null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { name, email, role } = await AuthService.getMe();
        setAuth({
          user: { name, email, role },
        });
        localStorage.setItem('user', JSON.stringify({ name, email, role }));
      } catch (error) {
        setAuth({ user: null });
        localStorage.removeItem('user');
      }
    };

    fetchUser();
  }, []);

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
