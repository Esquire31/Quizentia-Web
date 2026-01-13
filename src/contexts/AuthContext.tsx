import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  idToken: string | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  idToken: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const tokenResult = await user.getIdTokenResult();
        
        setUser(user);
        setIdToken(token);
        setIsAdmin(tokenResult.claims.admin === true);
      } else {
        setUser(null);
        setIdToken(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Refresh token and claims every 50 minutes (tokens expire after 60 min)
  useEffect(() => {
    if (user) {
      const interval = setInterval(async () => {
        try {
          const token = await user.getIdToken(true); // Force refresh
          const tokenResult = await user.getIdTokenResult(true);
          
          setIdToken(token);
          setIsAdmin(tokenResult.claims.admin === true);
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }, 50 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setIdToken(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    idToken,
    isAdmin,
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
