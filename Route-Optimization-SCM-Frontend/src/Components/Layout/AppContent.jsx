/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { doGetAccount } from "../../redux/action/accountAction";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import AppRoute from "../../routes/AppRoute";

const AppContent = ({ firstRenderRef }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.account.userInfo);

  const protectedPaths = [
    "/admin",
    "/admin/account",
    "/admin/supplier",
    "/planner",
    "/optimization",
    "/manager",
    "/monitor",
    "/users",
    "/planner/account",
    "/manager/account",
    "/admin/dashboard",
    "/admin/vehicle",
    "/admin/parking",
    "/admin/audit-log",
    "/admin/permission",
    "/admin/role",
  ];

  useEffect(() => {
    const checkAuth = async () => {
      // Only check auth on first render for protected paths
      if (
        protectedPaths.some((path) => location.pathname.startsWith(path)) &&
        firstRenderRef.current
      ) {
        dispatch(doGetAccount());
        firstRenderRef.current = false;
      } else {
        firstRenderRef.current = false;
      }
    };

    checkAuth();
  }, [location.pathname]);

  const hideNavbarPaths = [
    "/login",
    "/verify-code",
    "/forgot-password",
    "/reset-password",
    "/404",
    ...protectedPaths,
  ];

  const hideFooterPaths = [...protectedPaths];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <AppRoute />
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
};

export default AppContent;
