/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const user = useSelector((state) => state.account.userInfo);
  const userRole = user?.roleWithPermission?.name;
  const location = useLocation();

  // If no user or no access token, redirect to login with current location
  if (!user || !user.access_token) {
    return (
      <Navigate
        to={`${import.meta.env.VITE_BACKEND_SSO}?serviceURL=${
          import.meta.env.VITE_SERVICE_URL
        }`}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Check if user's role is allowed to access this route
  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate route based on role instead of 404
    const roleRoutes = {
      admin: "/admin",
      manager: "/manager",
      planner: "/planner",
    };
    const redirectTo = roleRoutes[userRole] || "/404";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PrivateRoute;
