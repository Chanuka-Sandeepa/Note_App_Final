
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NoteProvider } from "./context/NoteContext";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { ProfilePage } from "./pages/ProfilePage";
import { RemindersPage } from "./pages/RemindersPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import { AuthStatus } from "./types";

const queryClient = new QueryClient();

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { status } = useAuth();
  
  if (status === AuthStatus.LOADING) {
    return <div className="min-h-screen grid place-items-center">Loading...</div>;
  }
  
  if (status === AuthStatus.UNAUTHENTICATED) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

const AuthRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route
      path="/"
      element={
        <RequireAuth>
          <Layout>
            <Dashboard />
          </Layout>
        </RequireAuth>
      }
    />
    <Route
      path="/profile"
      element={
        <RequireAuth>
          <Layout>
            <ProfilePage />
          </Layout>
        </RequireAuth>
      }
    />
    <Route
      path="/reminders"
      element={
        <RequireAuth>
          <Layout>
            <RemindersPage />
          </Layout>
        </RequireAuth>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <NoteProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthRoutes />
          </BrowserRouter>
        </NoteProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
