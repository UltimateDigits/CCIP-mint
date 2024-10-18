import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { selectCartItems } from "../redux/cartSlice";
import { useSelector } from "react-redux";
import { formatPhoneNumber } from "../functions/formatPhoneNumber";
import { switchChain } from '@wagmi/core'
import { arbitrumSepolia } from '@wagmi/core/chains'
import { config } from "../main";
import { ethers } from 'ethers';
import { uploadToIPFS } from "../functions/ipfs/uploadToIPF";
import checkTotalPrice from "../functions/checkTotalPrice";
import { RECEIVER_ADDRESS } from "../constants";
import { MINTARBITRUMNUMBERNFT } from "../contract/contractIntegration";

const MintSuccess = ({ onBridgeSuccess, setHash }) => {
    const account = useAccount();

    const cartArray = useSelector(selectCartItems);
    const [currentChain, setCurrentChain] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [networkSwitching, setNetworkSwitching] = useState(false);
    const currentAddress = account.address;
    const formattedPhoneNumbers = cartArray.map((phone) =>
        formatPhoneNumber(phone)
    ).join(", ");

    const handleNavigation = (path) => {
        navigate(path);
    };


    const BridgeArbitritum = async() => {
        console.log("will brige to arbi");
        const netchange = checkNetwork();
        if (!netchange) {
            buynumber();
        }
        else {
            console.log("network change problem");
        }
    }

    const switchNetwork = async (desiredChainId) => {
        try {
          const chainIdHex = `0x${desiredChainId.toString(16)}`;
          setNetworkSwitching(true); 
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
          });
          setCurrentChain(desiredChainId);
          buynumber();
        } catch (error) {
          if (error.code === 4902) {
            console.error('Chain not found in wallet, please add it.');
          } else {
            console.error('Failed to switch network:', error);
          }
        }
        finally {
          setNetworkSwitching(false); // Stop switching network
        }
      };

      const checkNetwork = async () => {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const { chainId } = await provider.getNetwork();
          setCurrentChain(chainId);
          if (chainId !== 421614) {
            switchNetwork(421614);
            return true;
          }
          return false;
        } else {
          console.error('MetaMask is not installed');
          return false;
        }
      };

      const buynumber = async () => {
        if (cartArray.length === 0) {
          setStatus("No phone numbers to mint.");
          return;
        }
      
        try {
          setLoading(true);
          setStatus("Uploading data to IPFS...");
      
          // Step 1: Upload data to IPFS
          const imageUrl = await uploadToIPFS('/src/contract/tokenAssets/ud-square-logo2.png');
          const metadata = {
            name: `UDWeb3Number UDW3N`,
            description: "This NFT represents ownership of virtual phone number in Arbitrum.",
            image: imageUrl,
            phoneNumbers: cartArray.map(number => `+999 ${formatPhoneNumber(number.toString())}`),
            owner: currentAddress,
            attributes: [
              {
                trait_type: "Phone Numbers",
                value: cartArray.map(number => `+999 ${formatPhoneNumber(number.toString())}`).join(", "),
              },
              {
                trait_type: "Owner Address",
                value: currentAddress,
              },
            ],
          };
          const tokenUri = await uploadToIPFS(JSON.stringify(metadata));
          console.log("Token URI: ", tokenUri);
      
          // Step 2: Mint the NFT
          setStatus("Minting in progress...");
          const totalPrice = checkTotalPrice(cartArray);
          if (isNaN(totalPrice) || totalPrice <= 0) {
            throw new Error("Invalid total price. Please check the input values.");
          }
      
          const transacamount = ethers.utils.parseUnits(totalPrice.toString(), "ether");
          console.log("Parsed Amount as BigNumber:", transacamount.toString());

            const result = await MINTARBITRUMNUMBERNFT({
              phoneNumbers: cartArray,
              tokenUri,
              address: RECEIVER_ADDRESS,
              amount: transacamount
            });
            if (result && result.hash) {
              setHash(result.hash);
              setStatus(`NFT minted successfully! Transaction Hash: ${result.hash}`);
              onBridgeSuccess();
            } else {
              throw new Error("Minting failed, no transaction hash returned.");
            }
        } catch (error) {
          console.error("Error during minting process:", error);
          setStatus(`Error: ${error.message || "An unexpected error occurred."}`);
        } finally {
          setLoading(false);
        }
      };
    

    return (
        <div className=" text-white">
            <div className="flex justify-center items-center">
                <div className="max-w-5xl mx-4 md:mx-0">
                    <div className="flex justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-14 text-green-500"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    <div className="text-center mx-6 md:mx-0">
                        <p className="text-base font-bold">Number linked!</p>
                        <p className="text-xs text-customText">
                            Congratulations! Your phone number has been linked to{" "}
                            <br className="hidden lg:flex" /> your chosen wallet address
                        </p>
                    </div>
                    <div className=" flex justify-center">
                        <div className="bg-[#181931] h-fit mt-2 p-2 px-4 w-[350px] md:w-full rounded-lg border border-[#7B8DB7]/20">
                            <p className="text-sm font-medium">Your current number</p>
                            <p className="text-xs text-customText pt-1">
                                +999 {formattedPhoneNumbers || "Enter your Phone Number"}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center py-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 text-green-600"
                        >
                            <path
                                fillRule="evenodd"
                                d="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    <div className=" flex justify-center">
                        <div className="bg-[#181931] h-[60px] mt-2 p-2 px-4 w-[350px] md:w-full rounded-lg border border-[#7B8DB7]/20">
                            <p className="text-sm font-medium">Wallet Address</p>
                            {/* Display the wallet address fetched from local storage */}
                            <p className="text-xs text-customText pt-1">
                                {account.address || "No wallet address linked"}
                            </p>
                        </div>
                    </div>
                    <div className="pt-4">
                      <motion.button
                          whileTap={{ scale: 0.9 }}
                          className={`font-bold text-sm p-2 w-full rounded-full ${loading || networkSwitching ? "bg-gray-400" : "bg-customBlue"} text-white border border-customBlue`}
                          onClick={BridgeArbitritum}
                          disabled={loading || networkSwitching} 
                      >
                        {networkSwitching
                                ? "Switching Network..."
                                : loading
                                ? "Bridging..."
                                : "Bridge to Arbitrum"}
                          {/* <p className={`font-bold text-sm p-2 w-full rounded-full ${loading ? "bg-gray-400" : "bg-customBlue"} text-white border border-customBlue`}>
                              {loading ? "Bridging ..." : "Bridge to Arbitrum"}
                              <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-6"
                              >
                                  <path
                                      fillRule="evenodd"
                                      d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                                      clipRule="evenodd"
                                  />
                              </svg>
                          </p> */}
                      </motion.button>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <footer className="text-sm text-center text-gray-500 bottom-0 p-2">
                    &copy; Ultimate Digits 2024
                </footer>
            </div>
        </div>
    );
};

export default MintSuccess;