import React, { useEffect, useState } from "react";
import { formatPhoneNumber } from "../../functions/formatPhoneNumber";
import { useSelector } from "react-redux";
import { selectCartItems } from "../../redux/cartSlice";
import { useAccount } from "wagmi";
import { MINTNUMBERNFT } from "../../contract/contractIntegration";
import { uploadToIPFS } from "../../functions/ipfs/uploadToIPF";
import { GlobalURL, RECEIVER_ADDRESS } from "../../constants";
import checkTotalPrice from "../../functions/checkTotalPrice";
import { ethers } from "ethers";
import NumberNft from "./NumberNft";
import { motion } from "framer-motion";
import { connectWallet } from "../../App";

const MintNumber = ({ connectionType, setIsConnected, onMintSuccess }) => {
  const cartArray = useSelector(selectCartItems);
  const account = useAccount();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [coinbaseAddress, setCoinbaseAddress] = useState(null);
  const [wagmiAddress, setWagmiAddress] = useState(null);
  const currentAddress = connectionType === 'wagmi' ? wagmiAddress : coinbaseAddress;

  useEffect(() => {
    console.log("account address", currentAddress);
  }, [currentAddress]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (connectionType === 'coinbase') {
        const con = await connectWallet();
        if (con && con.address) {
          setCoinbaseAddress(con.address);
          setWagmiAddress(null);
        }
      } else if (connectionType === 'wagmi' && account.address) {
        setWagmiAddress(account.address);
        setCoinbaseAddress(null);
      }
      setIsConnected(!!(coinbaseAddress || account.address));
    };

    fetchAddress();
  }, [connectionType, account.address]);

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
        description: "This NFT represents ownership of a phone number.",
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
  
      // Handle minting based on connection type
      if (connectionType === 'wagmi') {
        const result = await MINTNUMBERNFT({
          phoneNumbers: cartArray,
          tokenUri,
          address: RECEIVER_ADDRESS,
          amount: transacamount,
         destSelector: "3478487238524512106",
         receiver: "0xcfa13bbF8bdf195280FCA71466BD0C4D941Db051",
         message:tokenUri
        });
        if (result && result.hash) {
          setStatus(`NFT minted successfully! Transaction Hash: ${result.hash}`);
        } else {
          throw new Error("Minting failed, no transaction hash returned.");
        }
      } else if (connectionType === 'coinbase') {
        // Call the mintCoinbase function for Coinbase wallet
        const result = await mintCoinbase({
          phoneNumbers: cartArray,
          tokenUri,
          amount: transacamount,
        });
        if (result && result.hash) {
          setStatus(`NFT minted successfully on Coinbase! Transaction Hash: ${result.hash}`);
        } else {
          throw new Error("Minting failed on Coinbase, no transaction hash returned.");
        }
      }
  
      setStatus("Adding virtual number to the backend...");
      const virtualNumbers = cartArray.map(number => formatPhoneNumber(number.toString()));
      const response = await fetch(`${GlobalURL}/user/addVirtual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: currentAddress,
          virtualNumber: virtualNumbers,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setStatus(`Virtual number added successfully. ${data.message}`);
        onMintSuccess();
      } else {
        const errorData = await response.json();
        setStatus(`Failed to add virtual number. ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during minting process:", error);
      setStatus(`Error: ${error.message || "An unexpected error occurred."}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Define the mintCoinbase function
  const mintCoinbase = async ({ phoneNumbers, tokenUri, amount }) => {
    // Implement the minting logic for the Coinbase wallet here
    // For example, you might use a specific contract method for Coinbase
    // Make sure to return the result with a transaction hash
  };
  
  return (
    <div className="text-white inter-font">
      
        <div className="flex justify-center items-center pt-16">
          <div className="max-w-7xl mx-4 md:mx-0 space-y-6">
            <div className="flex justify-center">
              <NumberNft />
            </div>
            <div className="text-center">
              <p className="font-bold text-base">Purchase Confirmation</p>
              <p className="text-customText text-sm">
                Number owner will be assigned to the following wallet address:
              </p>
              <p className="hidden md:flex font-bold mt-2 text-center">{currentAddress}</p>
              <div className="pt-2">
                <motion.button
                  onClick={buynumber}
                  whileTap={{ scale: 0.9 }}
                  className={`font-bold text-sm p-2 w-full rounded-full ${loading ? "bg-gray-400" : "bg-customBlue"} text-white border border-customBlue`}
                  disabled={loading}
                >
                  {loading ? "Minting..." : "Link your number to a wallet"}
                </motion.button>
              </div>
              {status && <p className="text-red-500 pt-5">{status}</p>}
            </div>
          </div>
        </div>
    </div>
  );
};

export default MintNumber;