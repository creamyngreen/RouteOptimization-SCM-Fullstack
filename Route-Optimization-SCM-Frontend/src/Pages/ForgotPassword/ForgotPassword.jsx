import React from "react";
import { Link, useNavigate } from "react-router-dom";
import facebook from "../../assets/Login/facebook.png";
import google from "../../assets/Login/google.png";
import LoginImage from "../../assets/Login/LoginImage.jpg";
import back from "../../assets/Login/back.png";
const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/verify-code");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 font-poppins">
      <div className="bg-white shadow-lg rounded-lg flex w-4/5 max-w-5xl">
        {/* Left side */}
        <div className="w-1/2 p-10">
          <Link
            to="/login"
            className="text-gray-600 text-sm mb-6 font-semibold flex items-center space-x-2"
          >
            <img src={back} alt="Back" className="w-6 h-6 " />{" "}
            <span className="text-[#3869EB] text-xl hover:text-blue-800">
              Back to login
            </span>
          </Link>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Forgot your password?
          </h2>
          <p className="text-gray-500 text-lg mb-6">
            Don't worry, happens to all of us. Enter your email below to recover
            your password.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email input */}
            <label className="block mb-2 text-xl text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Please enter your email address"
              className="w-full p-3 border border-gray-300 rounded mb-4"
            />
            <button className="w-full bg-blue-600 text-white p-3 text-xl font-semibold rounded-lg hover:bg-blue-700">
              Submit
            </button>
          </form>

          {/* Social login options */}
          <div className="flex items-center mt-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span
              className="mx-4 text-center text-lg text-[#313131]"
              style={{ opacity: 0.5 }}
            >
              Or login with
            </span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <div className="flex justify-center mt-4 space-x-4">
            <button className="p-2 border border-gray-300 rounded-lg">
              <img src={facebook} alt="Facebook" className="w-6 h-6" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg">
              <img src={google} alt="Google" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Right side with image */}
        <div className="w-1/2">
          <img
            src={LoginImage}
            alt="Login illustration"
            className="object-cover w-full h-full rounded-r-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
