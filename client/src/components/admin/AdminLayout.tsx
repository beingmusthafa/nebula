import React, { useState } from "react";
import Sidebar from "./Sidebar.tsx";

interface Props {
  children: React.ReactNode;
}
const AdminLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Sidebar />
      <div className="_admin-content">{children}</div>
    </>
  );
};

export default AdminLayout;
