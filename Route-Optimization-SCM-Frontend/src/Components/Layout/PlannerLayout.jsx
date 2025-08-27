import { Outlet } from "react-router-dom";
import NavBarPlanner from "../NavBarPlanner/NavBarPlanner";

const PlannerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBarPlanner />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default PlannerLayout;
