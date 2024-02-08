import React, { useState } from "react";
import Sidebar from "./Sidebar.tsx";

interface Props {
  children: React.ReactNode;
}
const AdminLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="md:pl-64">
      <Sidebar />
      <div className="p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
