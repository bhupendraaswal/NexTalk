import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/useAuthStore";
import WebSkeleton from "../components/skeletons/WebSkeleton";

const GuestRoute = () => {
  const { user, authChecked } = useAuthStore();

  if (!authChecked) {
    return <WebSkeleton />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
