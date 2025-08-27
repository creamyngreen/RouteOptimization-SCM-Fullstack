import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import facebook from '../../assets/Login/facebook.png';
import google from '../../assets/Login/google.png';
import LoginImage from '../../assets/Login/LoginImage.jpg';
import Logo from '../../assets/Home/Logo/Logo.png';
import back from '../../assets/Login/back.png';
const Login = () => {
    const navigate = useNavigate(); 

    const handleBack = () => {
        navigate('/'); 
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 font-poppins">
            <div className="bg-white shadow-lg rounded-lg flex w-4/5 max-w-5xl">
                {/* Left side */}
                <div className="xl:w-1/2 p-10 sm:w-full">
                    <div className="flex justify-between items-center mb-6 text-2xl">
                        {/* Back Button */}
                        <button
                            onClick={handleBack}
                            className="text-[#3869EB] hover:text-blue-800 font-semibold flex items-center space-x-2"
                        >
                            <img src={back} alt = 'Back' className="w-6 h-6"/>
                            <span>Back</span>
                        </button>
                    </div>

                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Login</h2>
                    <p className="text-gray-500 text-lg mb-6">Login to access your EffiRoute account</p>
                    
                    <form>
                        {/* Email input */}
                        <label className="block text-xl mb-2 text-gray-600">Email</label>
                        <input 
                            type="email" 
                            placeholder="Please enter your email address"
                            className="w-full p-3 border border-gray-300 rounded mb-4"
                        />
                        
                        {/* Password input */}
                        <label className="block text-xl mb-2 text-gray-600">Password</label>
                        <input 
                            type="password" 
                            placeholder="Please enter your password"
                            className="w-full p-3 border border-gray-300 rounded mb-4"
                        />

                        <div className="flex justify-between items-center mb-6 text-lg">
                            <label className="flex items-center font-medium">
                                <input type="checkbox" className="mr-2"/>
                                Remember me
                            </label>
                            <a href="/forgot-password" className="text-red-500">Forgot Password</a>
                        </div>
                        
                        <button className="w-full bg-[#3869EB] text-white p-3  text-xl font-semibold rounded-lg hover:bg-blue-700">Login</button>
                    </form>

                    {/* Social login options */}
                    <div className="flex items-center mt-4">
                        <hr className="flex-grow border-t border-gray-300" />
                        <span className="mx-4 text-center text-lg text-[#313131]" style={{ opacity: 0.5 }}>Or login with</span>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    <div className="flex justify-center mt-4 space-x-4">
                        <button className="p-2 border border-gray-300 rounded-lg">
                            <img src={facebook} alt="Facebook" className="w-6 h-6"/>
                        </button>
                        <button className="p-2 border border-gray-300 rounded-lg">
                            <img src={google} alt="Google" className="w-6 h-6"/>
                        </button>
                    </div>
                </div>

                {/* Right side */}
                <div className="w-1/2 ">
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

export default Login;
