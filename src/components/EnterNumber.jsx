import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import Telephone from "../assets/Telephone.png";
import UDlogo from "../assets/logo.png";
import { setNumber, selectNumber } from '../redux/numberSlice'; // Import your actions and selectors

const EnterNumber = ({ onSearch }) => {
  const dispatch = useDispatch();
  const storedNumber = useSelector(selectNumber); // Access the number from the Redux store
  const [inputValue, setInputValue] = React.useState(storedNumber.replace("+999 ", "")); // Format for display

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, []);

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const trimmed = cleaned.substring(0, 10);
    return trimmed.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (rawValue.length <= 10) {
      const formattedValue = formatPhoneNumber(rawValue);
      setInputValue(formattedValue);
      dispatch(setNumber(formattedValue)); // Store only the numeric value without the prefix
    }
  };

  const handleSearchClick = () => {
    const cleanedInput = inputValue.replace(/\s+/g, ""); // Remove spaces from input
  
    if (cleanedInput.length === 10) { // Only trigger search if valid input
      onSearch(inputValue); // Pass the formatted input value to the parent component
    } else {
      alert("Please enter a valid 10-digit number");
    }
  };
  
  return (
    <div>
      <div className="flex justify-center items-center text-white">
        <div className=" mx-4 md:mx-0 space-y-3">
          <img className="h-12 w-12 mx-auto" src={UDlogo} alt="UD - Logo" />
          <p className="text-2xl md:text-3xl text-center font-bold">
            Your Web3 Mobile Number
          </p>
          <p className="text-base text-center text-customText">
            Your custom mobile number. Your Web3 identity.
          </p>
          <div className="flex items-center justify-center h-[72px] w-[450px]">
            <div className="flex items-center w-full bg-[#2e2e48] text-white rounded-lg border border-[#7B8DB7]/20 shadow-lg overflow-hidden">
              <div className="flex items-center justify-center p-4 bg-[#384160] h-[72px] rounded-l-lg">
                <img className="w-10 h-10" src={Telephone} alt="Telephone" />
              </div>
              <div className="flex-grow p-3">
                <label className="block text-sm font-semibold">
                  Phone number
                </label>
                <div className="flex items-center">
                  <span className="text-[#A7C3FB] font-semibold">+999</span>
                  <input
                    type="text"
                    placeholder="XXX XXX XXXX"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="bg-transparent border-none text-customText font-medium focus:outline-none focus:ring-0 w-full ml-2"
                  />
                </div>
              </div>
              <motion.button
                onClick={handleSearchClick}
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
  );
};

export default EnterNumber;
