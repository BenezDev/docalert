import { useState, useEffect, createContext, useContext, type ReactNode } from "react";

// Mock auth context for frontend-only version
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USER: User = {
  id: "mock-user-1",
  name: "João Silva",
  email: "joao@email.com",
  phone: "(11) 99999-9999",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("docalert_user");
    if (saved) setUser(JSON.parse(saved));
    setIsLoading(false);
  }, []);

  const login = async (_email: string, _password: string) => {
    setUser(MOCK_USER);
    localStorage.setItem("docalert_user", JSON.stringify(MOCK_USER));
  };

  const signup = async (name: string, email: string, _password: string) => {
    const newUser = { ...MOCK_USER, name, email };
    setUser(newUser);
    localStorage.setItem("docalert_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("docalert_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
