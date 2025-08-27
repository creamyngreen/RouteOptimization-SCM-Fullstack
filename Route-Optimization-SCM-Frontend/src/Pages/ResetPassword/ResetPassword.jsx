import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import facebook from '../../assets/Login/facebook.png';
import google from '../../assets/Login/google.png';
import LoginImage from '../../assets/Login/LoginImage.jpg';
import Logo from '../../assets/Home/Logo/Logo.png';
import back from '../../assets/Login/back.png';
const ResetPassword = () => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/verify-code'); 
    };
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 font-poppins">
            <div className="bg-white shadow-lg rounded-lg flex w-4/5 max-w-5xl">
                {/* Left side */}
                <div className="w-1/2 p-10">
                    <div className="flex justify-between items-center text-xl font-semibold mb-6">
                        {/* Back Button */}
                        <button
                            onClick={handleBack}
                            className="text-[#3869EB] hover:text-blue-800 flex items-center space-x-2"
                        >
                            <img src={back} alt = 'Back' className="w-6 h-6"/>
                            <span>Back to login </span>
                        </button>
                    </div>

                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Set a password</h2>
                    <p className="text-gray-500 text-lg mb-6">Your previous password has been reseted. Please set a new password for your account</p>
                    
                    <form>
                        {/* Password input */}
                        <label className="block text-sm mb-2 text-xl text-gray-600">Create Password</label>
                        <input 
                            type="password" 
                            placeholder="Please enter your new password"
                            className="w-full p-3 border border-gray-300 rounded mb-4"
                        />
                        
                        {/* Re-type Password input */}
                        <label className="block text-sm mb-2 text-xl text-gray-600">Re-enter Password</label>
                        <input 
                            type="password" 
                            placeholder="Please re-enter your password"
                            className="w-full p-3 border border-gray-300 rounded mb-4"
                        />

                        
                        
                        <button className="w-full bg-[#3869EB] text-white p-3 font-semibold text-xl rounded-lg hover:bg-blue-700">Set password</button>
                    </form>

                    
                </div>

                {/* Right side */}
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

export default ResetPassword;
