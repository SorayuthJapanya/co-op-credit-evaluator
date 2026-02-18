import { useAuthContext } from "@/hooks/useAuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { authUser } = useAuthContext();

  if (authUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-white to-primary/5">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
