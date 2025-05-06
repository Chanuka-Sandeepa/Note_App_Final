
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AuthStatus } from "@/types";

const Index = () => {
  const navigate = useNavigate();
  const { status } = useAuth();
  
  useEffect(() => {
    if (status === AuthStatus.AUTHENTICATED) {
      navigate("/", { replace: true });
    } else if (status === AuthStatus.UNAUTHENTICATED) {
      navigate("/auth", { replace: true });
    }
  }, [status, navigate]);
  
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center animate-pulse">
        <div className="h-16 w-16 mx-auto rounded-xl bg-gradient-primary"></div>
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
