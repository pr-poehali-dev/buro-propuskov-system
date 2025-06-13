import { useState, useEffect, createContext, useContext } from "react";
import { useOperators } from "./useLocalStorage";
import { Operator } from "@/types";

interface AuthContextType {
  currentUser: Operator | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthState() {
  const { operators } = useOperators();
  const [currentUser, setCurrentUser] = useState<Operator | null>(null);

  // Проверяем сохраненную сессию при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    const user = operators.find(
      (op) =>
        op.username === username &&
        op.password === password &&
        op.status === "active",
    );

    if (user) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };
}

export { AuthContext };
