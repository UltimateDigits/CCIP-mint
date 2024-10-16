// import Nft from "../contract/abi/contract.json";
import SenderCon from "../contract/abi/NFTSender.json";
import ReceiverCon from "../contract/abi/NFTReceiver.json";
import { ethers } from "ethers";
import Web3 from "web3";
import {BASE_SEPOLIA_CONTRACT_ADDRESS, SEPOLIA_CONTRACT_ADDRESS} from "../constants";

const isBrowser = () => typeof window !== "undefined";
const { ethereum } = isBrowser();

if (ethereum) {
  isBrowser().web3 = new Web3(ethereum); 
  isBrowser().web3 = new Web3(isBrowser().web3.currentProvider);
}

export const MINTNUMBERNFT = async ({ destinationChainSelector, receiver, toAddress, amount, text }) => {
  console.log("Minting with parameters:", { destinationChainSelector, receiver, toAddress, amount, text });
  try {
    const provider = window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();

    const signer = provider.getSigner();
    const Role = new ethers.Contract(SEPOLIA_CONTRACT_ADDRESS, SenderCon, signer);
    const tokenId = await Role.sendMessage(destinationChainSelector, receiver, toAddress, amount, text, { value: amount });
    return tokenId;
  } catch (error) {
    console.error('Error minting NFT:', error.message, error);
  }
};

export const BRIDGENFT = async ({ text }) => {
  try {
    const provider = window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();

    const signer = provider.getSigner();
    const Role = new ethers.Contract(BASE_SEPOLIA_CONTRACT_ADDRESS, ReceiverCon, signer);

    const tokenId = await Role.mintNFTDestination(test);
    return tokenId;
  } catch (error) {
    console.error('Error minting NFT:', error.message, error);
  }
};

export const GETLASTMESSAGE = async () => {
      try {
          const provider = 
          window.ethereum != null
            ? new ethers.providers.Web3Provider(window.ethereum)
            : ethers.providers.getDefaultProvider();
      
          const signer = provider.getSigner();
          const Role = new ethers.Contract(BASE_SEPOLIA_CONTRACT_ADDRESS, ReceiverCon, signer);
          const answer = await Role.getLastReceivedMessageDetails();
          return answer;
      } catch (error) {
          console.error('Error fetching memo:', error);
      }
  }