import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import VisitorRegistration from "./pages/VisitorRegistration";
import EmployeeManagement from "./pages/EmployeeManagement";
import BuildingManagement from "./pages/BuildingManagement";
import OperatorManagement from "./pages/OperatorManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="visitors" element={<VisitorRegistration />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route
          path="buildings"
          element={
            <ProtectedRoute requiredRole="admin">
              <BuildingManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="operators"
          element={
            <ProtectedRoute requiredRole="admin">
              <OperatorManagement />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
