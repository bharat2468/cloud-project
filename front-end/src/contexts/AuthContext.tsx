import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  gender: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  checkAuthStatus: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check if token is valid
  const isTokenValid = (tokenString: string): boolean => {
    try {
      const parts = tokenString.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token is expired (with 1 minute buffer)
      return payload.exp > (currentTime + 60);
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  // Check authentication status
  const checkAuthStatus = (): boolean => {
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken) {
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
      return false;
    }

    if (!isTokenValid(storedToken)) {
      console.log('Token expired, clearing auth state');
      logout();
      return false;
    }

    setToken(storedToken);
    setIsAuthenticated(true);
    
    // Try to get user data from token
    try {
      const parts = storedToken.split('.');
      const payload = JSON.parse(atob(parts[1]));
      if (payload.user) {
        setUser({
          id: payload.user.id,
          email: payload.user.email,
          firstName: payload.user.firstName,
          lastName: payload.user.lastName,
          age: payload.user.age,
          phone: payload.user.phone,
          gender: payload.user.gender
        });
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }

    return true;
  };

  // Login function
  const login = (newToken: string, userData?: User) => {
    if (isTokenValid(newToken)) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setIsAuthenticated(true);
      
      if (userData) {
        setUser(userData);
      } else {
        // Extract user data from token
        try {
          const parts = newToken.split('.');
          const payload = JSON.parse(atob(parts[1]));
          if (payload.user) {
            setUser({
              id: payload.user.id,
              email: payload.user.email,
              firstName: payload.user.firstName,
              lastName: payload.user.lastName,
              age: payload.user.age,
              phone: payload.user.phone,
              gender: payload.user.gender
            });
          }
        } catch (error) {
          console.error('Error extracting user from token:', error);
        }
      }
      
      console.log('✅ User logged in successfully');
    } else {
      console.error('Invalid token provided');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('productID');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    console.log('✅ User logged out successfully');
  };

  // Update user data
  const updateUser = (userData: User) => {
    setUser(userData);
  };

  // Check auth status on component mount and periodically
  useEffect(() => {
    checkAuthStatus();
    
    // Check token validity every minute
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;