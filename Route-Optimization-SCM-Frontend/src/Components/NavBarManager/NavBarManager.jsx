import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doLogout } from "../../redux/action/accountAction";
import { FaUser } from "react-icons/fa";
import { RiMenu3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import Logo from "../../assets/Home/Logo/Logo.png";
import noti from "../../assets/Planner/noti.png";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
function NavBarManager() {
  const user = useSelector((state) => state.account.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(doLogout());
    navigate("/");
  };

  return (
    <nav className="bg-white border-gray-200 border-b-2">
      <div className="max-w-screen-3xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={Logo} className="h-8 sm:h-12" alt="Logo" />
        </a>

        {/* Mobile Right Section */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Notification Button*/}
          <button
            type="button"
            className="relative inline-flex items-center p-2 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-orange-600 focus:ring-2 focus:outline-none focus:ring-orange-500"
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

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-600"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <IoMdClose className="w-6 h-6" />
            ) : (
              <RiMenu3Line className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between w-full md:w-auto md:order-1">
          <ul className="flex flex-col font-medium text-xl p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <a
                href="/manager"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0"
                aria-current="page"
              >
                Procurement Plan
              </a>
            </li>
            <li>
              <a
                href="/monitor"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-500 md:p-0"
              >
                Monitoring
              </a>
            </li>
          </ul>
        </div>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <NotificationDropdown />

          {/* User Profile Button */}
          {user && (
            <div className="relative">
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
                        onClick={handleLogout}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full">
            <ul className="flex flex-col font-medium mt-4 space-y-2">
              <li>
                <a
                  href="/manager"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100"
                >
                  Procurement Plan
                </a>
              </li>
              <li>
                <a
                  href="/monitor"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100"
                >
                  Monitoring
                </a>
              </li>
            </ul>

            {/* Mobile User Profile */}
            {user && (
              <div className="mt-4 bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-7 h-7 bg-primary rounded-full">
                    <FaUser className="text-white" />
                  </div>
                  <span className="ml-2 text-gray-900">{user.username}</span>
                </div>
                <div className="mt-4 space-y-2">
                  <a
                    href="/manageaccount"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Basic Information Management
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Contact Us
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBarManager;
