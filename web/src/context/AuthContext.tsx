import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getTokens } from "../util/helpers";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string, csrf: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for an existing token on initial load
  useEffect(() => {
    const token = getTokens();

    if (token["x-auth-token"] && token["x-csrf-token"]) {
      try {
        const decodedToken = jwtDecode(token["x-auth-token"]);

        if (decodedToken && (decodedToken.exp || 0) * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    }
  }, []);

  const login = (token: string, csrf: string) => {
    const maxAge = 30 * 60; // 30 minutes in seconds

    // Set the x-csrf-token cookie
    document.cookie = `x-csrf-token=${csrf}; max-age=${maxAge}; path=/; Secure; SameSite=Strict`;

    // Set the x-auth-token cookie
    document.cookie = `x-auth-token=${token}; max-age=${maxAge}; path=/; Secure; SameSite=Strict`;

    // Update authentication state
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear the x-auth-token cookie
    document.cookie =
      "x-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";

    // Clear the x-csrf-token cookie
    document.cookie =
      "x-csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";

    // Update authentication state
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
