import React from 'react';

const BridgeSuccess = ({ hash }) => {
  return (
    <div className='text-white text-center'>
        <div className='font-bold text-base'>
            Bridging Successful
        </div>
        <div className='text-base font-semibold pt-2'>
            Arbitrum Transaction Hash:
        </div>
        <a className='text-base cursor-pointer pt-2 underline' href={`https://sepolia.arbiscan.io/tx/${hash}`} target='_blank'>
            {hash}
        </a>
    </div>
  )
}

export default BridgeSuccess;
