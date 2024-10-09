import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TickIcon from "../assets/tick.png";
import Cross from "../assets/cross-icon.svg";
import BASE from "../assets/base.webp";
import SimcardIcon from "../assets/sim.png";
import { useDispatch, useSelector } from "react-redux";
import { selectNumber } from "../redux/numberSlice";
import { motion } from "framer-motion";
import checkTier from "../functions/checkTier";
import checkPrice from "../functions/checkPrice";
import BronzeTier from "./tiers-components/bronzeTier";
import DiamondTier from "./tiers-components/diamondTier";
import GoldTier from "./tiers-components/goldTier";
import SilverTier from "./tiers-components/silverTier";
import { formatPhoneNumber } from "../functions/formatPhoneNumber"; 
import { addItemToCart, removeItemFromCart, selectCartItems } from "../redux/cartSlice";

const SearchResultComp = ({ number, showAvailability, available, isLast, isFirst, displayedTiers }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector(selectCartItems);

  const [tier, setTier] = useState("diamond");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setAddedToCart(cart.some((item) => item === number));
  }, [cart, number]);

  const onClick = () => {
    if (addedToCart) {
      dispatch(removeItemFromCart(number)); // Remove from cart in Redux
    } else {
      dispatch(addItemToCart(number)); // Add to cart in Redux
    }
  };  

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const currentTier = checkTier(number);
    setTier(currentTier);
    console.log("Tier", currentTier);
  }, [number]);

  // Ensure displayedTiers is defined and check if the tier has already been displayed
  if (!displayedTiers || !displayedTiers.has(tier)) {
    if (displayedTiers) {
      displayedTiers.add(tier); // Add the current tier to the displayed tiers
    }
  } else {
    return null; // Skip rendering if this tier is already displayed
  }

  return (
    <div className="text-white">
      <div className={`w-[365px] md:w-full bg-[#2e2e48] rounded-lg p-1 md:p-3 ${isFirst ? 'border border-green-500' : 'border-none'}`}>
        <div className="flex items-center">
          <div className="flex flex-1 items-center gap-1 md:gap-6">
            <img className="h-6" src={showAvailability ? (available ? TickIcon : Cross) : SimcardIcon} alt="Availability Icon" />
            <div className="text-center text-xs">
              <input
                type="text"
                placeholder="XXX XXX XXXX"
                value={`+999 /${number ? formatPhoneNumber(number) : ''}`}
                readOnly
                className="bg-transparent border-none text-white text-xs font-medium focus:outline-none focus:ring-0 w-full"
              />
              <div className="md:flex gap-2 space-y-1 md:space-y-0">
                {showAvailability && (
                  <p
                    className={`w-fit h-fit text-[10px] p-1 px-2 rounded-full font-bold ${available ? "bg-[#489D5D]" : "bg-[#FF9900]"}`}
                  >
                    {available ? "Available" : "Unavailable"}
                  </p>
                )}
                <p className="">
                  {tier === 'diamond' ? (
                    <DiamondTier />
                  ) : tier === 'golden' ? (
                    <GoldTier />
                  ) : tier === 'silver' ? (
                    <SilverTier />
                  ) : tier === 'bronze' ? (
                    <BronzeTier />
                  ) : (
                    "NA"
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img className="h-4" src={BASE} alt="BASE" />
                <p className="font-bold w-16 text-xs">{checkPrice(number)} ETH</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`font-bold text-xs p-2 rounded-full w-24 transition-colors duration-300 ${
                  addedToCart
                    ? "bg-transparent border border-customBlue text-white shadow-customBlue shadow-md"
                    : "bg-customBlue text-white border border-customBlue"
                }`}
                onClick={onClick}
              >
                {addedToCart ? `Remove` : `Add to Cart`}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      {/* Conditionally render border for all except the last item */}
      {!isLast && (
        <div className={`mx-3 border-b border-b-[#7B8DB7]/20 ${isFirst ? 'mt-2' : ''}`}></div>
      )}
    </div>
  );
};

export default SearchResultComp;
