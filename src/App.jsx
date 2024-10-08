import React from 'react'
import EnterNumber from './components/EnterNumber'

const App = () => {
  return (
    <div className="h-screen bg-cover bg-center bricolage-font pb-6 bg-gradient-to-t from-[#06061E] via-[#06061E] to-blue-950 flex justify-center items-center pt-3">
      <div className="p-3 space-y-3 " >
        <EnterNumber />
      </div>
    </div>
  )
}

export default App