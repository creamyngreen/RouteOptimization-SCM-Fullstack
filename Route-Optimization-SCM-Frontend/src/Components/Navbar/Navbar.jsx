import Logo from "../../assets/Home/Logo/Logo.png";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="bg-white py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center ml-10">
          <img src={Logo} alt="EffiRoute Logo" className="h-auto w-52 mr-2" />
        </div>

        <div className="flex justify-items-end space-x-20 mr-12">
          <a
            href="#solution"
            className="text-gray-800 hover:text-[#3596FF] font-noto text-xl"
          >
            Solution
          </a>
          <a
            href="#services"
            className="text-gray-800 hover:text-[#3596FF] font-noto text-xl"
          >
            Services
          </a>
          <a
            href="#whychooseus"
            className="text-gray-800 hover:text-[#3596FF] font-noto text-xl"
          >
            Why choose us
          </a>
          <a
            href="#news"
            className="text-gray-800 hover:text-[#3596FF] font-noto text-xl"
          >
            News
          </a>
          <a
            href="#pricing"
            className="text-gray-800 hover:text-[#3596FF] font-noto text-xl"
          >
            Pricing
          </a>
          <Link
            to={`${import.meta.env.VITE_BACKEND_SSO}?serviceURL=${
              import.meta.env.VITE_SERVICE_URL
            }`}
            className="text-gray-800 hover:text-[#3596FF] font-noto text-xl"
          >
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
