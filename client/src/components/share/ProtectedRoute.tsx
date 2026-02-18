import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import MainLayout from "@/layouts/MainLayout";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { authUser, isLoading, isError } = useAuthContext();

  useEffect(() => {
    // 1. If checking is done, and no user is found, OR if an error occurred -> Go to Login
    if ((!isLoading && !authUser) || isError) {
      navigate("/login", { replace: true });
    }
  }, [authUser, isLoading, isError, navigate]);

  // 2. While loading, show a spinner (or skeleton)
  if (isLoading) return <div>กำลังโหลด...</div>;

  // 3. If we are here, we might be redirecting soon, so render null to prevent flash
  if (!authUser || isError) return null;

  return (
    <MainLayout authUser={authUser}>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedRoute;
