import React, { useState } from "react";
import Sidebar from "./Sidebar.tsx";

interface Props {
  children: React.ReactNode;
}
const AdminLayout: React.FC<Props> = ({ children }) => {
  let [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="flex w-full h-full _no-scrollbar md:pl-64">
      <Sidebar />
      <div className="w-full h-full overflow-y-auto p-8">{children}</div>
    </div>
  );
};

export default AdminLayout;
