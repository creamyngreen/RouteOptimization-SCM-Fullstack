import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SidebarAdmin />
      <div className="flex-1"></div>
    </div>
  );
};

export default AdminLayout;
