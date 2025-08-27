import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginImage from '../../assets/Login/LoginImage.jpg';
import back from '../../assets/Login/back.png';

const VerifyCode = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate(); 

    const handleVerify = (e) => {
        e.preventDefault();
        navigate('/reset-password'); 
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 font-poppins">
            <div className="bg-white shadow-lg rounded-lg flex w-4/5 max-w-5xl">
                {/* Left side */}
                <div className="w-1/2 p-10">
                    <Link to="/login" className="text-gray-600 text-sm mb-6 flex items-center space-x-2">
                        <img src={back} alt='Back' className="w-6 h-6" />
                        <span className='text-[#3869EB] text-xl font-semibold hover:text-blue-800'>Back to login</span>
                    </Link>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Verify code</h2>
                    <p className="text-gray-500 text-lg mb-6">An authentication code has been sent to your email.</p>
                    
                    <form onSubmit={handleVerify}>
                        <label className="block text-xl mb-2 text-gray-600">Enter Code</label>
                        <input 
                            type="text" 
                            placeholder="Enter the code you received"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded mb-4"
                        />
                        <p className="text-red-500 text-lg mb-4">Didn't receive a code? <Link to="#" className="text-blue-600 hover:underline">Resend</Link></p>
                        <button type="submit" className="w-full bg-blue-600 text-xl font-bold text-white p-3 rounded-lg hover:bg-blue-700">Verify</button>
                    </form>
                </div>

                {/* Right side */}
                <div className="w-1/2">
                    <img 
                        src={LoginImage} 
                        alt="Verification illustration"
                        className="object-cover w-full h-full rounded-r-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default VerifyCode;
