import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Telephone from "../assets/Telephone.png"
import UDlogo from "../assets/logo.png"

const EnterNumber = () => {

    return (
        <div>
            <div className="flex justify-center items-center text-white">
                <div className="max-w-7xl mx-4 md:mx-0 space-y-3">
                    <img className="h-12 w-12 mx-auto" src={UDlogo} alt="UD - Logo" />
                    <p className="text-2xl md:text-3xl text-center font-bold">
                        Your Web3 Mobile Number
                    </p>
                    <p className="text-base text-center text-customText">
                        Your custom mobile number. Your Web3 identity. <br className="hidden md:block " /> The only
                        wallet address you ever need to share.
                    </p>
                    <div className="flex items-center justify-center h-[72px] w-[450px]">
                        <div className="flex items-center w-full bg-[#2e2e48] text-white rounded-lg border border-[#7B8DB7]/20 shadow-lg overflow-hidden">
                            {/* Telephone Icon */}
                            <div className="flex items-center justify-center p-4 bg-[#384160] h-[72px] rounded-l-lg">
                                <img className="w-10 h-10" src={Telephone} alt="Telephone" />
                            </div>

                            {/* Input Field */}
                            <div className="flex-grow p-3">
                                <label className="block text-sm font-semibold">
                                    Phone number
                                </label>
                                <div className="flex items-center">
                                    <span className="text-[#A7C3FB] font-semibold">+999</span>
                                    <input
                                        type="text"
                                        placeholder="XXX XXX XXXX"
                                        //   value={inputValue}
                                        //   onChange={handleInputChange}
                                        className="bg-transparent border-none text-customText font-medium focus:outline-none focus:ring-0 w-full ml-2"
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <motion.button
                                onClick={() => handleNavigation(`/virtual-number/search-results?n=${inputValue}`)}
                                whileTap={{ scale: 0.9 }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 h-[72px] rounded-r-lg"
                            >
                                Search
                            </motion.button>
                        </div>
                    </div>
                    <p className="text-customText text-center">
                        <span className="italic text-customBlue">#</span> Enter minimum 10 digits
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EnterNumber