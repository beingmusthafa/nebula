import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Unauthorized from "../../pages/error/Unauthorized";
import AdminLayout from "../admin/AdminLayout";

const AdminAuth: React.FC = () => {
  const { currentUser } = useSelector((state: any) => state.user);
  if (!currentUser) return <Navigate to="/sign-in" />;
  else if (currentUser.role !== "admin") return <Unauthorized />;
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminAuth;
