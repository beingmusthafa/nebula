import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex _no-scrollbar">
      <Sidebar />
      <div className="w-full h-screen overflow-y-auto p-8">{children}</div>
    </div>
  );
};

export default AdminLayout;
