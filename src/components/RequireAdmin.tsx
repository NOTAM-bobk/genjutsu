import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FrogLoader } from "@/components/ui/FrogLoader";

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <FrogLoader className="" size={24} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;

