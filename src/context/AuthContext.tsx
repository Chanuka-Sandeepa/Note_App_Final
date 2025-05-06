
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthStatus, User } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.LOADING);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in (in a real app, you'd verify token with your backend)
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setStatus(AuthStatus.AUTHENTICATED);
      } catch (error) {
        setStatus(AuthStatus.UNAUTHENTICATED);
        localStorage.removeItem("user");
      }
    } else {
      setStatus(AuthStatus.UNAUTHENTICATED);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock login - in a real app, you'd call your API here
      // This is just a demo without real authentication
      if (email && password) {
        const mockUser: User = {
          id: Math.random().toString(36).substring(2, 12),
          name: email.split('@')[0],
          email
        };
        
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        setStatus(AuthStatus.AUTHENTICATED);
        toast({
          title: "Login successful",
          description: `Welcome back, ${mockUser.name}!`,
        });
        return;
      }
      
      throw new Error("Invalid credentials");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock signup - in a real app, you'd call your API here
      if (name && email && password) {
        const mockUser: User = {
          id: Math.random().toString(36).substring(2, 12),
          name,
          email
        };
        
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        setStatus(AuthStatus.AUTHENTICATED);
        toast({
          title: "Account created",
          description: `Welcome to ChromaCards, ${name}!`,
        });
        return;
      }
      
      throw new Error("Invalid user data");
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setStatus(AuthStatus.UNAUTHENTICATED);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        status, 
        login, 
        signup, 
        logout, 
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
