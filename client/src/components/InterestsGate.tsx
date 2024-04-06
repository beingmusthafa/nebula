import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const InterestsGate = () => {
  const { currentUser } = useSelector((state: any) => state.user);
  if (!currentUser || currentUser?.interests?.length > 0) {
    return <Outlet />;
  }
  return <Navigate to={"/add-interests"} />;
};

export default InterestsGate;
