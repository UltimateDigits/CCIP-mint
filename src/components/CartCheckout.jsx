import React from "react";
import { useSelector } from "react-redux";
import { selectCartItems } from "../redux/cartSlice";
import SimIcon from "../assets/sim.png";
import HeaderLogo from "../assets/ud-logo.png";
import { motion } from "framer-motion";
// import CartRightComp from "./CartRightComp";
import checkPrice from "../functions/checkPrice";
import checkTier from "../functions/checkTier";

const CartCheckout = ({ onNavigateToMintNFT }) => {
    const cartItems = useSelector(selectCartItems);
    const discountValue = 0.000;
    return (
        <div className="text-white inter-font">
            <div className=" w-[450px]">
                <div className=" bg-gradient-to-r from-blue-950 via-[#06061E] to-blue-950 border border-[#7B8DB7]/20 rounded-[10px] h-fit p-4">
                    <div className="">
                        <div className=" flex justify-center">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className=" "
                            >
                                <img
                                    className="h-6"
                                    src={HeaderLogo}
                                    alt="HeaderLogo"
                                />
                            </motion.button>
                        </div>
                        <div className="border-b border-[#7B8DB7]/20 w-full py-1"></div>
                        <div className="mx-4 pt-6">
                            <p className="text-base font-bold ">Your Cart</p>
                            <p className="text-xs text-customText">
                                Get your exclusive web3 phone number now
                            </p>
                            <div className="border-b-2 my-2 border-[#7B8DB7]/20 w-full"></div>

                            {/* Render items from the cart */}
                            {cartItems.map((item) => (
                                <div key={item} className=" flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-3">
                                        <img className=" h-6 w-6" src={SimIcon} alt="SimIcon" />
                                        <div className="">
                                            <p className="text-xs font-bold">
                                                {/* {item.tier} number */}
                                                <span className="capitalize">
                                                    {checkTier(item)}
                                                </span> number
                                            </p>
                                            <p className=" text-xs text-customText">
                                                {/* {item.number} */}
                                                +999 {item}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="">
                                        <p className=" font-semibold text-xs">
                                            {/* Ensure item.price is a number before calling .toFixed() */}
                                            ETH {parseFloat(checkPrice(item)).toFixed(3)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="border-b-2 my-2 border-[#7B8DB7]/20 w-full"></div>

                            {/* calculation */}
                            <div className="space-y-2">
                                <div className="">
                                    <div className=" flex items-center justify-between">
                                        <p className=" text-customText text-sm">Subtotal</p>
                                        <p className=" font-semibold text-xs">
                                            {/* BUSD {cartItems.reduce((total, item) => total + (typeof item.price === 'number' ? item.price : parseFloat(item.price)), 0).toFixed(2)} */}
                                            ETH {cartItems.reduce((total, item) => total + (parseFloat(checkPrice(item))), 0).toFixed(3)}
                                        </p>
                                    </div>
                                    {/* <div className=" flex items-center justify-between">
                                        <p className=" text-customText text-sm">Referral reward</p>
                                        <p className=" font-semibold text-xs">ETH {discountValue}</p>
                                    </div> */}
                                </div>
                                <div className="border-b-2 border-[#7B8DB7]/20 w-full"></div>
                                <div className="flex items-center justify-between">
                                    <p className=" font-bold text-sm">Total</p>
                                    <p className="font-semibold text-xs">
                                        ETH {(
                                            cartItems.reduce((total, item) => total + parseFloat(checkPrice(item)), 0) - discountValue
                                        ).toFixed(3)}
                                    </p>
                                </div>
                            </div>
                            <div className="border-b-2 my-2 border-[#7B8DB7]/20 w-full"></div>

                            {/* coupon redeem */}
                            <div className="mx-2">
                                {/* <p className=" font-bold text-base">Coupon code</p>
                                <input
                                    type="text"
                                    placeholder="Enter your coupon code"
                                    className="mt-2 p-3 bg-[#1F2138] h-[34px] w-full rounded-lg border border-[#7B8DB7]/20"
                                />
                                <div className=" flex justify-center pt-3">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        className={`font-bold text-xs p-2 w-full rounded-full bg-customBlue text-white border border-customBlue`}
                                    >
                                        Add Coupon Code
                                    </motion.button>
                                </div> */}
                                <div className=" flex justify-center pt-2">
                                    <motion.button
                                        onClick={onNavigateToMintNFT}
                                        whileTap={{ scale: 0.9 }}
                                        className={`font-bold text-xs p-2 w-full rounded-full bg-customBlue text-white border border-customBlue`}
                                    >
                                        Checkout
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* right section */}
                {/* <div className="lg:grid lg:col-span-3 bg-black h-full">
          <CartRightComp />
        </div> */}
            </div>
        </div>
    );
};

export default CartCheckout;