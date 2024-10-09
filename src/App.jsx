import React, { useState } from 'react';
import EnterNumber from './components/EnterNumber';
import SearchResults from './components/SearchResults'; 

const App = () => {
  const [showSearchResults, setShowSearchResults] = useState(false); // State to toggle between components
  const [searchInput, setSearchInput] = useState(''); // Store the search input value

  // Function to handle showing search results
  const handleSearch = (inputValue) => {
    setSearchInput(inputValue); // Store the phone number
    setShowSearchResults(true); // Switch to SearchResults component
  };

  return (
    <div className="min-h-screen bg-cover bg-center bricolage-font pb-6 bg-gradient-to-t from-[#06061E] via-[#06061E] to-blue-950 flex justify-center items-center">
      <div className="space-y-3">
        {showSearchResults ? (
          <SearchResults searchInput={searchInput} /> // Display SearchResults with searchInput
        ) : (
          <EnterNumber onSearch={handleSearch} /> // Pass the handleSearch function to EnterNumber
        )}
      </div>
    </div>
  );
};

export default App;
