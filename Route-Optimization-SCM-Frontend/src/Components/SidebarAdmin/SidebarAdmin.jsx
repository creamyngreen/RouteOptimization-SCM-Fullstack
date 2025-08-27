import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  LuLayoutDashboard,
  LuParkingCircle,
  LuFileKey,
  LuUsers,
} from "react-icons/lu";
import {
  MdManageAccounts,
  MdSupervisorAccount,
  MdEmojiTransportation,
  MdOutlineManageHistory,
} from "react-icons/md";
import Logo from "../../assets/Home/Logo/Logo.png";
import { Button, Layout, Menu, theme, Breadcrumb } from "antd";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SidebarAdmin.css";
import { FaUser } from "react-icons/fa";
import noti from "../../assets/Planner/noti.png";
import { useSelector } from "react-redux";

const { Header, Sider, Content } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector((state) => state.account.userInfo);

  // Define breadcrumb name map
  const breadcrumbNameMap = {
    "/admin": "Dashboard",
    "/admin/account": "Account",
    "/admin/supplier": "Supplier",
    "/admin/vehicle": "Vehicle",
    "/admin/parking": "Parking",
    "/admin/audit-log": "Audit Log",
    "/admin/permission": "Permission",
    "/admin/role": "Role",
  };

  // Generate breadcrumb items based on location
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const routeName = breadcrumbNameMap[url];

    const breadcrumbLabel = routeName;

    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbLabel}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [].concat(extraBreadcrumbItems);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/");
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: "white" }}
      >
        <div className="logo">
          <img
            src={Logo}
            className={`h-${collapsed ? "6" : "8"} lg:h-${
              collapsed ? "10" : "14"
            }`}
            alt="Logo"
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[""]}
          items={[
            {
              key: "",
              icon: <LuLayoutDashboard />,
              label: "Dashboard",
              onClick: () => navigate("/admin/dashboard"),
            },
            {
              key: "account",
              icon: <MdManageAccounts />,
              label: "Account",
              onClick: () => navigate("/admin/account"),
            },
            {
              key: "permission",
              icon: <LuFileKey />,
              label: "Permission",
              onClick: () => navigate("/admin/permission"),
            },
            {
              key: "role",
              icon: <LuUsers />,
              label: "Role",
              onClick: () => navigate("/admin/role"),
            },
            {
              key: "supplier",
              icon: <MdSupervisorAccount />,
              label: "Supplier",
              onClick: () => navigate("/admin/supplier"),
            },
            {
              key: "vehicle",
              icon: <MdEmojiTransportation />,
              label: "Vehicle",
              onClick: () => navigate("/admin/vehicle"),
            },
            {
              key: "5",
              icon: <LuParkingCircle />,
              label: "Parking",
              onClick: () => navigate("/admin/parking"),
            },
            {
              key: "6",
              icon: <MdOutlineManageHistory />,
              label: "Audit log",
              onClick: () => navigate("/admin/audit-log"),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex justify-between items-center w-full">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />

            {/* Notification and User Profile Buttons Container */}
            <div className="flex items-center">
              {/* Notification Button */}
              <button
                type="button"
                className="relative mr-5 inline-flex items-center p-2 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-orange-600 focus:ring-2 focus:outline-none focus:ring-orange-500"
              >
                <img
                  src={noti}
                  alt="Notifications"
                  className="w-4 h-4 filter invert contrast-200 brightness-200"
                />
                <span className="sr-only">Notifications</span>
                <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-secondary border-2 border-white rounded-full -top-2 -end-2">
                  5
                </div>
              </button>

              {/* User Profile Button */}
              {user && (
                <div className="relative mr-5">
                  <button
                    type="button"
                    className="flex items-center text-sm bg-orange-50 justify-center rounded-md md:me-0 h-10 focus:ring-4 focus:ring-gray-300"
                    onClick={toggleDropdown}
                    aria-expanded={isDropdownOpen}
                  >
                    <div className="flex items-center justify-center p-5">
                      <div className="flex items-center justify-center w-7 h-7 bg-primary rounded-full">
                        <FaUser className="text-white" />
                      </div>
                      <span className="ml-2 text-gray-900 hidden sm:block">
                        {user.username}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-3">
                        <span className="block text-xl font-semibold text-gray-900">
                          {user.fullname}
                        </span>
                        <span className="block text-sm text-gray-500 truncate mt-3">
                          {user.email}
                        </span>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <div className="border border-primary rounded px-2 py-0.5 text-xs text-primary">
                            {user.roleWithPermission?.description}
                          </div>
                          <div className="border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-500">
                            Free
                          </div>
                        </div>
                      </div>
                      <ul className="py-2">
                        <li>
                          <a
                            href="/manager/account"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Basic Information Management
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Contact Us
                          </a>
                        </li>
                        <hr className="my-2 border-gray-200" />
                        <li>
                          <button
                            onClick={handleLogout} // You need to define handleLogout
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Log out
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Breadcrumb>{breadcrumbItems}</Breadcrumb>
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
