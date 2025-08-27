import { Outlet } from "react-router-dom";
import NavBarManager from "../NavBarManager/NavBarManager";

const ManagerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBarManager />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default ManagerLayout;
