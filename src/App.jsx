import React, { useState } from 'react';
import EnterNumber from './components/EnterNumber';
import SearchResults from './components/SearchResults';
import CartCheckout from './components/CartCheckout'; // Import CartCheckout

const App = () => {
  const [showSearchResults, setShowSearchResults] = useState(false); // State to toggle between components
  const [searchInput, setSearchInput] = useState(''); // Store the search input value
  const [showCartCheckout, setShowCartCheckout] = useState(false); // New state for CartCheckout

  // Function to handle showing search results
  const handleSearch = (inputValue) => {
    setSearchInput(inputValue); // Store the phone number
    setShowSearchResults(true); // Switch to SearchResults component
  };

  const handleNavigationToCheckout = () => {
    setShowCartCheckout(true); // Trigger showing CartCheckout component
  };


  return (
    <div className="min-h-screen w-full bg-cover bg-center bricolage-font pb-6 bg-gradient-to-t from-[#06061E] via-[#06061E] to-blue-950 flex justify-center items-center inter-font">
      <div className="space-y-3">
        {showCartCheckout ? ( 
          <CartCheckout  /> // Conditionally render CartCheckout
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
