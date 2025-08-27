import LoginPage from "../Pages/LoginPage/LoginPage";
import ForgotPassword from "../Pages/ForgotPassword/ForgotPassword";
import { Routes, Route } from "react-router-dom";
import VerifyCode from "../Pages/VerifyCode/VerifyCode";
import ResetPassword from "../Pages/ResetPassword/ResetPassword";
import Home from "../Pages/Home/Home";
import Admin from "../Pages/Admin/Admin";
import AccountManagement from "../Pages/Admin/AccountManagement/AccountManagement";
import Supplier from "../Pages/Admin/Supplier/Supplier";
import LoginWithSSO from "../Components/LoginWithSSO/LoginWithSSO";
import Planner from "../Pages/Planner/Planner";
import Optimization from "../Pages/Optimization/Optimization";
import Manager from "../Pages/Manager/Manager";
import Monitor from "../Pages/Manager/Monitor/Monitor";
import UserManagement from "../Pages/UserManagement/UserManagement";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../Pages/404NotFound/404NotFound";
import PlannerLayout from "../Components/Layout/PlannerLayout";
import ManagerLayout from "../Components/Layout/ManagerLayout";
import Dashboard from "../Pages/Admin/Dashboard/Dashboard";
import AdminLayout from "../Components/Layout/AdminLayout";
import Vehicle from "../Pages/Admin/Vehicle/Vehicle";
import Parking from "../Pages/Admin/Parking/Parking";
import AuditLog from "../Pages/Admin/AuditLog/AuditLog";
import Permission from "../Pages/Admin/Permission/Permission";
import Role from "../Pages/Admin/Role/Role";
const AppRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/code" element={<LoginWithSSO />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Planner Route */}
      <Route
        element={
          <PrivateRoute allowedRoles={["planner"]}>
            <PlannerLayout />
          </PrivateRoute>
        }
      >
        <Route path="/planner" element={<Planner />} />
        <Route path="/optimization" element={<Optimization />} />
        <Route path="/planner/account" element={<UserManagement />} />
      </Route>

      {/* Manager Route */}
      <Route
        element={
          <PrivateRoute allowedRoles={["manager"]}>
            <ManagerLayout />
          </PrivateRoute>
        }
      >
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/manager/account" element={<UserManagement />} />
      </Route>

      {/* Admin Route */}
      <Route
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/account"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AccountManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/supplier"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Supplier />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/vehicle"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Vehicle />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/parking"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Parking />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/audit-log"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AuditLog />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/permission"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Permission />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/role"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Role />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoute;
