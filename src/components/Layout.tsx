
import { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { useAuth } from "@/context/AuthContext";
import { AuthStatus } from "@/types";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { status } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {status === AuthStatus.AUTHENTICATED && <NavBar />}
      <main className="flex-1 w-full container">
        {children}
      </main>
    </div>
  );
};
