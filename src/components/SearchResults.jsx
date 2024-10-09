import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectNumber } from "../redux/numberSlice";
import { addItemToCart, clearCart, selectCartItems } from "../redux/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import Telephone from "../assets/Telephone.png";
import SearchResultComp from "./SearchResultComp";
import { generateDiamondNumbers } from '../functions/diamond-numbers/generateDiamondNumbers';
import { generateGoldNumbers } from '../functions/gold-numbers/generateGoldNumbers';
import { generateSilverNumbers } from '../functions/silver-numbers/generateSilverNumbers';
import { generateRandomNumbers } from '../functions/random-numbers/generateRandomNumbers';
import { GlobalURL } from "../constants";
import axios from "axios";

const SearchResult = ({ onNavigateToCheckout }) => {
  const dispatch = useDispatch();
  const storedNumber = useSelector(selectNumber);
  const cart = useSelector(selectCartItems);
  const [showModal, setShowModal] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const [queryParam, setQueryParam] = useState(searchParams.get("n") || "");
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [tierNumbers, setTierNumbers] = useState({
    diamond: [],
    gold: [],
    silver: [],
    random: [],
  });
  
  const [ava, setAva] = useState(true);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const generateNumbers = async () => {
    try {
      const diamondNums = await generateDiamondNumbers(queryParam);
      const goldNums = await generateGoldNumbers(queryParam);
      const silverNums = await generateSilverNumbers(queryParam);
      const randomNums = generateRandomNumbers();

      // Set numbers categorized by tier
      setTierNumbers({
        diamond: diamondNums,
        gold: goldNums,
        silver: silverNums,
        random: randomNums,
      });

      // Combine all numbers
      setGeneratedNumbers([...diamondNums, ...goldNums, ...silverNums, ...randomNums]);
    } catch (error) {
      console.error("Error generating numbers:", error);
    }
  };

  const checkAccFunc = async () => {
    try {
      const res = await axios.post(`${GlobalURL}/coinbase/getvirtuals`, {
        number: queryParam,
      });

      if (res.status === 204) {
        setAva(true);
      } else {
        setAva(false);
      }
    } catch (error) {
      console.log("error in checking number", error);
    }
  };

  useEffect(() => {
    console.log("Cart", cart);
    setShowModal(cart.length > 0);
  }, [cart]);

  useEffect(() => {
    setQueryParam(searchParams.get("n"));
    generateNumbers();
    checkAccFunc();
    dispatch(clearCart());
  }, [queryParam]);

  const getUniqueTierNumbers = () => {
    const uniqueNumbers = [];

    // Push one number from each tier into the uniqueNumbers array
    if (tierNumbers.diamond.length > 0) {
      uniqueNumbers.push(tierNumbers.diamond[0]); // Get the first diamond number
    }
    if (tierNumbers.gold.length > 0) {
      uniqueNumbers.push(tierNumbers.gold[0]); // Get the first gold number
    }
    if (tierNumbers.silver.length > 0) {
      uniqueNumbers.push(tierNumbers.silver[0]); // Get the first silver number
    }
    // Add a random number if available
    if (tierNumbers.random.length > 0) {
      uniqueNumbers.push(tierNumbers.random[0]); // Get the first random number
    }

    return uniqueNumbers;
  };

  return (
    <div className="text-white inter-font">
      <div className="flex justify-center items-center">
        <div className="max-w-4xl mx-4 md:mx-0 space-y-1">

          <div className=" space-y-0">
            <p className="text-2xl font-bold text-center">Search results</p>
            <p className="text-xs text-customText text-center">
              The number you are looking for is available!
            </p>
          </div>

          <div className="mx-2 md:mx-0 ">
            <SearchResultComp
              number={storedNumber}
              showAvailability={true}
              available={ava}
              isFirst={true} 
            />
          </div>
          <div className=" mx-2 md:mx-0">
            <p className="text-center font-bold text-xl">Similar Numbers</p>
            <div className="w-[370px] md:w-full bg-[#2e2e48] border-2 border-[#7B8DB7]/20 rounded-lg pt-1">
              {getUniqueTierNumbers().map((number, i) => (
                <SearchResultComp
                  number={number}
                  showAvailability={false}
                  key={i}
                  isLast={i === getUniqueTierNumbers().length - 1} // true for the last item
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Cart Summary with Smooth Transition */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.5 }}
            className="fixed inset-x-0 bottom-0 p-4 bg-blue-950 border-t border-t-customBlue"
          >
            <div className="flex justify-center items-center gap-4">
              <motion.button
                onClick={onNavigateToCheckout}
                whileTap={{ scale: 0.9 }}
                className="font-bold text-xs p-2 px-4 rounded-full bg-customBlue text-white border border-customBlue"
              >
                Continue to Cart
              </motion.button>
              <p className="text-white text-xs font-bold flex items-center">
                Your Cart:
                <div className="text-[#508FF6] bg-[#639BF7]/40 h-8 w-8 rounded-full flex items-center justify-center ml-2">
                  {cart.length}
                </div>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResult;
