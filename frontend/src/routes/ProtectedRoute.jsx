import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/useAuthStore";
import WebSkeleton from "../components/skeletons/WebSkeleton";

const ProtectedRoute = () => {
  const { user, authChecked } = useAuthStore();

  if (!authChecked) {
    return <WebSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
