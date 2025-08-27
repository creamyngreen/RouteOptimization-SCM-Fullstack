import React from "react";
import Logo from '../../assets/Home/Logo/Logo.png';
import yellowmail from "../../assets/Footer/yellowmail.png";
import yellowtelephone from "../../assets/Footer/yellowtelephone.png";
import facebook from "../../assets/Footer/facebook.png";
import linkedin from "../../assets/Footer/linkedin.png";
import twitter from "../../assets/Footer/twitter.png";

const Footer = () => {
    return (
        <div className="bg-[#171717] text-white p-8">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* First Column: Logo and Contact Info */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center mb-8">
                        <img src={Logo} alt="EffiRoute Logo" className="h-12" />
                    </div>

                    <p className="text-medium font-inter ">
                        Leverage agile frameworks to provide a robust synopsis for strategy collaborative thinking to further the overall value proposition.
                    </p>

                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-[#111C55] border-2 border-[#273270] rounded-full flex items-center justify-center mr-2">
                            <img src={yellowmail} alt="Yellow Mail" className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold font-inter">Email</p>
                            <p className="text-sm font-inter">contact@effiroute.com</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-[#111C55] border-2 border-[#273270] rounded-full flex items-center justify-center mr-2">
                            <img src={yellowtelephone} alt="Yellow Phone" className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-semibold font-inter">Call Us</p>
                            <p className="text-sm font-inter">0123456789</p>
                        </div>
                    </div>
                </div>

                {/* Pages */}
                <div className="flex flex-col space-y-2 mt-5 font-inter">
                    <h2 className="font-bold text-xl font-inter mb-10">Pages</h2>
                    <p className="font-medium">About Us</p>
                    <p className="font-medium">Our Team</p>
                    <p className="font-medium">Our Project</p>
                    <p className="font-medium">Pricing</p>
                    <p className="font-medium">Contact</p>
                </div>

                {/* Utility */}
                <div className="flex flex-col space-y-2 mt-5 font-inter">
                    <h2 className="font-bold text-xl mb-10">Utility</h2>
                    <p className="font-medium">Style Guide</p>
                    <p className="font-medium">Change Log</p>
                    <p className="font-medium">Licenses</p>
                    <p className="font-medium">Protected</p>
                    <p className="font-medium">Not Found</p>
                </div>

                {/* Subscribe */}
                <div className="flex flex-col space-y-4 mt-5 font-inter">
                    <h2 className="font-semibold text-xl mb-8">Subscribe</h2>
                    <input
                        type="email"
                        placeholder="Email here*"
                        className="border border-[#4E5683] p-2 bg-transparent text-white placeholder-[#999999]"
                    />
                    <div className="flex items-center">
                        <button className="bg-[#F1580C] text-white px-4 py-2">Send Now</button>
                        <div className="flex space-x-4 ml-4">
                            <img src={linkedin} alt="LinkedIn" className="w-6 h-6" />
                            <img src={twitter} alt="Twitter" className="w-6 h-6" />
                            <img src={facebook} alt="Facebook" className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Horizontal Line */}
            <hr className="my-6 border-[#4E5683]" />

            {/* Copyright Text */}
            <div className="text-center text-sm">
                <p>Copyright © EffiRoute | Designed by creamyngreen</p>
            </div>
        </div>
    );
};

export default Footer;
