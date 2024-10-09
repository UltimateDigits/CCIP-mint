import React, { useState } from 'react';
import EnterNumber from './components/EnterNumber';
import SearchResults from './components/SearchResults';
import CartCheckout from './components/CartCheckout'; 
import MintNFT from './components/nft/MintNumber';
import MintSuccess from './components/Successful';
import { GlobalURL } from './constants';
import { useAccount } from 'wagmi'


export async function connectWallet() {
  try {
    const addresses = await provider.request({ method: 'eth_requestAccounts' });
    const address = addresses[0]; // Return the connected address
    const balanceInWei = await provider.request({
      method: 'eth_getBalance',
      params: [address, 'latest'], // Pass the address and 'latest' block
    });
    // const balanceInEth = provider.utils.fromWei(balanceInWei, 'ether');
    return {
      address,
      balance: balanceInWei
    }
  } catch (error) {
    if (error.code === 4001) {
      console.warn('User rejected the request to connect wallet.');
    } else {
      console.error('Error connecting to wallet:', error);
    }
    return null; // Return null if there's an error
  }
}


const App = () => {
  const [showSearchResults, setShowSearchResults] = useState(false); // State to toggle between components
  const [searchInput, setSearchInput] = useState(''); // Store the search input value
  const [showCartCheckout, setShowCartCheckout] = useState(false); // New state for CartCheckout
  const [showMintNFT, setShowMintNFT] = useState(false); // New state for MintNFT
  const [showMintSuccess, setShowMintSuccess] = useState(false); // New state for MintSuccess

  // Function to handle showing search results
  const handleSearch = (inputValue) => {
    setSearchInput(inputValue); // Store the phone number
    setShowSearchResults(true); // Switch to SearchResults component
  };

  const handleNavigationToCheckout = () => {
    setShowCartCheckout(true); // Trigger showing CartCheckout component
  };

  const handleNavigationToMintNFT = () => {
    setShowMintNFT(true); // Trigger showing MintNFT component
    setShowCartCheckout(false); // Hide CartCheckout when navigating to MintNFT
  };

  const handleMintSuccess = () => {
    setShowMintSuccess(true); // Show MintSuccess component
    setShowMintNFT(false); // Hide MintNFT component
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center bricolage-font pb-6 bg-gradient-to-t from-[#06061E] via-[#06061E] to-blue-950 flex justify-center items-center inter-font">
      <div className="space-y-3">
        {showMintSuccess ? ( // Conditionally render MintSuccess component
          <MintSuccess />
        ) : showMintNFT ? ( // Conditionally render MintNFT component
          <MintNFT onMintSuccess={handleMintSuccess} /> // Pass function to MintNFT
        ) : showCartCheckout ? ( 
          <CartCheckout onNavigateToMintNFT={handleNavigationToMintNFT} /> // Pass function to CartCheckout
        ) : showSearchResults ? (
          <SearchResults searchInput={searchInput} onNavigateToCheckout={handleNavigationToCheckout} /> // Display SearchResults with searchInput
        ) : (
          <EnterNumber onSearch={handleSearch} /> // Pass the handleSearch function to EnterNumber
        )}
      </div>
    </div>
  );
};

export default App;