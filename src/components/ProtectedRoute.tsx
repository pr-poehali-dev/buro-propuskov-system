import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "operator";
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  if (
    requiredRole &&
    currentUser.role !== requiredRole &&
    currentUser.role !== "admin"
  ) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <Icon name="Shield" size={16} />
          <AlertDescription>
            У вас нет прав доступа к этой странице
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
