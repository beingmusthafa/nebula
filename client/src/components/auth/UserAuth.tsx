import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Suspended from "../../pages/error/Suspended";

const UserAuth: React.FC = () => {
  const { currentUser } = useSelector((state: any) => state.user);
  if (!currentUser) return <Navigate to="/sign-in" />;
  if (currentUser.isBlocked) return <Suspended />;
  return <Outlet />;
};

export default UserAuth;
